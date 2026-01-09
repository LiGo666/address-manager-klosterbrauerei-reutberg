import { createId } from "@paralleldrive/cuid2"

/**
 * Generates a new CUID2 token
 * Real CUID2 tokens are cryptographically secure and random
 */
export function generateCuid2Token(): string {
  return createId()
}

/**
 * Validates a token format (basic check)
 * Full validation with expiry happens in database queries
 * CUID2 format: starts with "cl" followed by 22 base36 characters (24 total)
 */
export function isValidTokenFormat(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") {
    return false
  }
  // CUID2 format: "cl" + 22 base36 chars = 24 chars total
  // Allow some flexibility for different formats
  return token.length >= 20 && /^[a-z0-9]+$/.test(token)
}
