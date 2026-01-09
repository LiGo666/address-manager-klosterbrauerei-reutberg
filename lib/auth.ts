import { hashSync, compareSync } from "bcryptjs"

const ADMIN_USERNAME = process.env.ADMIN_NAME || "admin"

// Cache the hash to avoid recreating it every time
let cachedPasswordHash: string | null = null

function getAdminPassword(): string {
  const password = process.env.ADMIN_PW
  if (!password) {
    throw new Error("ADMIN_PW environment variable is not set")
  }
  // Trim whitespace and newlines that might have been added when setting the env var
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

export function validateAdminCredentials(username: string, password: string): boolean {
  const adminPasswordHash = getAdminPasswordHash()
  
  const usernameMatch = username === ADMIN_USERNAME
  const passwordMatch = compareSync(password, adminPasswordHash)
  
  return usernameMatch && passwordMatch
}

export function getAdminSessionCookie(): string {
  return "admin_session"
}
