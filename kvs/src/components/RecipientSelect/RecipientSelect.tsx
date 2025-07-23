'use client'

import React, { useState } from 'react'

type Recipient = {
  id: string
  type: string
  recipientSalutation?: string | null
  recipientName?: string | null
  recipientSurname?: string | null
  companyName?: string | null
  recipientEmail?: string | null
  recipientStreet?: string | null
  postalCode?: string | null
  recipientCity?: string | null
  recipientCountry?: string | null
}

/**
 * RecipientSelect is an autocomplete component for selecting previous recipients.
 * 
 * - Lets the user search for a recipient by name or company.
 * - On selection, auto-fills the invoice form fields with the recipient's data.
 * 
 * Where is this code used?
 * - Use this component in invoice or billing pages where you want to let users quickly fill recipient data from previous entries.
 * - It expects the parent page to provide a `recipients` array and to have a form with id="invoice-form" and matching input/select names.
 */

export default function RecipientSelect({ recipients }: { recipients: Recipient[] }) {
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState<Recipient[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Handle input changes and filter recipients for suggestions
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearch(value)
    if (!value) {
      setFiltered([])
      setShowSuggestions(false)
      return
    }

    // Filter recipients by name or company
    const filteredRecipients = recipients.filter((r) => {
      const name =
        r.type === 'COMPANY'
          ? r.companyName ?? ''
          : `${r.recipientName ?? ''} ${r.recipientSurname ?? ''}`
      return name.toLowerCase().includes(value.toLowerCase())
    })

    // Remove duplicates
    const uniqueFiltered = uniqueRecipients(filteredRecipients)
    setFiltered(uniqueFiltered)
    setShowSuggestions(true)
  }

  // When a suggestion is selected, fill the form fields
  function handleSelect(recipient: Recipient) {
    const displayName =
      recipient.type === 'COMPANY'
        ? recipient.companyName ?? ''
        : `${recipient.recipientSalutation ? recipient.recipientSalutation + ' ' : ''}${recipient.recipientName ?? ''} ${recipient.recipientSurname ?? ''}`

    setSearch(displayName.trim())
    setShowSuggestions(false)

    // Find the invoice form and fill its fields
    const form = document.getElementById('invoice-form') as HTMLFormElement | null
    if (!form) return

    // Set the type select value
    const typeSelect = form.querySelector('select[name="type"]') as HTMLSelectElement | null
    if (typeSelect && recipient.type) typeSelect.value = recipient.type

    // Helper to set input/select values
    const setInput = (name: string, value?: string | null) => {
      const input = form.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`)
      if (input && value !== undefined && value !== null) {
        input.value = value
      }
    }

    setInput('recipientSalutation', recipient.recipientSalutation)
    setInput('recipientName', recipient.recipientName)
    setInput('recipientSurname', recipient.recipientSurname)
    setInput('companyName', recipient.companyName)
    setInput('recipientEmail', recipient.recipientEmail)
    setInput('recipientStreet', recipient.recipientStreet)
    setInput('postalCode', recipient.postalCode)
    setInput('recipientCity', recipient.recipientCity)
    setInput('recipientCountry', recipient.recipientCountry)
  }

  // Helper to filter out duplicate recipients
  function uniqueRecipients(recipients: Recipient[]): Recipient[] {
    const seen = new Set<string>()
    return recipients.filter((r) => {
      const key = [
        r.type,
        r.recipientSalutation ?? '',
        r.recipientName ?? '',
        r.recipientSurname ?? '',
        r.companyName ?? '',
        r.recipientEmail ?? '',
        r.recipientStreet ?? '',
        r.postalCode ?? '',
        r.recipientCity ?? '',
        r.recipientCountry ?? '',
      ]
        .join('|')
        .toLowerCase()

      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  return (
    <fieldset className="border border-neutral-200 rounded-lg p-5 mb-4 mt-4 relative">
      <legend className="text-base font-semibold text-blue-700 px-2">
        Vorherigen Empfänger zum automatischen Ausfüllen
      </legend>

      {/* Search input for recipient name or company */}
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Empfängername oder der Firma eingeben..."
        className="w-full border border-neutral-300 rounded px-2 py-1 text-sm"
        autoComplete="off"
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        onFocus={() => search && setShowSuggestions(true)}
      />

      {/* Suggestions dropdown */}
      {showSuggestions && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border border-neutral-300 rounded shadow-md max-h-48 overflow-auto w-full mt-1 text-sm">
          {filtered.map((r) => (
            <li
              key={r.id}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              onMouseDown={() => handleSelect(r)}
            >
              {r.type === 'COMPANY'
                ? r.companyName
                : `${r.recipientSalutation ? r.recipientSalutation + ' ' : ''}${r.recipientName ?? ''} ${r.recipientSurname ?? ''}`}{' '}
              — {r.recipientStreet ?? ''}, {r.postalCode ?? ''} {r.recipientCity ?? ''}
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  )
}


