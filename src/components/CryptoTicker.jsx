import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

function CryptoTicker() {
  const [cryptoData, setCryptoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data')
      }

      const data = await response.json()
      setCryptoData(data)
      setError(null)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch data immediately on mount
    fetchCryptoData()

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchCryptoData()
    }, 30000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatChange = (change) => {
    return change.toFixed(2)
  }

  if (loading) {
    return (
      <div className="bg-cyber-dark/30 backdrop-blur-md border-2 border-neon-green rounded-lg p-6 shadow-neon-sm">
        <div className="text-center text-neon-green/50 font-cyber text-sm animate-pulse">
          LOADING MARKET DATA...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-cyber-dark/30 backdrop-blur-md border-2 border-red-500 rounded-lg p-6 shadow-neon-sm">
        <div className="text-center text-red-400 font-cyber text-sm">
          ERROR: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cyber-dark/30 backdrop-blur-md border-2 border-neon-green rounded-lg p-3 sm:p-4 md:p-6 shadow-neon-sm">
      {/* Header */}
      <div className="text-center mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg md:text-xl font-cyber font-bold text-neon-green tracking-wider">
          LIVE CRYPTO MARKET
        </h3>
        <div className="h-px w-20 sm:w-24 bg-neon-green/50 mx-auto mt-2"></div>
      </div>

      {/* Crypto Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Bitcoin */}
        {cryptoData?.bitcoin && (
          <div className="bg-cyber-gray/50 border border-neon-green/50 rounded-lg p-3 sm:p-4 hover:border-neon-green transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="font-cyber text-neon-green font-bold text-base sm:text-lg">BTC</span>
              <span className="font-cyber text-neon-green/70 text-xs">Bitcoin</span>
            </div>
            
            <div className="text-xl sm:text-2xl font-cyber font-bold text-neon-green mb-2 tabular-nums break-all">
              {formatPrice(cryptoData.bitcoin.usd)}
            </div>

            <div className="flex items-center gap-2">
              {cryptoData.bitcoin.usd_24h_change >= 0 ? (
                <>
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  <span className="font-cyber text-green-400 text-xs sm:text-sm font-bold">
                    +{formatChange(cryptoData.bitcoin.usd_24h_change)}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 flex-shrink-0" />
                  <span className="font-cyber text-red-400 text-xs sm:text-sm font-bold">
                    {formatChange(cryptoData.bitcoin.usd_24h_change)}%
                  </span>
                </>
              )}
              <span className="text-neon-green/50 font-cyber text-xs ml-auto">24H</span>
            </div>
          </div>
        )}

        {/* Ethereum */}
        {cryptoData?.ethereum && (
          <div className="bg-cyber-gray/50 border border-neon-green/50 rounded-lg p-3 sm:p-4 hover:border-neon-green transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="font-cyber text-neon-green font-bold text-base sm:text-lg">ETH</span>
              <span className="font-cyber text-neon-green/70 text-xs">Ethereum</span>
            </div>
            
            <div className="text-xl sm:text-2xl font-cyber font-bold text-neon-green mb-2 tabular-nums break-all">
              {formatPrice(cryptoData.ethereum.usd)}
            </div>

            <div className="flex items-center gap-2">
              {cryptoData.ethereum.usd_24h_change >= 0 ? (
                <>
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  <span className="font-cyber text-green-400 text-xs sm:text-sm font-bold">
                    +{formatChange(cryptoData.ethereum.usd_24h_change)}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 flex-shrink-0" />
                  <span className="font-cyber text-red-400 text-xs sm:text-sm font-bold">
                    {formatChange(cryptoData.ethereum.usd_24h_change)}%
                  </span>
                </>
              )}
              <span className="text-neon-green/50 font-cyber text-xs ml-auto">24H</span>
            </div>
          </div>
        )}
      </div>

      {/* Last Updated */}
      <div className="text-center mt-3 sm:mt-4">
        <span className="text-neon-green/40 font-cyber text-xs">
          AUTO-REFRESH: 30s
        </span>
      </div>
    </div>
  )
}

export default CryptoTicker

