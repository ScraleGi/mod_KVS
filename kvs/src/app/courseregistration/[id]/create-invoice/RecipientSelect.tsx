'use client'

import React, { useState } from 'react'

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
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState<Recipient[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearch(value)
    if (!value) {
      setFiltered([])
      setShowSuggestions(false)
      return
    }

    const filteredRecipients = recipients.filter((r) => {
      const name =
        r.type === 'COMPANY'
          ? r.companyName ?? ''
          : `${r.recipientName ?? ''} ${r.recipientSurname ?? ''}`
      return name.toLowerCase().includes(value.toLowerCase())
    })

    const uniqueFiltered = uniqueRecipients(filteredRecipients)
    setFiltered(uniqueFiltered)
    setShowSuggestions(true)
  }

  function handleSelect(recipient: Recipient) {
    setSearch(
      recipient.type === 'COMPANY'
        ? recipient.companyName ?? ''
        : `${recipient.recipientSalutation ? recipient.recipientSalutation + ' ' : ''}${recipient.recipientName ?? ''} ${recipient.recipientSurname ?? ''}`
    )
    setShowSuggestions(false)

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

    setInput('recipientSalutation', recipient.recipientSalutation ?? '')
    setInput('recipientName', recipient.recipientName ?? '')
    setInput('recipientSurname', recipient.recipientSurname ?? '')
    setInput('companyName', recipient.companyName ?? '')
    setInput('recipientEmail', recipient.recipientEmail)
    setInput('recipientStreet', recipient.recipientStreet)
    setInput('postalCode', recipient.postalCode)
    setInput('recipientCity', recipient.recipientCity)
    setInput('recipientCountry', recipient.recipientCountry)
  }

  function uniqueRecipients(recipients: Recipient[]): Recipient[] {
    const seen = new Set<string>()
    return recipients.filter((r) => {
      const key = [
        r.type,
        r.recipientSalutation ?? '',
        r.recipientName ?? '',
        r.recipientSurname ?? '',
        r.companyName ?? '',
        r.recipientEmail,
        r.recipientStreet,
        r.postalCode,
        r.recipientCity,
        r.recipientCountry,
      ].join('|').toLowerCase()

      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  return (
    <fieldset className="border border-neutral-200 rounded-lg p-5 mb-6 relative">
      <legend className="text-base font-semibold text-blue-700 px-2">
        Search Previous Recipient to Autofill
      </legend>

      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Start typing recipient name or company..."
        className="w-full border border-neutral-300 rounded px-2 py-1 text-sm"
        autoComplete="off"
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // delay to allow click
        onFocus={() => search && setShowSuggestions(true)}
      />

      {showSuggestions && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border border-neutral-300 rounded shadow-md max-h-48 overflow-auto w-full mt-1 text-sm">
          {filtered.map((r) => (
            <li
              key={r.id}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              onMouseDown={() => handleSelect(r)} // use onMouseDown to prevent blur before click
            >
              {r.type === 'COMPANY'
                ? r.companyName
                : `${r.recipientSalutation ? r.recipientSalutation + ' ' : ''}${r.recipientName ?? ''} ${r.recipientSurname ?? ''}`} —{' '}
              {r.recipientStreet}, {r.postalCode} {r.recipientCity}
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
