'use client'
import { useState } from 'react'

type Props = {
  onSearch?: (query: string) => void
  dateFilter?: string
  onDateFilter?: (date: string) => void
  year?: string
  onYearChange?: (year: string) => void
  weekDayFilter?: string
  onWeekDayFilter?: (weekDay: string) => void
}

export function TableToolbar({
  onSearch,
  dateFilter,
  onDateFilter,
  year,
  onYearChange,
  weekDayFilter,
  onWeekDayFilter,
}: Props) {
  const [query, setQuery] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    onDateFilter?.(e.target.value)
  }

  function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onYearChange?.(e.target.value)
  }

  function handleWeekDayChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onWeekDayFilter?.(e.target.value)
  }

  // Years from 2024 to 2030
  const years = Array.from({ length: 7 }, (_, i) => (2024 + i).toString())

  return (
    <div className="flex items-center gap-2 mb-2">
      <input
        type="text"
        placeholder="Feiertag suchen…"
        value={query}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition w-full max-w-xs"
      />
      {typeof dateFilter !== 'undefined' && (
        <input
          type="date"
          value={dateFilter ?? ''}
          onChange={handleDateChange}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition w-full max-w-xs"
        />
      )}
      {typeof year !== 'undefined' && (
        <select
          value={year ?? ''}
          onChange={handleYearChange}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
        >
          <option value="">Alle Jahre</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      )}
      {typeof weekDayFilter !== 'undefined' && (
        <select
          value={weekDayFilter ?? ''}
          onChange={handleWeekDayChange}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
        >
          <option value="">Alle Wochentage</option>
          <option value="MONDAY">Montag</option>
          <option value="TUESDAY">Dienstag</option>
          <option value="WEDNESDAY">Mittwoch</option>
          <option value="THURSDAY">Donnerstag</option>
          <option value="FRIDAY">Freitag</option>
          <option value="SATURDAY">Samstag</option>
          <option value="SUNDAY">Sonntag</option>
        </select>
      )}
    </div>
  )
}