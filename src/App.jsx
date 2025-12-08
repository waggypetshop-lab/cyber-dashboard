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
      <div className="min-h-screen bg-cyber-dark/0 flex items-center justify-center p-4 md:p-8 content-wrapper">
        <div className="w-full max-w-4xl mx-auto">
        {/* Main Container */}
        <div className="bg-cyber-gray border-2 border-neon-green rounded-lg p-4 sm:p-6 md:p-8 lg:p-12 shadow-neon md:relative">
          
          {/* Header - Mobile: Flex Column, Desktop: Relative with Absolute Button */}
          <div className="flex flex-col mb-6 sm:mb-8 md:mb-12 md:block">
            
            {/* Logout Button Container - Mobile: Right-aligned in flow, Desktop: Absolute positioned */}
            <div className="flex justify-end mb-3 md:mb-0">
              <LogoutButton className="md:absolute md:top-6 md:right-6" />
            </div>
            
            {/* Title Section */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-cyber font-bold text-neon-green mb-2 tracking-wider">
                CYBERPUNK DASHBOARD
              </h1>
              <div className="h-1 w-24 sm:w-32 bg-neon-green mx-auto shadow-neon-sm"></div>
              <p className="text-neon-green/50 font-cyber text-xs sm:text-sm mt-2 break-all px-2">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Digital Clock */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <div className="bg-cyber-dark border-2 border-neon-green rounded-lg p-4 sm:p-6 md:p-8 shadow-neon-sm">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-cyber font-bold text-neon-green tracking-widest mb-2 sm:mb-4 tabular-nums">
                {formatTime(time)}
              </div>
              <div className="text-sm sm:text-base md:text-lg font-cyber text-neon-green/70">
                {formatDate(time)}
              </div>
            </div>
          </div>

          {/* Live Crypto Ticker */}
          <div className="mb-6 sm:mb-8 md:mb-12">
            <CryptoTicker />
          </div>

          {/* Focus of the Day */}
          {user && <Questions userId={user.id} />}

          {/* Quick Links */}
          <QuickLinks />

          {/* Footer */}
          <div className="mt-6 sm:mt-8 md:mt-12 text-center">
            <div className="h-px w-full bg-neon-green/30 mb-3 sm:mb-4"></div>
            <p className="text-neon-green/50 font-cyber text-xs sm:text-sm tracking-wider px-2">
              SYSTEM ONLINE • ALL SYSTEMS OPERATIONAL
            </p>
          </div>
        </div>

      </div>
      
      {/* Corner Accents - Fixed to all 4 corners of the screen */}
      <div className="fixed top-2 left-2 w-8 h-8 sm:top-4 sm:left-4 sm:w-12 sm:h-12 border-l-2 border-t-2 border-neon-green/50 z-10"></div>
      <div className="fixed top-2 right-2 w-8 h-8 sm:top-4 sm:right-4 sm:w-12 sm:h-12 border-r-2 border-t-2 border-neon-green/50 z-10"></div>
      <div className="fixed bottom-2 left-2 w-8 h-8 sm:bottom-4 sm:left-4 sm:w-12 sm:h-12 border-l-2 border-b-2 border-neon-green/50 z-10"></div>
      <div className="fixed bottom-2 right-2 w-8 h-8 sm:bottom-4 sm:right-4 sm:w-12 sm:h-12 border-r-2 border-b-2 border-neon-green/50 z-10"></div>
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

