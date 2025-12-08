function SimpleQuestion({ label, value, onChange, placeholder, onKeyDown }) {
  return (
    <div className="mb-12">
      <label className="block text-neon-green font-cyber text-lg mb-3 tracking-wide">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full bg-cyber-dark border-2 border-neon-green text-neon-green font-cyber p-4 rounded-lg 
                 focus:outline-none focus:shadow-neon transition-all duration-300
                 placeholder-neon-green/30"
      />
    </div>
  )
}

export default SimpleQuestion

