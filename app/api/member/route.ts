import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isValidTokenFormat } from "@/lib/token"
import type { Member } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Validate token format
    if (!isValidTokenFormat(token)) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Fetch member by token with expiry check
    const { data: member, error } = await supabase
      .from("members")
      .select("*")
      .eq("token", token)
      .gt("expiry_date", new Date().toISOString())
      .single()

    if (error || !member) {
      return NextResponse.json({ error: "Token not found or expired" }, { status: 404 })
    }

    // Additional expiry check
    const expiryDate = new Date(member.expiry_date)
    const now = new Date()

    if (now > expiryDate) {
      return NextResponse.json({ error: "Token expired" }, { status: 403 })
    }

    return NextResponse.json({ member: member as Member })
  } catch (error: any) {
    console.error("Error in GET /api/member:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
