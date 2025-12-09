import { useState } from 'react'
import { Crown } from 'lucide-react'
import { supabase } from '../supabaseClient'

function UpgradeButton() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    try {
      setLoading(true)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('Please sign in to upgrade')
        return
      }

      // Stripe payment link with user ID
      const stripeUrl = `https://buy.stripe.com/test_6oU7sL0b8eng7WA8YZgIo00?client_reference_id=${user.id}`

      // Open Stripe checkout in new tab
      window.open(stripeUrl, '_blank')
    } catch (error) {
      console.error('Error opening Stripe checkout:', error)
      alert('Failed to open checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="relative bg-gradient-to-r from-yellow-400 to-amber-500 text-cyber-dark font-cyber font-bold 
                 w-full max-w-xs px-6 py-3 rounded-lg hover:from-yellow-300 hover:to-amber-400 
                 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                 shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:shadow-[0_0_30px_rgba(251,191,36,0.8)]
                 animate-pulse-glow flex items-center justify-center gap-2 text-base sm:text-lg"
      title="Upgrade to Premium"
    >
      <Crown className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="currentColor" />
      <span>{loading ? 'OPENING...' : 'UPGRADE'}</span>
    </button>
  )
}

export default UpgradeButton

