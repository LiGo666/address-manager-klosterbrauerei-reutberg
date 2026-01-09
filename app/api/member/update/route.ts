import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isValidTokenFormat } from "@/lib/token"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, street, postal_code, city, email, phone, mobile, communication_preference, notes } = body

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Validate token format
    if (!isValidTokenFormat(token)) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 400 })
    }

    if (!street || !postal_code || !city) {
      return NextResponse.json({ error: "Street, postal code, and city are required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // First, verify token is valid and not expired
    const { data: member, error: fetchError } = await supabase
      .from("members")
      .select("*")
      .eq("token", token)
      .gt("expiry_date", new Date().toISOString())
      .single()

    if (fetchError || !member) {
      // Check if token exists but is expired
      const { data: expiredCheck } = await supabase
        .from("members")
        .select("expiry_date")
        .eq("token", token)
        .single()
      
      if (expiredCheck) {
        const expiryDate = new Date(expiredCheck.expiry_date)
        if (new Date() > expiryDate) {
          return NextResponse.json({ error: "Token expired" }, { status: 403 })
        }
      }
      return NextResponse.json({ error: "Token not found or expired" }, { status: 403 })
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      street,
      postal_code,
      city,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      mobile: mobile?.trim() || null,
      communication_preference: communication_preference || null,
      notes: notes || "",
      modified: true,
      modified_at: new Date().toISOString(),
    }

    // If not yet modified, save original values
    if (!member.modified) {
      updateData.original_street = member.street
      updateData.original_postal_code = member.postal_code
      updateData.original_city = member.city
    }

    // Update member
    const { error: updateError } = await supabase
      .from("members")
      .update(updateData)
      .eq("token", token)
      .gt("expiry_date", new Date().toISOString())

    if (updateError) {
      console.error("Error updating member:", updateError)
      return NextResponse.json({ error: "Failed to update member" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in POST /api/member/update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
