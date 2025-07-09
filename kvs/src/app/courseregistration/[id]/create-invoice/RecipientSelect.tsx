'use client'

import React from 'react'

type Recipient = {
  id: string
  type: string
  recipientSalutation?: string
  recipientName?: string
  recipientSurname?: string
  companyName?: string
  recipientEmail: string
  recipientStreet: string
  postalCode: string
  recipientCity: string
  recipientCountry: string
}

export default function RecipientSelect({ recipients }: { recipients: Recipient[] }) {
  // Autofill inputs on selection
  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const recipientId = e.target.value
    if (!recipientId) return

    const recipient = recipients.find((r) => r.id === recipientId)
    if (!recipient) return

    const form = document.getElementById('invoice-form') as HTMLFormElement | null
    if (!form) return

    const typeSelect = form.querySelector('select[name="type"]') as HTMLSelectElement | null
    if (typeSelect && recipient.type) typeSelect.value = recipient.type

    const setInput = (name: string, value?: string) => {
      const input = form.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`)
      if (input && value !== undefined) {
        input.value = value
      }
    }
    setInput('recipientSalutation', recipient.recipientSalutation || '')
    setInput('recipientName', recipient.recipientName || '')
    setInput('recipientSurname', recipient.recipientSurname || '')
    setInput('companyName', recipient.companyName || '')
    setInput('recipientEmail', recipient.recipientEmail)
    setInput('recipientStreet', recipient.recipientStreet)
    setInput('postalCode', recipient.postalCode)
    setInput('recipientCity', recipient.recipientCity)
    setInput('recipientCountry', recipient.recipientCountry)
  }

  return (
    <fieldset className="border border-neutral-200 rounded-lg p-5 mb-6">
      <legend className="text-base font-semibold text-blue-700 px-2">
        Select Previous Recipient to Autofill
      </legend>
      <select
        onChange={handleSelect}
        defaultValue=""
        className="w-full border border-neutral-300 rounded px-2 py-1 text-sm"
      >
        <option value="" disabled>
          -- Select saved recipient --
        </option>
        {recipients.map((r) => (
          <option key={r.id} value={r.id}>
            {r.type === 'COMPANY'
              ? r.companyName || '(No company name)'
              : `${r.recipientName || ''} ${r.recipientSurname || ''}`}
          </option> // HERE IS THE DATA IN THE DROPDOWN LISTE add here adresse etc anschrift halt in grau
        ))}
      </select>
    </fieldset>
  )
}
