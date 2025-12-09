import { Crown } from 'lucide-react'

function ProBadge() {
  return (
    <div className="relative bg-gradient-to-r from-yellow-400 to-amber-500 text-cyber-dark font-cyber font-bold 
                    px-3 py-2 rounded-lg flex items-center gap-2
                    shadow-[0_0_20px_rgba(251,191,36,0.6)]
                    text-sm sm:text-base">
      <Crown className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
      <span>PRO</span>
    </div>
  )
}

export default ProBadge

