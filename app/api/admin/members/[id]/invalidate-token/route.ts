import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const supabase = createAdminClient()

    // Set expiry to past to invalidate token
    const pastDate = new Date(0).toISOString()

    const { error } = await supabase
      .from("members")
      .update({
        expiry_date: pastDate,
      })
      .eq("customer_number", id)

    if (error) {
      console.error("Error invalidating token:", error)
      return NextResponse.json({ error: "Failed to invalidate token" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in POST /api/admin/members/[id]/invalidate-token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
