'use client'

import React, { useState } from 'react'

type Participant = {
  id: string
  salutation: string
  name: string
  surname: string
  email: string
  street: string
  postalCode: string
  city: string
  country: string
}

export default function ParticipantSelect({ participants }: { participants: Participant[] }) {
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState<Participant[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearch(value)
    if (!value) {
      setFiltered([])
      setShowSuggestions(false)
      return
    }

    const filteredParticipants = participants.filter((p) => {
      const fullName = `${p.salutation} ${p.name} ${p.surname}`
      return fullName.toLowerCase().includes(value.toLowerCase())
    })

    setFiltered(filteredParticipants)
    setShowSuggestions(true)
  }

  function handleSelect(participant: Participant) {
    const displayName = `${participant.salutation} ${participant.name} ${participant.surname}`.trim()
    setSearch(displayName)
    setShowSuggestions(false)

    const form = document.getElementById('invoice-form') as HTMLFormElement | null
    if (!form) return

    const setInput = (name: string, value?: string) => {
      const input = form.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`)
      if (input && value !== undefined) {
        input.value = value
      }
    }

    // Fill form inputs with participant data
    setInput('recipientSalutation', participant.salutation)
    setInput('recipientName', participant.name)
    setInput('recipientSurname', participant.surname)
    setInput('recipientEmail', participant.email)
    setInput('recipientStreet', participant.street)
    setInput('postalCode', participant.postalCode)
    setInput('recipientCity', participant.city)
    setInput('recipientCountry', participant.country)

    // If you have a hidden or select input for type, set it to PERSON here
    const typeSelect = form.querySelector('select[name="type"]') as HTMLSelectElement | null
    if (typeSelect) typeSelect.value = 'PERSON'
  }

  return (
    <fieldset className="border border-neutral-200 rounded-lg p-5 mb-4 mt-4 relative">
      <legend className="text-base font-semibold text-blue-700 px-2">
        Search Participants to Autofill
      </legend>

      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Start typing participant name..."
        className="w-full border border-neutral-300 rounded px-2 py-1 text-sm"
        autoComplete="off"
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        onFocus={() => search && setShowSuggestions(true)}
      />

      {showSuggestions && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border border-neutral-300 rounded shadow-md max-h-48 overflow-auto w-full mt-1 text-sm">
          {filtered.map((p) => (
            <li
              key={p.id}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              onMouseDown={() => handleSelect(p)}
            >
              {`${p.salutation} ${p.name} ${p.surname}`} — {p.street}, {p.postalCode} {p.city}
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  )
}
