import Credentials from "next-auth/providers/credentials"
import { compareSync, hashSync } from "bcryptjs"
import type { NextAuthConfig } from "next-auth"

const ADMIN_USERNAME = process.env.ADMIN_NAME || "admin"

// Cache the hash to avoid recreating it every time
let cachedPasswordHash: string | null = null

function getAdminPassword(): string {
  const password = process.env.ADMIN_PW
  if (!password) {
    throw new Error("ADMIN_PW environment variable is not set")
  }
  return password.trim()
}

function getAdminPasswordHash(): string {
  // Create hash at runtime (lazy initialization), but cache it
  if (!cachedPasswordHash) {
    const password = getAdminPassword()
    cachedPasswordHash = hashSync(password, 10)
  }
  return cachedPasswordHash
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Benutzername", type: "text" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const username = credentials.username as string
        const password = credentials.password as string
        const adminPasswordHash = getAdminPasswordHash()

        const usernameMatch = username === ADMIN_USERNAME
        const passwordMatch = compareSync(password, adminPasswordHash)

        if (usernameMatch && passwordMatch) {
          return {
            id: "admin",
            name: ADMIN_USERNAME,
            role: "admin",
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")

      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
  },
}
