import { Youtube, Twitter, Github, Linkedin } from 'lucide-react'
import NeonButton from './NeonButton'

function QuickLinks() {
  const quickLinks = [
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com',
      color: 'hover:text-red-500'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com',
      color: 'hover:text-blue-400'
    },
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com',
      color: 'hover:text-purple-400'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com',
      color: 'hover:text-blue-600'
    }
  ]

  return (
    <div>
      <h2 className="text-neon-green font-cyber text-lg mb-4 tracking-wide">
        QUICK LINKS
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {quickLinks.map((link) => (
          <NeonButton
            key={link.name}
            icon={link.icon}
            label={link.name}
            url={link.url}
            hoverColor={link.color}
          />
        ))}
      </div>
    </div>
  )
}

export default QuickLinks

