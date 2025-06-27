'use client'
import { useState } from 'react'
import AddInvoiceModal from '../../../components/forms/AddInvoiceModal'

export default function ClientInvoiceModalWrapper({
  addInvoice,
  registrations,
}: {
  addInvoice: (formData: FormData) => void
  registrations: any[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-blue-600 hover:bg-blue-50 transition"
        title="Add new invoice"
        type="button"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
      </button>
      <AddInvoiceModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={async (formData) => {
          await addInvoice(formData)
          setOpen(false)
        }}
        registrations={registrations}
      />
    </>
  )
}