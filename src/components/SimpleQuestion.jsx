function SimpleQuestion({ label, value, onChange, placeholder, onKeyDown }) {
  return (
    <div className="mb-6 sm:mb-8 md:mb-12">
      <label className="block text-neon-green font-cyber text-base sm:text-lg mb-2 sm:mb-3 tracking-wide">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full bg-cyber-dark border-2 border-neon-green text-neon-green font-cyber p-3 sm:p-4 rounded-lg 
                 focus:outline-none focus:shadow-neon transition-all duration-300
                 placeholder-neon-green/30 text-sm sm:text-base"
      />
    </div>
  )
}

export default SimpleQuestion

