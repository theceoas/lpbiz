import { createBrowserClient } from '@supabase/ssr'

// Simple Supabase client for authentication
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Admin email - only this email can access admin panel
const ADMIN_EMAIL = 'admin@bizpilot.com'

// Helper function to check if user is admin
export const isAdminUser = (email: string | undefined): boolean => {
  return email === ADMIN_EMAIL
}

export const authService = {
  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Check if user is admin
      if (!isAdminUser(data.user?.email)) {
        await supabase.auth.signOut()
        throw new Error('Unauthorized: Admin access only')
      }

      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return { user: session?.user ?? null, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  },

  // Check if current user is admin
  isAdmin(email: string | undefined): boolean {
    return isAdminUser(email)
  },
}