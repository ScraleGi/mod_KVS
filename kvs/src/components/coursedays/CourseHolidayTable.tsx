'use client'
import React, { useState, useEffect } from 'react'
import { courseHolidayColumns } from '../../utils/columns'
import { CourseHoliday } from '../../types/courseDaysTypes'
import { createCourseHoliday, updateCourseHoliday, deleteCourseHoliday } from '../../app/actions/courseDaysActions'
import { TableToolbar } from './TableToolbar'

// SVG icon components for actions (edit, save, delete, cancel, add)
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

export function CourseHolidayTable({ holidays, courseId }: { holidays: CourseHoliday[], courseId: string }) {
  // State for search/filter, editing
  const [query, setQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ title: string; date: string }>({ title: '', date: '' })

  // Load search and filter state from localStorage on mount
  useEffect(() => {
    setQuery(localStorage.getItem('courseHolidayQuery') || '')
    setDateFilter(localStorage.getItem('courseHolidayDateFilter') || '')
  }, [])

  // Persist search and filter state to localStorage
  useEffect(() => {
    localStorage.setItem('courseHolidayQuery', query)
  }, [query])
  useEffect(() => {
    localStorage.setItem('courseHolidayDateFilter', dateFilter)
  }, [dateFilter])

  // Filter and sort holidays by search and date
  const filtered = holidays
    .filter(h =>
      (h.title.toLowerCase().includes(query.toLowerCase()) ||
        h.date.toLowerCase().includes(query.toLowerCase())) &&
      (dateFilter === '' || h.date.slice(0, 10) === dateFilter)
    )
    .sort((a, b) => b.date.localeCompare(a.date))

  // Start editing a row
  function handleEdit(id: string, title: string, date: string) {
    setEditId(id)
    setEditValues({ title, date: date.slice(0, 10) })
  }

  // Cancel editing
  function handleCancel() {
    setEditId(null)
    setEditValues({ title: '', date: '' })
  }

  // Handle input changes in edit mode
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditValues({ ...editValues, [e.target.name]: e.target.value })
  }

  return (
    <div className="mt-10 mb-10">
      {/* Toolbar for search and date filter */}
      <TableToolbar
        onSearch={setQuery}
        dateFilter={dateFilter}
        onDateFilter={setDateFilter}
        searchPlaceholder="Kurs-Feiertag suchen…"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300 rounded-lg bg-white shadow-sm">
          <colgroup>
            <col style={{ width: '40%' }} />
            <col style={{ width: '40%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <thead>
            <tr>
              {/* Render table headers from courseHolidayColumns */}
              {courseHolidayColumns.map((col, idx) => (
                <th
                  key={col.key}
                  className={`py-2 px-2 font-medium text-white border-b border-gray-200 bg-gray-600 text-left${idx < courseHolidayColumns.length - 1 ? ' border-r border-gray-200' : ''}`}
                >
                  {col.label}
                </th>
              ))}
              <th className="py-2 px-2 font-medium text-white border-b bg-gray-600 text-center border-l border-gray-200">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Row for adding a new holiday */}
            <tr className="bg-white">
              <td className="py-1 px-1 align-middle border-r border-gray-200">
                <input
                  name="title"
                  form="add-course-holiday-form"
                  placeholder="Neuer Kurs-Feiertag"
                  className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                  required
                />
              </td>
              <td className="py-1 px-1 align-middle border-r border-gray-200">
                <input
                  name="date"
                  form="add-course-holiday-form"
                  type="date"
                  placeholder="Datum"
                  className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer"
                  required
                />
                <input type="hidden" name="courseId" form="add-course-holiday-form" value={courseId} />
              </td>
              <td className="py-1 px-1 align-middle text-center">
                <form action={createCourseHoliday} id="add-course-holiday-form">
                  <button
                    type="submit"
                    className="mx-auto block p-0.5 text-gray-400 hover:text-green-600 rounded transition cursor-pointer"
                    title="Hinzufügen"
                  >
                    <IconAdd />
                  </button>
                </form>
              </td>
            </tr>
            {/* Render each holiday row, editable if in edit mode */}
            {filtered.map(h => (
              <tr key={h.id} className="border-b border-t border-gray-200 hover:bg-gray-50 transition">
                {editId === h.id ? (
                  // Edit mode: show input fields and save/cancel/delete actions
                  <>
                    <td className="py-1 px-1 align-middle border-r border-gray-200">
                      <input
                        name="title"
                        value={editValues.title}
                        onChange={handleChange}
                        className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer"
                      />
                    </td>
                    <td className="py-1 px-1 align-middle border-r border-gray-200">
                      <input
                        name="date"
                        type="date"
                        value={editValues.date}
                        onChange={handleChange}
                        className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer"
                      />
                      <input type="hidden" name="courseId" value={courseId} />
                    </td>
                    <td className="py-1 px-1 align-middle text-center flex gap-1 justify-center">
                      {/* Save changes */}
                      <form
                        action={updateCourseHoliday}
                        onSubmit={handleCancel}
                        className="inline-flex items-center gap-0.5"
                      >
                        <input type="hidden" name="id" value={h.id} />
                        <input type="hidden" name="title" value={editValues.title} />
                        <input type="hidden" name="date" value={editValues.date} />
                        <input type="hidden" name="courseId" value={courseId} />
                        <button
                          type="submit"
                          className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition cursor-pointer"
                          title="Speichern"
                        >
                          <IconSave />
                        </button>
                      </form>
                      {/* Cancel editing */}
                      <button
                        type="button"
                        className="p-0.5 text-gray-400 hover:text-orange-500 rounded transition cursor-pointer"
                        title="Abbrechen"
                        onClick={handleCancel}
                      >
                        <IconCancel />
                      </button>
                      {/* Delete holiday */}
                      <form action={deleteCourseHoliday} className="inline-flex items-center justify-center gap-0.5">
                        <input type="hidden" name="id" value={h.id} />
                        <input type="hidden" name="courseId" value={courseId} />
                        <button
                          type="submit"
                          className="p-0.5 text-gray-400 hover:text-red-500 rounded transition cursor-pointer"
                          title="Löschen"
                        >
                          <IconTrash />
                        </button>
                      </form>
                    </td>
                  </>
                ) : (
                  // Read-only mode: show values and edit/delete actions
                  <>
                    <td className="py-1 px-1 align-middle border-r border-gray-200">
                      <input
                        name="title"
                        value={h.title}
                        readOnly
                        className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                      />
                    </td>
                    <td className="py-1 px-1 align-middle border-r border-gray-200">
                      <input
                        name="date"
                        type="date"
                        value={h.date.slice(0, 10)}
                        readOnly
                        className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                      />
                      <input type="hidden" name="courseId" value={courseId} />
                    </td>
                    <td className="py-1 px-1 align-middle text-center flex gap-1 justify-center">
                      {/* Edit holiday */}
                      <button
                        type="button"
                        className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition cursor-pointer"
                        title="Bearbeiten"
                        onClick={() => handleEdit(h.id, h.title, h.date)}
                      >
                        <IconEdit />
                      </button>
                      {/* Delete holiday */}
                      <form action={deleteCourseHoliday} className="inline-flex items-center justify-center gap-0.5">
                        <input type="hidden" name="id" value={h.id} />
                        <input type="hidden" name="courseId" value={courseId} />
                        <button
                          type="submit"
                          className="p-0.5 text-gray-400 hover:text-red-500 rounded transition cursor-pointer"
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