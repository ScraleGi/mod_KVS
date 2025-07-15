'use client'

// <RecipientSelect recipients={recipients} participants={participants} /> this is how you would use the component in your page

import React, { useState, useEffect } from 'react'

type Recipient = {
  id: string
  type: string // e.g. 'COMPANY', 'PERSON', or 'PARTICIPANT'
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

// Assuming Participant has the same shape as Recipient, you can tweak if different
type Participant = {
  id: string
  participantSalutation?: string | null
  participantName?: string | null
  participantSurname?: string | null
  participantEmail?: string | null
  participantStreet?: string | null
  postalCode?: string | null
  participantCity?: string | null
  participantCountry?: string | null
}

type Props = {
  recipients: Recipient[]
  participants: Participant[]
}

export default function RecipientSelect({ recipients, participants }: Props) {
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState<Recipient[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allEntries, setAllEntries] = useState<Recipient[]>([])

  // Merge recipients and participants into one array with uniform shape
  useEffect(() => {
    const participantAsRecipient: Recipient[] = participants.map((p) => ({
      id: 'participant-' + p.id,
      type: 'PARTICIPANT',
      recipientSalutation: p.participantSalutation ?? null,
      recipientName: p.participantName ?? null,
      recipientSurname: p.participantSurname ?? null,
      companyName: null,
      recipientEmail: p.participantEmail ?? null,
      recipientStreet: p.participantStreet ?? null,
      postalCode: p.postalCode ?? null,
      recipientCity: p.participantCity ?? null,
      recipientCountry: p.participantCountry ?? null,
    }))

    // Combine and store
    setAllEntries([...recipients, ...participantAsRecipient])
  }, [recipients, participants])

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearch(value)
    if (!value) {
      setFiltered([])
      setShowSuggestions(false)
      return
    }

    // Filter all combined entries by name/company
    const filteredEntries = allEntries.filter((r) => {
      const name =
        r.type === 'COMPANY'
          ? r.companyName ?? ''
          : `${r.recipientName ?? ''} ${r.recipientSurname ?? ''}`

      return name.toLowerCase().includes(value.toLowerCase())
    })

    const uniqueFiltered = uniqueRecipients(filteredEntries)
    setFiltered(uniqueFiltered)
    setShowSuggestions(true)
  }

  function handleSelect(recipient: Recipient) {
    const displayName =
      recipient.type === 'COMPANY'
        ? recipient.companyName ?? ''
        : `${recipient.recipientSalutation ? recipient.recipientSalutation + ' ' : ''}${recipient.recipientName ?? ''} ${recipient.recipientSurname ?? ''}`

    setSearch(displayName.trim())
    setShowSuggestions(false)

    const form = document.getElementById('invoice-form') as HTMLFormElement | null
    if (!form) return

    const typeSelect = form.querySelector('select[name="type"]') as HTMLSelectElement | null
    if (typeSelect && recipient.type) typeSelect.value = recipient.type

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

  // Filters duplicates by comparing all relevant fields ignoring case
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
        Search Previous Recipient or Participant to Autofill
      </legend>

      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Start typing recipient or participant name or company..."
        className="w-full border border-neutral-300 rounded px-2 py-1 text-sm"
        autoComplete="off"
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        onFocus={() => search && setShowSuggestions(true)}
      />

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
              {r.type === 'PARTICIPANT' && (
                <span className="italic text-gray-500 ml-1">(participant)</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  )
}









//BACKUP CODE DROPDOWN

// 'use client'

// import React from 'react'

// type Recipient = {
//   id: string
//   type: string
//   recipientSalutation?: string
//   recipientName?: string
//   recipientSurname?: string
//   companyName?: string
//   recipientEmail: string
//   recipientStreet: string
//   postalCode: string
//   recipientCity: string
//   recipientCountry: string
// }

// export default function RecipientSelect({ recipients }: { recipients: Recipient[] }) {
//   const [selectedRecipient, setSelectedRecipient] = React.useState<Recipient | null>(null)

//   function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
//     const recipientId = e.target.value
//     if (!recipientId) return

//     const recipient = recipients.find((r) => r.id === recipientId)
//     if (!recipient) return

//     setSelectedRecipient(recipient)

//     const form = document.getElementById('invoice-form') as HTMLFormElement | null
//     if (!form) return

//     const typeSelect = form.querySelector('select[name="type"]') as HTMLSelectElement | null
//     if (typeSelect && recipient.type) typeSelect.value = recipient.type

//     const setInput = (name: string, value?: string) => {
//       const input = form.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`)
//       if (input && value !== undefined) {
//         input.value = value
//       }
//     }

//     setInput('recipientSalutation', recipient.recipientSalutation || '')
//     setInput('recipientName', recipient.recipientName || '')
//     setInput('recipientSurname', recipient.recipientSurname || '')
//     setInput('companyName', recipient.companyName || '')
//     setInput('recipientEmail', recipient.recipientEmail)
//     setInput('recipientStreet', recipient.recipientStreet)
//     setInput('postalCode', recipient.postalCode)
//     setInput('recipientCity', recipient.recipientCity)
//     setInput('recipientCountry', recipient.recipientCountry)
//   }

//   return (
//     <fieldset className="border border-neutral-200 rounded-lg p-5 mb-6">
//       <legend className="text-base font-semibold text-blue-700 px-2">
//         Select Previous Recipient to Autofill
//       </legend>

//       <select
//         onChange={handleSelect}
//         defaultValue=""
//         className="w-full border border-neutral-300 rounded px-2 py-1 text-sm"
//       >
//         <option value="" disabled>
//           -- Select saved recipient --
//         </option>
//         {recipients.map((r) => (
//   <option key={r.id} value={r.id}>
//     {r.type === 'COMPANY'
//       ? r.companyName
//       : `${r.recipientName || ''} ${r.recipientSurname || ''}`} 
//     — {r.recipientStreet}, {r.postalCode} {r.recipientCity}
//   </option>
//         ))}
//       </select>
//     </fieldset>
//   )
// }
