import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import ProtectedRoute from './components/ProtectedRoute'
import LogoutButton from './components/LogoutButton'
import QuickLinks from './components/QuickLinks'
import Questions from './components/Questions'
import CryptoTicker from './components/CryptoTicker'

// Dashboard Component
function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [user, setUser] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Get user info
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      {/* Animated Grid Background */}
      <div className="cyber-grid-bg"></div>
      
      {/* Vignette Overlay */}
      <div className="vignette"></div>
      
      {/* CRT Scanlines */}
      <div className="scanlines"></div>
      
      {/* Main Content */}
      <div className="min-h-screen bg-cyber-dark/0 flex items-center justify-center p-8 content-wrapper">
        <div className="w-full max-w-4xl">
        {/* Main Container */}
        <div className="bg-cyber-gray border-2 border-neon-green rounded-lg p-12 shadow-neon relative">
          
          {/* Sign Out Button - Top Right Corner */}
          <LogoutButton className="absolute top-6 right-6" />
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-cyber font-bold text-neon-green mb-2 tracking-wider">
              CYBERPUNK DASHBOARD
            </h1>
            <div className="h-1 w-32 bg-neon-green mx-auto shadow-neon-sm"></div>
            <p className="text-neon-green/50 font-cyber text-xs mt-2">
              {user?.email}
            </p>
          </div>

          {/* Digital Clock */}
          <div className="text-center mb-12">
            <div className="bg-cyber-dark border-2 border-neon-green rounded-lg p-8 shadow-neon-sm">
              <div className="text-7xl font-cyber font-bold text-neon-green tracking-widest mb-4 tabular-nums">
                {formatTime(time)}
              </div>
              <div className="text-lg font-cyber text-neon-green/70">
                {formatDate(time)}
              </div>
            </div>
          </div>

          {/* Live Crypto Ticker */}
          <div className="mb-12">
            <CryptoTicker />
          </div>

          {/* Focus of the Day */}
          {user && <Questions userId={user.id} />}

          {/* Quick Links */}
          <QuickLinks />

          {/* Footer */}
          <div className="mt-12 text-center">
            <div className="h-px w-full bg-neon-green/30 mb-4"></div>
            <p className="text-neon-green/50 font-cyber text-sm tracking-wider">
              SYSTEM ONLINE • ALL SYSTEMS OPERATIONAL
            </p>
          </div>
        </div>

      </div>
      
      {/* Corner Accents - Fixed to all 4 corners of the screen */}
      <div className="fixed top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-neon-green/50 z-10"></div>
      <div className="fixed top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-neon-green/50 z-10"></div>
      <div className="fixed bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-neon-green/50 z-10"></div>
      <div className="fixed bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-neon-green/50 z-10"></div>
      </div>
    </>
  )
}

function App() {
  return (
    <Routes>
      {/* Login Page */}
      <Route path="/" element={<Auth />} />
      
      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App

