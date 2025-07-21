'use client'
import { useState } from 'react'

export function EditableCell({ value, name, type = 'text' }: { value: string, name: string, type?: string }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)
  return editing ? (
    <input
      name={name}
      type={type}
      value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={() => setEditing(false)}
      autoFocus
      className="border border-gray-300 rounded px-2 py-1 text-gray-800 bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
    />
  ) : (
    <span
      onClick={() => setEditing(true)}
      className="cursor-pointer px-1 py-0.5 rounded hover:bg-gray-100 transition text-gray-800"
      title="Zum Bearbeiten klicken"
    >
      {val}
    </span>
  )
}