'use client'
import { useState } from 'react'

export function TableToolbar({
  onSearch,
  dateFilter,
  onDateFilter,
}: {
  onSearch?: (query: string) => void
  dateFilter?: string
  onDateFilter?: (date: string) => void
}) {
  const [query, setQuery] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    onDateFilter?.(e.target.value)
  }

  return (
    <div className="flex items-center gap-2 mb-2">
      <input
        type="text"
        placeholder="Feiertag suchen…"
        value={query}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition w-full max-w-xs"
      />
      <input
        type="date"
        value={dateFilter ?? ''}
        onChange={handleDateChange}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition w-full max-w-xs"
      />
    </div>
  )
}