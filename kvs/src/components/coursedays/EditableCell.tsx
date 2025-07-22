'use client'
import { useState } from 'react'

/**
 * EditableCell
 * 
 * Renders a table cell that can be clicked to edit its value.
 * - value: Initial value to display.
 * - name: Name attribute for the input.
 * - type: Input type (default: 'text').
 */
export function EditableCell({ value, name, type = 'text' }: { value: string, name: string, type?: string }) {
  const [editing, setEditing] = useState(false) // Track if cell is in edit mode
  const [val, setVal] = useState(value)        // Current value of the cell

  // If editing, show input field
  return editing ? (
    <input
      name={name}
      type={type}
      value={val}
      onChange={e => setVal(e.target.value)}   // Update value on change
      onBlur={() => setEditing(false)}         // Exit edit mode on blur
      autoFocus
      className="border border-gray-300 rounded px-2 py-1 text-gray-800 bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
    />
  ) : (
    // If not editing, show value as text. Click to enter edit mode.
    <span
      onClick={() => setEditing(true)}
      className="cursor-pointer px-1 py-0.5 rounded hover:bg-gray-100 transition text-gray-800"
      title="Zum Bearbeiten klicken"
    >
      {val}
    </span>
  )
}