import { NextResponse } from "next/server"

export async function GET() {
  // Only allow in development or with proper auth
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  return NextResponse.json({
    hasAdminPw: !!process.env.ADMIN_PW,
    adminPwLength: process.env.ADMIN_PW?.length || 0,
    adminPwFirstChar: process.env.ADMIN_PW?.[0] || "",
    adminPwLastChar: process.env.ADMIN_PW?.[process.env.ADMIN_PW?.length - 1] || "",
    adminPwContainsPercent: process.env.ADMIN_PW?.includes("%") || false,
    expectedUsername: process.env.ADMIN_NAME || "admin",
  })
}
