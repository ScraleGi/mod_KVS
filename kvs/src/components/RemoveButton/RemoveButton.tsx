'use client'

import { useState, ReactNode } from 'react'

/**
 * RemoveButton: Reusable delete button with confirmation modal.
 * 
 * - Use in any table or list to provide a safe "delete" action (e.g. HolidayTable, CourseHolidayTable, etc.).
 * - Typically placed in the "actions" column of a table row.
 */

interface RemoveButtonProps {
  itemId: string
  onRemove: (formData: FormData) => Promise<void>
  // Customization props
  title?: string
  message?: string
  confirmButtonText?: string
  cancelButtonText?: string
  fieldName?: string
  customButton?: ReactNode  // Optionally render a custom button instead of the default
}

export default function RemoveButton({ 
  itemId, 
  onRemove,
  // Default values for modal and button text
  title = "Remove Item",
  message = "Sind Sie sicher, dass Sie diesen Artikel entfernen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
  confirmButtonText = "Entfernen",
  cancelButtonText = "Abbrechen",
  fieldName = "itemId",
  customButton
}: RemoveButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  // Show confirmation modal on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowConfirmation(true)
  }
  
  // Call onRemove callback with FormData when confirmed
  const handleConfirm = () => {
    const formData = new FormData()
    formData.append(fieldName, itemId)
    onRemove(formData)
    setShowConfirmation(false)
  }
  
  // Close modal without removing
  const handleCancel = () => {
    setShowConfirmation(false)
  }

  return (
    <div className="relative">
      <form className="h-full flex items-center" onSubmit={handleSubmit}>
        {/* Render custom button if provided, otherwise default button */}
        {customButton ? (
          customButton
        ) : (
          <button
            type="submit"
            className="cursor-pointer flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-neutral-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
            title={title}
          >
            {/* Default trash/delete icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
            </svg>
          </button>
        )}
      </form>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <>
          {/* Backdrop to darken the background and close modal on click */}
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={handleCancel}
          ></div>
          
          {/* Modal dialog for confirmation */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 z-50 w-80">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-4">
                {/* Warning icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{message}</p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded border border-gray-200 transition text-sm"
              >
                {cancelButtonText}
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded border border-red-200 transition text-sm"
              >
                {confirmButtonText}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}