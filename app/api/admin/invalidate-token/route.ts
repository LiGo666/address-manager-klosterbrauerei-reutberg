import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Check if user is authenticated as admin
async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get("admin_session")
  return adminSession?.value === "authenticated"
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { customer_number } = await request.json()

    if (!customer_number) {
      return NextResponse.json({ error: "customer_number is required" }, { status: 400 })
    }

    // Use service role key for admin operations (bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Set expiry to past to invalidate token
    const pastDate = new Date(0).toISOString()

    const { error } = await supabase
      .from("members")
      .update({
        expiry_date: pastDate,
      })
      .eq("customer_number", customer_number)

    if (error) {
      console.error("Error invalidating token:", error)
      return NextResponse.json({ error: "Failed to invalidate token" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in invalidate-token route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
