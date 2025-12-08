import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Auth() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (isSignUp) {
        // Sign Up
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error
        setMessage('Check your email for the confirmation link!')
      } else {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
        
        // Navigate to dashboard on successful login
        navigate('/dashboard')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-8">
      {/* Animated Grid Background */}
      <div className="cyber-grid-bg"></div>
      
      {/* Vignette Overlay */}
      <div className="vignette"></div>
      
      {/* CRT Scanlines */}
      <div className="scanlines"></div>

      {/* Auth Form */}
      <div className="w-full max-w-md content-wrapper">
        <div className="bg-cyber-gray border-2 border-neon-green rounded-lg p-8 shadow-neon">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-cyber font-bold text-neon-green mb-2 tracking-wider">
              {isSignUp ? 'SIGN UP' : 'SIGN IN'}
            </h1>
            <div className="h-1 w-24 bg-neon-green mx-auto shadow-neon-sm"></div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 bg-red-600/20 border border-red-500 text-red-400 font-cyber text-sm p-3 rounded-lg">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 bg-neon-green/20 border border-neon-green text-neon-green font-cyber text-sm p-3 rounded-lg">
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-neon-green font-cyber text-sm mb-2 tracking-wide">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-cyber-dark border-2 border-neon-green text-neon-green font-cyber p-3 rounded-lg 
                         focus:outline-none focus:shadow-neon transition-all duration-300
                         placeholder-neon-green/30"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-neon-green font-cyber text-sm mb-2 tracking-wide">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-cyber-dark border-2 border-neon-green text-neon-green font-cyber p-3 rounded-lg 
                         focus:outline-none focus:shadow-neon transition-all duration-300
                         placeholder-neon-green/30"
              />
              {isSignUp && (
                <p className="text-neon-green/50 font-cyber text-xs mt-1">
                  Minimum 6 characters
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon-green text-cyber-dark font-cyber font-bold py-3 rounded-lg 
                       hover:shadow-neon transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'LOADING...' : (isSignUp ? 'SIGN UP' : 'SIGN IN')}
            </button>

            {/* Toggle Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                  setMessage('')
                }}
                className="text-neon-green/70 hover:text-neon-green font-cyber text-sm transition-colors duration-200"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="h-px w-full bg-neon-green/30 mb-3"></div>
            <p className="text-neon-green/50 font-cyber text-xs tracking-wider">
              CYBERPUNK DASHBOARD • SECURE ACCESS
            </p>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="fixed top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-neon-green/50 z-10"></div>
        <div className="fixed top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-neon-green/50 z-10"></div>
        <div className="fixed bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-neon-green/50 z-10"></div>
        <div className="fixed bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-neon-green/50 z-10"></div>
      </div>
    </div>
  )
}

export default Auth

