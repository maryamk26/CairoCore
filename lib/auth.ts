import { createClient } from '@/lib/supabase/server'

export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    return error ? null : user
  } catch {
    return null
  }
}

export async function getCurrentUserId() {
  const user = await getCurrentUser()
  return user?.id ?? null
}

export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}
