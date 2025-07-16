'use client'
import { useState } from 'react'
import { holidayColumns } from '../columns'
import { Holiday } from '../types'
import { createHoliday, updateHoliday, deleteHoliday } from '../actions'
import { TableToolbar } from './TableToolbar'

function IconEdit() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L5 12l4-4z" />
    </svg>
  )
}
function IconTrash() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  )
}
function IconAdd() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}

  export function HolidayTable({ holidays }: { holidays: Holiday[] }) {
    const [query, setQuery] = useState('')
    const [dateFilter, setDateFilter] = useState('')

  const filtered = holidays.filter(h =>
    (h.title.toLowerCase().includes(query.toLowerCase()) ||
      h.date.toLowerCase().includes(query.toLowerCase())) &&
    (dateFilter === '' || h.date.slice(0, 10) === dateFilter)
  )

  return (
    <div className="mt-10 mb-10">
            <TableToolbar
        onSearch={setQuery}
        dateFilter={dateFilter}
        onDateFilter={setDateFilter}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse table-fixed">
          <colgroup>
            <col style={{ width: '33.33%' }} />
            <col style={{ width: '33.33%' }} />
            <col style={{ width: '33.33%' }} />
          </colgroup>
          <thead>
            <tr>
              {holidayColumns.map((col, idx) => (
                <th
                  key={col.key}
                  className={`py-2 px-2 font-medium text-gray-500 border-b border-gray-200 bg-white text-left${idx < 2 ? ' border-r border-gray-200' : ''}`}
                >
                  {col.label}
                </th>
              ))}
              <th className="py-2 px-2 font-medium text-gray-500 border-b bg-white text-center border-l border-gray-200">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(h => (
              <tr key={h.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-1 px-1 align-middle border-r border-gray-100">
                  <form action={updateHoliday} className="flex items-center gap-0.5">
                    <input
                      name="title"
                      defaultValue={h.title}
                      className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                    />
                    <input type="hidden" name="id" value={h.id} />
                    <input type="hidden" name="date" value={h.date.slice(0, 10)} />
                    <button
                      type="submit"
                      className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition"
                      title="Speichern"
                    >
                      <IconEdit />
                    </button>
                  </form>
                </td>
                <td className="py-1 px-1 align-middle border-r border-gray-100">
                  <form action={updateHoliday} className="flex items-center gap-0.5">
                    <input
                      name="date"
                      type="date"
                      defaultValue={h.date.slice(0, 10)}
                      className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                    />
                    <input type="hidden" name="id" value={h.id} />
                    <input type="hidden" name="title" value={h.title} />
                    <button
                      type="submit"
                      className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition"
                      title="Speichern"
                    >
                      <IconEdit />
                    </button>
                  </form>
                </td>
                <td className="py-1 px-1 align-middle text-center">
                  <form action={deleteHoliday} className="inline-flex items-center justify-center gap-0.5">
                    <input type="hidden" name="id" value={h.id} />
                    <button
                      type="submit"
                      className="p-0.5 text-gray-400 hover:text-red-500 rounded transition"
                      title="Löschen"
                    >
                      <IconTrash />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {/* Add new holiday row */}
            <tr className="bg-white">
              <td className="py-1 px-1 align-middle border-r border-gray-100">
                <form action={createHoliday} className="flex items-center gap-0.5">
                  <input
                    name="title"
                    placeholder="Titel"
                    className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                    required
                  />
                </form>
              </td>
              <td className="py-1 px-1 align-middle border-r border-gray-100">
                <form action={createHoliday} className="flex items-center gap-0.5">
                  <input
                    name="date"
                    type="date"
                    className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="p-0.5 text-gray-400 hover:text-green-600 rounded transition"
                    title="Hinzufügen"
                  >
                    <IconAdd />
                  </button>
                </form>
              </td>
              <td className="py-1 px-1 align-middle"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}