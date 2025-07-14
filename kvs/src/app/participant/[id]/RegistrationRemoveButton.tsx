'use client'

import { useState } from 'react'

interface RegistrationRemoveButtonProps {
  registrationId: string
  removeRegistration: (formData: FormData) => Promise<void>
}

export default function RegistrationRemoveButton({ 
  registrationId, 
  removeRegistration 
}: RegistrationRemoveButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowConfirmation(true)
  }
  
  const handleConfirm = () => {
    const formData = new FormData()
    formData.append('registrationId', registrationId)
    removeRegistration(formData)
    setShowConfirmation(false)
  }
  
  const handleCancel = () => {
    setShowConfirmation(false)
  }

  return (
    <div className="relative">
      <form className="h-full flex items-center" onSubmit={handleSubmit}>
        <button
          type="submit"
          className="cursor-pointer flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-neutral-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
          title="Remove registration"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
          </svg>
        </button>
      </form>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={handleCancel}
          ></div>
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 z-50 w-80">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Course Registration</h3>
              <p className="text-gray-600 text-sm">
                Are you sure you want to remove this course registration? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded border border-gray-200 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded border border-red-200 transition text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}