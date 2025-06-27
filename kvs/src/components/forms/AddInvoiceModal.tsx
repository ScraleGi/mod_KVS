'use client'

import { useRef, useState } from 'react'

export default function AddInvoiceModal({
  open,
  onClose,
  onSubmit,
  registrations,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => void
  registrations: any[]
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [recipientType, setRecipientType] = useState<'PERSON' | 'COMPANY'>('PERSON')

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === dialogRef.current) onClose()
  }

  if (!open) return null

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-sm shadow border border-gray-100 p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-8 tracking-tight text-left">Add Invoice</h2>
        <form
          action={onSubmit}
          className="space-y-6"
          onSubmit={() => onClose()}
        >
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 text-left" htmlFor="registrationId">
              Course
            </label>
            <select
              id="registrationId"
              name="registrationId"
              required
              defaultValue=""
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="" disabled>Select course invoice</option>
              {registrations.map(reg => (
                <option key={reg.id} value={reg.id}>
                  {reg.course?.program?.name ?? 'Course'} ({reg.status})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 text-left" htmlFor="amount">
              Amount (€)
            </label>
            <input
              id="amount"
              type="number"
              name="amount"
              placeholder="Amount"
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 text-left" htmlFor="dueDate">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              name="dueDate"
              placeholder="Due Date"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              defaultValue={new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 text-left">
              Recipient Type
            </label>
            <div className="flex gap-4">
  <label className="flex items-center gap-1">
    <input
      type="radio"
      name="recipientType"
      value="PERSON"
      checked={recipientType === 'PERSON'}
      onChange={() => setRecipientType('PERSON')}
      required
    />
    <span className="text-xs">Person</span>
  </label>
  <label className="flex items-center gap-1">
    <input
      type="radio"
      name="recipientType"
      value="COMPANY"
      checked={recipientType === 'COMPANY'}
      onChange={() => setRecipientType('COMPANY')}
      required
    />
    <span className="text-xs">Firma</span>
  </label>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 text-left" htmlFor="recipientName">
              Recipient Name
            </label>
            <input
              id="recipientName"
              type="text"
              name="recipientName"
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 text-left" htmlFor="recipientEmail">
              Recipient Email
            </label>
            <input
              id="recipientEmail"
              type="email"
              name="recipientEmail"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 text-left" htmlFor="recipientAddress">
              Recipient Address
            </label>
            <input
              id="recipientAddress"
              type="text"
              name="recipientAddress"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
              Add Invoice
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}