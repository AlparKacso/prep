// Lightweight shared-password gate. This is a soft barrier ("only she knows
// the password"), NOT strong auth — no accounts, no per-user identity.

export const AUTH_COOKIE = 'prep_auth'
const TOKEN_PAYLOAD = 'prep-unlocked-v1'

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Deterministic, unforgeable cookie value derived from the server secret. */
export async function expectedToken(): Promise<string> {
  const secret = process.env.PREP_AUTH_SECRET
  if (!secret) throw new Error('PREP_AUTH_SECRET is not set')
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(TOKEN_PAYLOAD)
  )
  return toHex(sig)
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function isValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false
  try {
    return safeEqual(token, await expectedToken())
  } catch {
    return false
  }
}
