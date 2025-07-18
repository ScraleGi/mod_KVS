'use client'
import { useState } from 'react'
import { holidayColumns } from '../../app/coursedays/columns'
import { Holiday } from '../../app/coursedays/types'
import { createHoliday, updateHoliday, deleteHoliday } from '../../app/coursedays/actions'
import { TableToolbar } from './TableToolbar'

function IconEdit() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  )
}
function IconSave() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
function IconTrash() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6m5 10v-6" />
    </svg>
  )
}
function IconCancel() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
  const currentYear = new Date().getFullYear().toString()
  const [query, setQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [year, setYear] = useState(currentYear) // Default to current year
  const [editId, setEditId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ title: string; date: string }>({ title: '', date: '' })

  const filtered = holidays
    .filter(h =>
      (h.title.toLowerCase().includes(query.toLowerCase()) ||
        h.date.toLowerCase().includes(query.toLowerCase())) &&
      (dateFilter === '' || h.date.slice(0, 10) === dateFilter) &&
      (year === '' || h.date.slice(0, 4) === year)
    )
    .sort((a, b) => b.date.localeCompare(a.date)) // Newer date first

  function handleEdit(id: string, title: string, date: string) {
    setEditId(id)
    setEditValues({ title, date: date.slice(0, 10) })
  }

  function handleCancel() {
    setEditId(null)
    setEditValues({ title: '', date: '' })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditValues({ ...editValues, [e.target.name]: e.target.value })
  }

  return (
    <div className="mt-10 mb-10">
      <TableToolbar
        onSearch={setQuery}
        dateFilter={dateFilter}
        onDateFilter={setDateFilter}
        year={year}
        onYearChange={setYear}
        searchPlaceholder="Feiertag suchen…"
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
            {/* Add new holiday row */}
            <tr className="bg-white">
              <td className="py-1 px-1 align-middle border-r border-gray-100">
                <input
                  name="title"
                  form="add-holiday-form"
                  placeholder="Neuer Feiertag"
                  className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                  required
                />
              </td>
              <td className="py-1 px-1 align-middle border-r border-gray-100">
                <input
                  name="date"
                  form="add-holiday-form"
                  type="date"
                  placeholder="Datum"
                  className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                  required
                />
              </td>
              <td className="py-1 px-1 align-middle text-center">
                <form action={createHoliday} id="add-holiday-form">
                  <button
                    type="submit"
                    className="mx-auto block p-0.5 text-gray-400 hover:text-green-600 rounded transition"
                    title="Hinzufügen"
                  >
                    <IconAdd />
                  </button>
                </form>
              </td>
            </tr>
            {filtered.map(h => (
              <tr key={h.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                {editId === h.id ? (
                  <>
                    <td className="py-1 px-1 align-middle border-r border-gray-100">
                      <input
                        name="title"
                        value={editValues.title}
                        onChange={handleChange}
                        className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                      />
                    </td>
                    <td className="py-1 px-1 align-middle border-r border-gray-100">
                      <input
                        name="date"
                        type="date"
                        value={editValues.date}
                        onChange={handleChange}
                        className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                      />
                    </td>
                    <td className="py-1 px-1 align-middle text-center flex gap-1 justify-center">
                      <form
                        action={updateHoliday}
                        onSubmit={handleCancel}
                        className="inline-flex items-center gap-0.5"
                      >
                        <input type="hidden" name="id" value={h.id} />
                        <input type="hidden" name="title" value={editValues.title} />
                        <input type="hidden" name="date" value={editValues.date} />
                        <button
                          type="submit"
                          className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition"
                          title="Speichern"
                        >
                          <IconSave />
                        </button>
                      </form>
                      <button
                        type="button"
                        className="p-0.5 text-gray-400 hover:text-orange-500 rounded transition"
                        title="Abbrechen"
                        onClick={handleCancel}
                      >
                        <IconCancel />
                      </button>
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
                  </>
                ) : (
                  <>
                    <td className="py-1 px-1 align-middle border-r border-gray-100">
                      <input
                        name="title"
                        value={h.title}
                        readOnly
                        className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                        onFocus={() => handleEdit(h.id, h.title, h.date)}
                      />
                    </td>
                    <td className="py-1 px-1 align-middle border-r border-gray-100">
                      <input
                        name="date"
                        type="date"
                        value={h.date.slice(0, 10)}
                        readOnly
                        className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                        onFocus={() => handleEdit(h.id, h.title, h.date)}
                      />
                    </td>
                    <td className="py-1 px-1 align-middle text-center flex gap-1 justify-center">
                      <button
                        type="button"
                        className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition"
                        title="Bearbeiten"
                        onClick={() => handleEdit(h.id, h.title, h.date)}
                      >
                        <IconEdit />
                      </button>
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
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}