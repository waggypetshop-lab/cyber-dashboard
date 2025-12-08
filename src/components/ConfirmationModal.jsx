function ConfirmationModal({ isOpen, title, message, itemText, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-cyber-gray border-2 border-neon-green rounded-lg p-4 sm:p-6 md:p-8 w-[90%] max-w-md m-4 shadow-neon">
        <h3 className="text-neon-green font-cyber text-lg sm:text-xl mb-3 sm:mb-4 tracking-wider text-center">
          {title}
        </h3>
        <p className="text-neon-green/70 font-cyber text-xs sm:text-sm mb-2 text-center">
          {message}
        </p>
        {itemText && (
          <div className="bg-cyber-dark border border-neon-green/30 rounded p-3 mb-4 sm:mb-6">
            <p className="text-neon-green font-cyber text-xs sm:text-sm text-center break-words">
              "{itemText}"
            </p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-cyber-dark border-2 border-neon-green/50 text-neon-green font-cyber py-2 sm:py-3 rounded-lg hover:bg-cyber-light transition-all duration-300 text-sm sm:text-base"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600/20 border-2 border-red-500 text-red-500 font-cyber py-2 sm:py-3 rounded-lg hover:bg-red-600/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all duration-300 text-sm sm:text-base"
          >
            CONFIRM DELETE
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal

