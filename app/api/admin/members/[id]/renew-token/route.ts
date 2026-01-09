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
    const { weeks } = await request.json()

    if (!weeks || typeof weeks !== "number") {
      return NextResponse.json({ error: "Invalid weeks parameter" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const now = new Date()
    const expiryDate = new Date(now.getTime() + weeks * 7 * 24 * 60 * 60 * 1000)

    const { error } = await supabase
      .from("members")
      .update({
        expiry_date: expiryDate.toISOString(),
      })
      .eq("customer_number", id)

    if (error) {
      console.error("Error renewing token:", error)
      return NextResponse.json({ error: "Failed to renew token" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in POST /api/admin/members/[id]/renew-token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
