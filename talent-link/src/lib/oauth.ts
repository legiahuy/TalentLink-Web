export const OAUTH_CODE_VERIFIER_KEY = 'oauth_code_verifier'

function base64UrlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

export async function generateCodeVerifierAndChallenge() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  const verifier = base64UrlEncode(array.buffer)

  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', data)
  const challenge = base64UrlEncode(hash)

  return { verifier, challenge }
}

export async function startGoogleOAuth() {
  if (typeof window === 'undefined') return

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
  const scope =
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_SCOPE ??
    'openid email profile'

  if (!clientId || !redirectUri) {
    console.error('Google OAuth env is not configured')
    return
  }

  const { verifier, challenge } = await generateCodeVerifierAndChallenge()

  sessionStorage.setItem(OAUTH_CODE_VERIFIER_KEY, verifier)

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent',
  })

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  window.location.href = authUrl
}


