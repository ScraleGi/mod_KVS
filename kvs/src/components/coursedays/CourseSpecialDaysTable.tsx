'use client'
import React, { useState, useEffect } from 'react'
import { courseSpecialDaysColumns } from '../../app/coursedays/columns'
import { CourseSpecialDays } from '../../app/coursedays/types'
import { createCourseSpecialDay, updateCourseSpecialDay, deleteCourseSpecialDay } from '../../app/coursedays/actions'
import { TableToolbar } from './TableToolbar'

// Helper for date/time formatting in Europe/Berlin timezone, no seconds
function formatDateTimeBerlin(dateString: string) {
  if (!dateString) return '--:--'
  const localString = dateString.replace('Z', '')
  const date = new Date(localString)
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ', ' + date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatPauseBerlin(dateString: string) {
  if (!dateString) return '--:--'
  const date = new Date(dateString)
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

function toLocalDateTimeInputValue(isoString: string) {
  if (!isoString) return ''
  const localString = isoString.replace('Z', '')
  const date = new Date(localString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

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

export function CourseSpecialDaysTable({ specialDays, courseId }: { specialDays: CourseSpecialDays[], courseId: string }) {
  const [query, setQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{
    id: string
    title: string
    startTime: string
    endTime: string
    pauseDuration: string
    courseId: string
  } | null>(null)

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

  const filtered = specialDays.filter(d =>
    (dateFilter === '' || d.startTime.slice(0, 10) === dateFilter) &&
    (query === '' || (d.title ?? '').toLowerCase().includes(query.toLowerCase()))
  )

  function handleEdit(d: CourseSpecialDays) {
    setEditId(d.id)
    setEditValues({
      id: d.id,
      title: d.title ?? '',
      startTime: toLocalDateTimeInputValue(d.startTime),
      endTime: toLocalDateTimeInputValue(d.endTime),
      pauseDuration: d.pauseDuration.length === 5 ? d.pauseDuration : d.pauseDuration.slice(11, 16),
      courseId: d.courseId
    })
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
        searchPlaceholder="Sondertag suchen…"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300 rounded-lg bg-white shadow-sm">
          <thead>
            <tr>
              {courseSpecialDaysColumns.map((col, idx) => (
                <th
                  key={col.key}
                  className={`py-2 px-2 font-medium text-white border-b border-gray-200 bg-gray-600 text-left${idx < courseSpecialDaysColumns.length - 1 ? ' border-r border-gray-200' : ''}`}
                >
                  {col.label}
                </th>
              ))}
              <th className="py-2 px-2 font-medium text-white border-b bg-gray-600 text-center border-l border-gray-200">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {/* Add new special day row */}
            <tr className="bg-white border-b border-gray-200">
              <td className="py-1 px-1 align-middle border-r border-gray-200">
                <input name="title" form="add-course-specialday-form" placeholder="Neuer Sondertag" className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" />
              </td>
              <td className="py-1 px-1 align-middle border-r border-gray-200">
                <input name="startTime" form="add-course-specialday-form" type="datetime-local" className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer" required />
              </td>
              <td className="py-1 px-1 align-middle border-r border-gray-200">
                <input name="endTime" form="add-course-specialday-form" type="datetime-local" className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer" required />
              </td>
              <td className="py-1 px-1 align-middle border-r border-gray-200">
                <input name="pauseDuration" form="add-course-specialday-form" type="time" className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer" required />
                <input type="hidden" name="courseId" form="add-course-specialday-form" value={courseId} />
              </td>
              <td className="py-1 px-1 align-middle text-center">
                <form action={createCourseSpecialDay} id="add-course-specialday-form">
                  <button type="submit" className="mx-auto block p-0.5 text-gray-400 hover:text-green-600 rounded transition cursor-pointer" title="Hinzufügen"><IconAdd /></button>
                </form>
              </td>
            </tr>
            {filtered.map(d => (
              <tr key={d.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                {editId === d.id && editValues ? (
                  <>
                    <td className="py-1 px-1 align-middle border-r border-gray-200">
                      <input name="title" value={editValues.title} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer" />
                    </td>
                    <td className="py-1 px-1 align-middle border-r border-gray-200">
                      <input name="startTime" type="datetime-local" value={editValues.startTime} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer" />
                    </td>
                    <td className="py-1 px-1 align-middle border-r border-gray-200">
                      <input name="endTime" type="datetime-local" value={editValues.endTime} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer" />
                    </td>
                    <td className="py-1 px-1 align-middle border-r border-gray-200">
                      <input
                        name="pauseDuration"
                        type="time"
                        value={editValues.pauseDuration}
                        onChange={handleChange}
                        className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer"
                      />
                      <input type="hidden" name="courseId" value={courseId} />
                    </td>
                    <td className="py-1 px-1 align-middle text-center flex gap-1 justify-center">
                      <form action={updateCourseSpecialDay} onSubmit={handleCancel} className="inline-flex items-center gap-0.5">
                        <input type="hidden" name="id" value={editValues.id} />
                        <input type="hidden" name="title" value={editValues.title} />
                        <input type="hidden" name="startTime" value={editValues.startTime} />
                        <input type="hidden" name="endTime" value={editValues.endTime} />
                        <input type="hidden" name="pauseDuration" value={editValues.pauseDuration} />
                        <input type="hidden" name="courseId" value={courseId} />
                        <button type="submit" className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition cursor-pointer" title="Speichern">
                          <IconSave />
                        </button>
                      </form>
                      <button type="button" className="p-0.5 text-gray-400 hover:text-orange-500 rounded transition cursor-pointer" title="Abbrechen" onClick={handleCancel}><IconCancel /></button>
                      <form action={deleteCourseSpecialDay} className="inline-flex items-center justify-center gap-0.5">
                        <input type="hidden" name="id" value={editValues.id} />
                        <input type="hidden" name="courseId" value={courseId} />
                        <button type="submit" className="p-0.5 text-gray-400 hover:text-red-500 rounded transition cursor-pointer" title="Löschen"><IconTrash /></button>
                      </form>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-1 px-1 align-middle border-r border-gray-200">
                      <input
                        name="title"
                        value={d.title ?? ''}
                        readOnly
                        className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none"
                      />
                    </td>
                    <td className="py-1 px-1 align-middle border-r border-gray-200">{formatDateTimeBerlin(d.startTime)}</td>
                    <td className="py-1 px-1 align-middle border-r border-gray-200">{formatDateTimeBerlin(d.endTime)}</td>
                    <td className="py-1 px-1 align-middle border-r border-gray-200">
                      {d.pauseDuration ? formatPauseBerlin(d.pauseDuration) : '--:--'}
                      <input type="hidden" name="courseId" value={courseId} />
                    </td>
                    <td className="py-1 px-1 align-middle text-center flex gap-1 justify-center">
                      <button type="button" className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition cursor-pointer" title="Bearbeiten" onClick={() => handleEdit(d)}><IconEdit /></button>
                      <form action={deleteCourseSpecialDay} className="inline-flex items-center justify-center gap-0.5">
                        <input type="hidden" name="id" value={d.id} />
                        <input type="hidden" name="courseId" value={courseId} />
                        <button type="submit" className="p-0.5 text-gray-400 hover:text-red-500 rounded transition cursor-pointer" title="Löschen"><IconTrash /></button>
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