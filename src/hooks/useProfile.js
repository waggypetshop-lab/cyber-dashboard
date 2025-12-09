import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

/**
 * Custom hook to fetch and manage user profile data
 * @returns {Object} { profile, loading, error, refetch }
 */
export function useProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      // Fetch user profile
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        throw profileError
      }

      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile()
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    isPremium: profile?.is_premium || false
  }
}

