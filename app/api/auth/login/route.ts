import { type NextRequest, NextResponse } from "next/server"
import { validateAdminCredentials } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Benutzername und Passwort sind erforderlich" }, { status: 400 })
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
  } catch {
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
