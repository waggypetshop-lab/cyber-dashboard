import { useState, useEffect } from 'react'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import SimpleQuestion from './SimpleQuestion'
import ConfirmationModal from './ConfirmationModal'
import { supabase } from '../supabaseClient'

function Questions({ userId }) {
  const [focus, setFocus] = useState('')
  const [focusHistory, setFocusHistory] = useState([])
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null) // { id, text }
  const [editingId, setEditingId] = useState(null) // ID of item being edited
  const [editText, setEditText] = useState('') // Text being edited

  // Fetch all focus history entries on component mount
  useEffect(() => {
    if (userId) {
      fetchFocusHistory()
    }
  }, [userId])

  const fetchFocusHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('focus_history')
        .select('*')
        .eq('user_id', userId) // Filter by current user
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching focus history:', error)
        return
      }

      if (data && data.length > 0) {
        setFocusHistory(data)
        // Set the most recent entry as the current focus
        setFocus(data[0].focus_text)
      } else {
        // No history found, clear the focus
        setFocus('')
        setFocusHistory([])
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  // Save focus to Supabase when Enter is pressed
  const handleFocusSave = async (e) => {
    if (e.key === 'Enter' && focus.trim()) {
      try {
        const { error } = await supabase
          .from('focus_history')
          .insert([
            { 
              focus_text: focus.trim(),
              user_id: userId // Link to current user
            }
          ])

        if (error) {
          console.error('Error saving focus:', error)
          return
        }

        // Refresh the history list
        await fetchFocusHistory()

        // Show success toast
        setShowSavedToast(true)
        setTimeout(() => setShowSavedToast(false), 2000)
      } catch (err) {
        console.error('Error:', err)
      }
    }
  }

  // Show delete confirmation modal
  const handleDeleteClick = (id, focusText) => {
    setDeleteConfirm({ id, text: focusText })
  }

  // Confirm and delete the focus entry
  const confirmDelete = async () => {
    if (!deleteConfirm) return

    try {
      const { error } = await supabase
        .from('focus_history')
        .delete()
        .eq('id', deleteConfirm.id)

      if (error) {
        console.error('Error deleting focus:', error)
        return
      }

      // Update UI immediately by filtering out the deleted item
      setFocusHistory(prevHistory => prevHistory.filter(item => item.id !== deleteConfirm.id))

      // If we deleted the current focus, update the input
      if (focusHistory[0]?.id === deleteConfirm.id && focusHistory.length > 1) {
        setFocus(focusHistory[1].focus_text)
      } else if (focusHistory.length === 1) {
        setFocus('')
      }

      // Close modal
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm(null)
  }

  // Enter edit mode for a history item
  const handleEditClick = (id, currentText) => {
    setEditingId(id)
    setEditText(currentText)
  }

  // Save the edited text
  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return

    try {
      const { error } = await supabase
        .from('focus_history')
        .update({ focus_text: editText.trim() })
        .eq('id', id)

      if (error) {
        console.error('Error updating focus:', error)
        return
      }

      // Update UI immediately
      setFocusHistory(prevHistory =>
        prevHistory.map(item =>
          item.id === id ? { ...item, focus_text: editText.trim() } : item
        )
      )

      // If editing the current focus, update the main input too
      if (focusHistory[0]?.id === id) {
        setFocus(editText.trim())
      }

      // Exit edit mode
      setEditingId(null)
      setEditText('')
    } catch (err) {
      console.error('Error:', err)
    }
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  // Handle Enter key in edit mode
  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id)
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  return (
    <>
      <div className="relative">
        <SimpleQuestion
          label="FOCUS OF THE DAY"
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          onKeyDown={handleFocusSave}
          placeholder="Enter your main focus..."
        />
        
        {/* Saved Toast Notification */}
        {showSavedToast && (
          <div className="absolute top-0 right-0 bg-neon-green text-cyber-dark px-4 py-2 rounded-lg font-cyber text-sm font-bold shadow-neon animate-bounce">
            ✓ SAVED!
          </div>
        )}
      </div>

      {/* Focus History */}
      {focusHistory.length > 0 && (
        <div className="mb-6 sm:mb-8 md:mb-12">
          <h3 className="text-neon-green font-cyber text-base sm:text-lg mb-3 sm:mb-4 tracking-wide">
            FOCUS HISTORY
          </h3>
          <div className="space-y-2">
            {focusHistory.map((entry) => (
              <div
                key={entry.id}
                className="bg-cyber-dark border border-neon-green/30 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:border-neon-green/60 transition-all duration-300 gap-3"
              >
                {editingId === entry.id ? (
                  // Edit Mode
                  <>
                    <div className="flex-1 w-full sm:mr-4">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, entry.id)}
                        className="w-full bg-cyber-dark border-2 border-blue-400 text-neon-green font-cyber p-2 rounded-lg 
                                 focus:outline-none focus:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300
                                 placeholder-neon-green/30 text-sm sm:text-base"
                        autoFocus
                      />
                      <p className="text-neon-green/40 font-cyber text-xs mt-1">
                        Press Enter to save, Escape to cancel
                      </p>
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleSaveEdit(entry.id)}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 p-2 hover:bg-cyber-light rounded"
                        title="Save changes"
                      >
                        <Check size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-neon-green/50 hover:text-red-500 transition-colors duration-200 p-2 hover:bg-cyber-light rounded"
                        title="Cancel editing"
                      >
                        <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                    </div>
                  </>
                ) : (
                  // View Mode
                  <>
                    <div className="flex-1 w-full sm:mr-4">
                      <p className="text-neon-green font-cyber text-sm break-words">
                        {entry.focus_text}
                      </p>
                      <p className="text-neon-green/40 font-cyber text-xs mt-1">
                        {new Date(entry.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto flex-shrink-0">
                      <button
                        onClick={() => handleEditClick(entry.id, entry.focus_text)}
                        className="text-neon-green/50 hover:text-blue-400 transition-colors duration-200 p-2 hover:bg-cyber-light rounded"
                        title="Edit this focus"
                      >
                        <Pencil size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(entry.id, entry.focus_text)}
                        className="text-neon-green/50 hover:text-red-500 transition-colors duration-200 p-2 hover:bg-cyber-light rounded"
                        title="Delete this focus"
                      >
                        <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteConfirm}
        title="CONFIRM DELETE"
        message="Are you sure you want to delete this focus?"
        itemText={deleteConfirm?.text}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  )
}

export default Questions

