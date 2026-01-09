import { hashSync, compareSync } from "bcryptjs"

const ADMIN_USERNAME = "admin"
// Hash of a secure password - the actual password is: Reutberg!Kloster2025#Secure
const ADMIN_PASSWORD_HASH = hashSync("Reutberg!Kloster2025#Secure", 10)

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && compareSync(password, ADMIN_PASSWORD_HASH)
}

export function getAdminSessionCookie(): string {
  return "admin_session"
}
