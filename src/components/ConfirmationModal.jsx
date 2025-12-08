function ConfirmationModal({ isOpen, title, message, itemText, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-cyber-gray border-2 border-neon-green rounded-lg p-8 max-w-md w-full shadow-neon">
        <h3 className="text-neon-green font-cyber text-xl mb-4 tracking-wider text-center">
          {title}
        </h3>
        <p className="text-neon-green/70 font-cyber text-sm mb-2 text-center">
          {message}
        </p>
        {itemText && (
          <div className="bg-cyber-dark border border-neon-green/30 rounded p-3 mb-6">
            <p className="text-neon-green font-cyber text-sm text-center">
              "{itemText}"
            </p>
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-cyber-dark border-2 border-neon-green/50 text-neon-green font-cyber py-3 rounded-lg hover:bg-cyber-light transition-all duration-300"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600/20 border-2 border-red-500 text-red-500 font-cyber py-3 rounded-lg hover:bg-red-600/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all duration-300"
          >
            CONFIRM DELETE
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal

