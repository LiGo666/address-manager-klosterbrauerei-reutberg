import { hashSync, compareSync } from "bcryptjs"

const ADMIN_USERNAME = process.env.ADMIN_NAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PW

if (!ADMIN_PASSWORD) {
  throw new Error("ADMIN_PW environment variable is not set")
}

const ADMIN_PASSWORD_HASH = hashSync(ADMIN_PASSWORD, 10)

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && compareSync(password, ADMIN_PASSWORD_HASH)
}

export function getAdminSessionCookie(): string {
  return "admin_session"
}
