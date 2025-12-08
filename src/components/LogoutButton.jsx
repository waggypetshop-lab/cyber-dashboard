import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Power } from 'lucide-react'
import { supabase } from '../supabaseClient'

function LogoutButton({ className = '' }) {
  const navigate = useNavigate()
  const [glowStyle, setGlowStyle] = useState('0 0 10px currentColor')

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const handleMouseEnter = () => {
    setGlowStyle('0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.5)')
  }

  const handleMouseLeave = () => {
    setGlowStyle('0 0 10px currentColor')
  }

  return (
    <button
      onClick={handleSignOut}
      className={`text-neon-green hover:text-red-500 transition-all duration-300 p-2 rounded ${className}`}
      style={{
        textShadow: glowStyle
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title="Disconnect"
    >
      <Power className="w-8 h-8" />
    </button>
  )
}

export default LogoutButton

