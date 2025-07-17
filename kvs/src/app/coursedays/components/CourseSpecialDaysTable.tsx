'use client'
import React, { useState, useEffect } from 'react'
import { courseSpecialDaysColumns } from '../columns'
import { CourseSpecialDays } from '../types'
import { createCourseSpecialDay, updateCourseSpecialDay, deleteCourseSpecialDay } from '../actions'
import { TableToolbar } from './TableToolbar'

// Helper for date/time formatting in Europe/Berlin timezone, no seconds
function formatDateTimeBerlin(dateString: string) {
  if (!dateString) return '--:--'
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    timeZone: 'Europe/Berlin',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ', ' + date.toLocaleTimeString('de-DE', {
    timeZone: 'Europe/Berlin',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Helper for pause duration (shows HH:mm)
function formatPauseBerlin(dateString: string) {
  if (!dateString) return '--:--'
  const date = new Date(dateString)
  // Always use UTC for pause duration
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

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

export function CourseSpecialDaysTable({ specialDays, courseId }: { specialDays: CourseSpecialDays[], courseId: string }) {
  const [query, setQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<CourseSpecialDays | null>(null)

  useEffect(() => {
    setQuery(localStorage.getItem('courseSpecialDaysQuery') || '')
    setDateFilter(localStorage.getItem('courseSpecialDaysDateFilter') || '')
  }, [])

  useEffect(() => {
    localStorage.setItem('courseSpecialDaysQuery', query)
  }, [query])

  useEffect(() => {
    localStorage.setItem('courseSpecialDaysDateFilter', dateFilter)
  }, [dateFilter])

  // Filter by date (YYYY-MM-DD)
  const filtered = specialDays.filter(d =>
    (dateFilter === '' || d.startTime.slice(0, 10) === dateFilter)
  )

  function handleEdit(d: CourseSpecialDays) {
    setEditId(d.id)
    setEditValues(d)
  }

  function handleCancel() {
    setEditId(null)
    setEditValues(null)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!editValues) return
    setEditValues({ ...editValues, [e.target.name]: e.target.value })
  }

  return (
    <div className="mt-10 mb-10">
      <TableToolbar
        onSearch={setQuery}
        dateFilter={dateFilter}
        onDateFilter={setDateFilter}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300 rounded-lg bg-white shadow-sm">
          <thead>
            <tr>
              {courseSpecialDaysColumns.map(col => (
                <th key={col.key} className="py-2 px-2 font-medium text-gray-500 border-b border-gray-200 bg-white text-left">{col.label}</th>
              ))}
              <th className="py-2 px-2 font-medium text-gray-500 border-b bg-white text-center border-l border-gray-200">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {/* Add new special day row */}
            <tr className="bg-white">
              <td className="py-1 px-1 align-middle">
                <input name="title" form="add-course-specialday-form" placeholder="Titel" className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" />
              </td>
              <td className="py-1 px-1 align-middle">
                <input name="startTime" form="add-course-specialday-form" type="datetime-local" className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" required />
              </td>
              <td className="py-1 px-1 align-middle">
                <input name="endTime" form="add-course-specialday-form" type="datetime-local" className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" required />
              </td>
              <td className="py-1 px-1 align-middle">
                <input name="pauseDuration" form="add-course-specialday-form" type="time" className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" required />
                <input type="hidden" name="courseId" form="add-course-specialday-form" value={courseId} />
              </td>
              <td className="py-1 px-1 align-middle text-center">
                <form action={createCourseSpecialDay} id="add-course-specialday-form">
                  <button type="submit" className="mx-auto block p-0.5 text-gray-400 hover:text-green-600 rounded transition" title="Hinzufügen"><IconAdd /></button>
                </form>
              </td>
            </tr>
            {filtered.map(d => (
              <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                {editId === d.id && editValues ? (
                  <>
                    <td className="py-1 px-1 align-middle">
                      <input name="title" value={editValues.title ?? ''} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" />
                    </td>
                    <td className="py-1 px-1 align-middle">
                      <input name="startTime" type="datetime-local" value={editValues.startTime.slice(0, 16)} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" />
                    </td>
                    <td className="py-1 px-1 align-middle">
                      <input name="endTime" type="datetime-local" value={editValues.endTime.slice(0, 16)} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" />
                    </td>
                    <td className="py-1 px-1 align-middle">
                      <input name="pauseDuration" type="time" value={editValues.pauseDuration.slice(11, 16)} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" />
                      <input type="hidden" name="courseId" value={courseId} />
                    </td>
                    <td className="py-1 px-1 align-middle text-center flex gap-1 justify-center">
                      <form action={updateCourseSpecialDay} onSubmit={handleCancel} className="inline-flex items-center gap-0.5">
                        <input type="hidden" name="id" value={d.id} />
                        <input type="hidden" name="title" value={editValues.title ?? ''} />
                        <input type="hidden" name="startTime" value={editValues.startTime} />
                        <input type="hidden" name="endTime" value={editValues.endTime} />
                        <input type="hidden" name="pauseDuration" value={editValues.pauseDuration} />
                        <input type="hidden" name="courseId" value={courseId} />
                        <button type="submit" className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition" title="Speichern"><IconEdit /></button>
                      </form>
                      <button type="button" className="p-0.5 text-gray-400 hover:text-orange-500 rounded transition" title="Abbrechen" onClick={handleCancel}><IconCancel /></button>
                      <form action={deleteCourseSpecialDay} className="inline-flex items-center justify-center gap-0.5">
                        <input type="hidden" name="id" value={d.id} />
                        <input type="hidden" name="courseId" value={courseId} />
                        <button type="submit" className="p-0.5 text-gray-400 hover:text-red-500 rounded transition" title="Löschen"><IconTrash /></button>
                      </form>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-1 px-1 align-middle">
                      <input
                        name="title"
                        value={d.title ?? ''}
                        readOnly
                        className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                        onFocus={() => handleEdit(d)}
                      />
                    </td>
                    <td className="py-1 px-1 align-middle">
                      {formatDateTimeBerlin(d.startTime)}
                    </td>
                    <td className="py-1 px-1 align-middle">
                      {formatDateTimeBerlin(d.endTime)}
                    </td>
                    <td className="py-1 px-1 align-middle">
                      {d.pauseDuration
                        ? formatPauseBerlin(d.pauseDuration)
                        : '--:--'}
                      <input type="hidden" name="courseId" value={courseId} />
                    </td>
                    <td className="py-1 px-1 align-middle text-center flex gap-1 justify-center">
                      <button type="button" className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition" title="Bearbeiten" onClick={() => handleEdit(d)}><IconEdit /></button>
                      <form action={deleteCourseSpecialDay} className="inline-flex items-center justify-center gap-0.5">
                        <input type="hidden" name="id" value={d.id} />
                        <input type="hidden" name="courseId" value={courseId} />
                        <button type="submit" className="p-0.5 text-gray-400 hover:text-red-500 rounded transition" title="Löschen"><IconTrash /></button>
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