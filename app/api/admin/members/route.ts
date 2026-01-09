import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Member } from "@/lib/types"

const PAGE_SIZE = 50

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("customer_number", { ascending: true })
      .range(from, to)

    if (error) {
      console.error("Error fetching members:", error)
      return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
    }

    return NextResponse.json({ members: data || [] })
  } catch (error: any) {
    console.error("Error in GET /api/admin/members:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { members } = body as { members: Omit<Member, "id" | "created_at">[] }

    if (!members || !Array.isArray(members)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { generateCuid2Token } = await import("@/lib/token")

    let updated = 0
    let inserted = 0

    for (const member of members) {
      // Check if member exists
      const { data: existing } = await supabase
        .from("members")
        .select("customer_number, token")
        .eq("customer_number", member.customer_number)
        .single()

      if (existing) {
        // Update existing member - keep existing token
        const updateData: Partial<Member> = {
          salutation: member.salutation,
          first_name: member.first_name,
          last_name: member.last_name,
          name2: member.name2,
          street: member.street,
          postal_code: member.postal_code,
          city: member.city,
          email: member.email,
          phone: member.phone,
          mobile: member.mobile,
          communication_preference: member.communication_preference,
          notes: member.notes,
          expiry_date: member.expiry_date,
        }

        const { error: updateError } = await supabase
          .from("members")
          .update(updateData)
          .eq("customer_number", member.customer_number)

        if (updateError) throw updateError
        updated++
      } else {
        // Insert new member - generate new token
        const newMember = {
          ...member,
          token: member.token || generateCuid2Token(),
        }
        const { error: insertError } = await supabase.from("members").insert(newMember)
        if (insertError) throw insertError
        inserted++
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
      updated,
      total: members.length,
    })
  } catch (error: any) {
    console.error("Error in POST /api/admin/members:", error)
    return NextResponse.json({ error: error.message || "Failed to save members" }, { status: 500 })
  }
}
