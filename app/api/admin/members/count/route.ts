import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()

    const { count, error } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true })

    if (error) {
      console.error("Error fetching count:", error)
      return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 })
    }

    return NextResponse.json({ count: count || 0 })
  } catch (error: any) {
    console.error("Error in GET /api/admin/members/count:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
