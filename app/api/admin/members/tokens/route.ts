import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { generateCuid2Token } from "@/lib/token"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { weeks } = await request.json()
    if (!weeks || typeof weeks !== "number") {
      return NextResponse.json({ error: "Invalid weeks parameter" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const now = new Date()
    const expiryDate = new Date(now.getTime() + weeks * 7 * 24 * 60 * 60 * 1000)

    // Fetch all members
    const allMembers: { customer_number: string }[] = []
    const pageSize = 1000
    let from = 0
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabase
        .from("members")
        .select("customer_number")
        .range(from, from + pageSize - 1)

      if (error) throw error

      if (data && data.length > 0) {
        allMembers.push(...data)
        from += pageSize
        hasMore = data.length === pageSize
      } else {
        hasMore = false
      }
    }

    // Update all members with new expiry (keep existing tokens)
    let updated = 0
    for (const member of allMembers) {
      const { error: updateError } = await supabase
        .from("members")
        .update({
          expiry_date: expiryDate.toISOString(),
        })
        .eq("customer_number", member.customer_number)

      if (updateError) {
        console.error(`Error updating member ${member.customer_number}:`, updateError)
        continue
      }
      updated++
    }

    return NextResponse.json({
      success: true,
      updated,
      total: allMembers.length,
    })
  } catch (error: any) {
    console.error("Error in POST /api/admin/members/tokens:", error)
    return NextResponse.json({ error: error.message || "Failed to generate tokens" }, { status: 500 })
  }
}
