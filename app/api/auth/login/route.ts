import { type NextRequest, NextResponse } from "next/server"
import { validateAdminCredentials } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Benutzername und Passwort sind erforderlich" }, { status: 400 })
    }

    // Debug: Log in development only
    if (process.env.NODE_ENV !== "production") {
      console.log("Login attempt:", { 
        username, 
        passwordLength: password.length,
        expectedUsername: process.env.ADMIN_NAME || "admin",
        hasAdminPw: !!process.env.ADMIN_PW
      })
    }

    if (validateAdminCredentials(username, password)) {
      const response = NextResponse.json({ success: true })
      response.cookies.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })
      return response
    }

    return NextResponse.json({ error: "Ungültige Anmeldedaten" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
