'use client'

// <AutoCompleteSelect recipients={recipients} participants={participants} /> 


import React, { useState } from 'react'

type BaseItem = {
  id: string
  street?: string | null
  postalCode?: string | null
  city?: string | null
  country?: string | null
  email?: string | null
}

type Recipient = BaseItem & {
  type: string
  recipientSalutation?: string | null
  recipientName?: string | null
  recipientSurname?: string | null
  companyName?: string | null
  isRecipient: true
}

type Participant = BaseItem & {
  salutation: string
  name: string
  surname: string
  isRecipient?: false
}

type Props = {
  recipients: Recipient[]
  participants: Participant[]
}

type MergedItem = Recipient | Participant

export default function AutoCompleteSelect({ recipients, participants }: Props) {
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState<MergedItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearch(value)

    if (!value) {
      setFiltered([])
      setShowSuggestions(false)
      return
    }

    const normalizedRecipients: Recipient[] = recipients.map((r) => ({ ...r, isRecipient: true }))
    const normalizedParticipants: Participant[] = participants.map((p) => ({ ...p, isRecipient: false }))

    const results = [...normalizedRecipients, ...normalizedParticipants].filter((item) => {
      const name = item.isRecipient
        ? item.type === 'COMPANY'
          ? item.companyName ?? ''
          : `${item.recipientSalutation ?? ''} ${item.recipientName ?? ''} ${item.recipientSurname ?? ''}`
        : `${item.salutation} ${item.name} ${item.surname}`
      return name.toLowerCase().includes(value.toLowerCase())
    })

    setFiltered(results)
    setShowSuggestions(true)
  }

  function handleSelect(item: MergedItem) {
    const form = document.getElementById('invoice-form') as HTMLFormElement | null
    if (!form) return

    if (item.isRecipient) {
      // Recipient autofill
      const r = item as Recipient
      const displayName =
        r.type === 'COMPANY'
          ? r.companyName ?? ''
          : `${r.recipientSalutation ? r.recipientSalutation + ' ' : ''}${r.recipientName ?? ''} ${r.recipientSurname ?? ''}`

      setSearch(displayName.trim())

      const setInput = (name: string, value?: string | null) => {
        const input = form.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`)
        if (input && value !== undefined && value !== null) {
          input.value = value
        }
      }

      setInput('recipientSalutation', r.recipientSalutation)
      setInput('recipientName', r.recipientName)
      setInput('recipientSurname', r.recipientSurname)
      setInput('companyName', r.companyName)
      setInput('recipientEmail', r.email)
      setInput('recipientStreet', r.street)
      setInput('postalCode', r.postalCode)
      setInput('recipientCity', r.city)
      setInput('recipientCountry', r.country)

      const typeSelect = form.querySelector('select[name="type"]') as HTMLSelectElement | null
      if (typeSelect && r.type) typeSelect.value = r.type
    } else {
      // Participant autofill
      const p = item as Participant
      const displayName = `${p.salutation} ${p.name} ${p.surname}`.trim()
      setSearch(displayName)

      const setInput = (name: string, value?: string) => {
        const input = form.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`)
        if (input && value !== undefined) {
          input.value = value
        }
      }

      setInput('recipientSalutation', p.salutation)
      setInput('recipientName', p.name)
      setInput('recipientSurname', p.surname)
      setInput('recipientEmail', p.email ?? undefined)
      setInput('recipientStreet', p.street ?? undefined)
      setInput('postalCode', p.postalCode ?? undefined)
      setInput('recipientCity', p.city ?? undefined)
      setInput('recipientCountry', p.country ?? undefined)

      const typeSelect = form.querySelector('select[name="type"]') as HTMLSelectElement | null
      if (typeSelect) typeSelect.value = 'PERSON'
    }

    setShowSuggestions(false)
  }

  return (
    <fieldset className="border border-neutral-200 rounded-lg p-5 mb-4 mt-4 relative">
      <legend className="text-base font-semibold text-blue-700 px-2">
        Search Recipients & Participants to Autofill
      </legend>

      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Start typing name or company..."
        className="w-full border border-neutral-300 rounded px-2 py-1 text-sm"
        autoComplete="off"
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        onFocus={() => search && setShowSuggestions(true)}
      />

      {showSuggestions && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border border-neutral-300 rounded shadow-md max-h-48 overflow-auto w-full mt-1 text-sm">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              onMouseDown={() => handleSelect(item)}
            >
              {item.isRecipient ? (
                <>
                  <strong>Recipient:</strong>{' '}
                  {item.type === 'COMPANY'
                    ? item.companyName
                    : `${item.recipientSalutation ? item.recipientSalutation + ' ' : ''}${item.recipientName ?? ''} ${item.recipientSurname ?? ''}`}
                </>
              ) : (
                <>
                  <strong>Participant:</strong> {item.salutation} {item.name} {item.surname}
                </>
              )}
              {' — '}
              {item.street}, {item.postalCode} {item.city}
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  )
}
