export interface SessionResponse {
  authenticated: boolean
  userId: string | null
  user: {
    id: string
    email: string | null
    emailVerified?: boolean
    metadata?: Record<string, unknown>
    createdAt?: string
  } | null
  error?: string
}

export async function checkSession(): Promise<SessionResponse> {
  try {
    const res = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  } catch (err) {
    return {
      authenticated: false,
      userId: null,
      user: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
