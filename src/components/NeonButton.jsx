function NeonButton({ icon: Icon, label, url, hoverColor }) {
  return (
    <button
      onClick={() => window.open(url, '_blank')}
      className={`bg-cyber-dark border-2 border-neon-green text-neon-green font-cyber px-4 py-3 rounded-lg h-16
                hover:bg-cyber-light hover:shadow-neon transition-all duration-300
                flex flex-row items-center justify-center gap-3 group w-full ${hoverColor}`}
    >
      <Icon size={24} className="transition-transform group-hover:scale-110" />
      <span className="tracking-wide text-sm">{label}</span>
    </button>
  )
}

export default NeonButton

