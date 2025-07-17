'use client'
import { useState } from 'react'

const WEEK_DAYS = [
  { key: '', label: 'Alle Wochentage' },
  { key: 'MONDAY', label: 'Montag' },
  { key: 'TUESDAY', label: 'Dienstag' },
  { key: 'WEDNESDAY', label: 'Mittwoch' },
  { key: 'THURSDAY', label: 'Donnerstag' },
  { key: 'FRIDAY', label: 'Freitag' },
  { key: 'SATURDAY', label: 'Samstag' },
  { key: 'SUNDAY', label: 'Sonntag' },
]

type Props = {
  onSearch?: (query: string) => void
  dateFilter?: string
  onDateFilter?: (date: string) => void
  year?: string
  onYearChange?: (year: string) => void
  weekDayFilter?: string
  onWeekDayFilter?: (weekDay: string) => void
  searchPlaceholder?: string 
  disabledWeekDays?: string[] // <-- Add this prop
}

export function TableToolbar({
  onSearch,
  dateFilter,
  onDateFilter,
  year,
  onYearChange,
  weekDayFilter,
  onWeekDayFilter,
  searchPlaceholder = 'Suche…',
  disabledWeekDays = [], // <-- Default empty array
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

  const years = Array.from({ length: 7 }, (_, i) => (2024 + i).toString())

  return (
    <div className="flex items-center gap-2 mb-2">
      {onSearch && (
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={query}
          onChange={handleChange}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition w-full max-w-xs"
        />
      )}
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
          {WEEK_DAYS.map(day => (
            <option
              key={day.key}
              value={day.key}
              disabled={disabledWeekDays.includes(day.key) && day.key !== ''}
            >
              {day.label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}