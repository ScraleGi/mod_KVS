'use client'
import React, { useState, useEffect } from 'react'
import { courseRythmColumns } from '../columns'
import { CourseRythm } from '../types'
import { createCourseRythm, updateCourseRythm, deleteCourseRythm } from '../actions'
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

export function CourseRythmTable({ rythms, courseId }: { rythms: CourseRythm[], courseId: string }) {
  const [query, setQuery] = useState('')
  const [weekDayFilter, setWeekDayFilter] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<CourseRythm | null>(null)

  useEffect(() => {
    setQuery(localStorage.getItem('courseRythmQuery') || '')
    setWeekDayFilter(localStorage.getItem('courseRythmWeekDay') || '')
  }, [])

  useEffect(() => {
    localStorage.setItem('courseRythmQuery', query)
  }, [query])
  useEffect(() => {
    localStorage.setItem('courseRythmWeekDay', weekDayFilter)
  }, [weekDayFilter])

  const filtered = rythms
    .filter(r =>
      r.title.toLowerCase().includes(query.toLowerCase()) &&
      (weekDayFilter === '' || r.weekDay === weekDayFilter)
    )

  function handleEdit(r: CourseRythm) {
    setEditId(r.id)
    setEditValues(r)
  }

  function handleCancel() {
    setEditId(null)
    setEditValues(null)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    if (!editValues) return
    setEditValues({ ...editValues, [e.target.name]: e.target.value })
  }

  return (
    <div className="mt-10 mb-10">
      <TableToolbar
        onSearch={setQuery}
        weekDayFilter={weekDayFilter}
        onWeekDayFilter={setWeekDayFilter}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300 rounded-lg bg-white shadow-sm">
          <thead>
            <tr>
              {courseRythmColumns.map(col => (
                <th key={col.key} className="py-2 px-2 font-medium text-gray-500 border-b border-gray-200 bg-white text-left">{col.label}</th>
              ))}
              <th className="py-2 px-2 font-medium text-gray-500 border-b bg-white text-center border-l border-gray-200">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="py-1 px-1 align-middle">
                <form action={createCourseRythm} className="flex gap-2 items-center">
                  <input name="title" placeholder="Titel" className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" required />
                  <select name="weekDay" className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" required>
                    <option value="">Wochentag</option>
                    <option value="MONDAY">Montag</option>
                    <option value="TUESDAY">Dienstag</option>
                    <option value="WEDNESDAY">Mittwoch</option>
                    <option value="THURSDAY">Donnerstag</option>
                    <option value="FRIDAY">Freitag</option>
                    <option value="SATURDAY">Samstag</option>
                    <option value="SUNDAY">Sonntag</option>
                  </select>
                  <input name="startTime" type="time" className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" required />
                  <input name="endTime" type="time" className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" required />
                  <input name="pauseDuration" type="time" className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" required />
                  <input type="hidden" name="courseId" value={courseId} />
                  <button type="submit" className="mx-auto block p-0.5 text-gray-400 hover:text-green-600 rounded transition" title="Hinzufügen"><IconAdd /></button>
                </form>
              </td>
            </tr>
            {filtered.map(r => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                {editId === r.id && editValues ? (
                  <>
                    <td className="py-1 px-1 align-middle">
                      <form action={updateCourseRythm} className="flex gap-2 items-center" onSubmit={handleCancel}>
                        <input name="title" value={editValues.title} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" required />
                        <select name="weekDay" value={editValues.weekDay} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" required>
                          <option value="MONDAY">Montag</option>
                          <option value="TUESDAY">Dienstag</option>
                          <option value="WEDNESDAY">Mittwoch</option>
                          <option value="THURSDAY">Donnerstag</option>
                          <option value="FRIDAY">Freitag</option>
                          <option value="SATURDAY">Samstag</option>
                          <option value="SUNDAY">Sonntag</option>
                        </select>
                        <input name="startTime" type="time" value={editValues.startTime.slice(11, 16)} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" required />
                        <input name="endTime" type="time" value={editValues.endTime.slice(11, 16)} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" required />
                        <input name="pauseDuration" type="time" value={editValues.pauseDuration.slice(11, 16)} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" required />
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="courseId" value={courseId} />
                        <button type="submit" className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition" title="Speichern"><IconEdit /></button>
                        <button type="button" className="p-0.5 text-gray-400 hover:text-orange-500 rounded transition" title="Abbrechen" onClick={handleCancel}><IconCancel /></button>
                        <form action={deleteCourseRythm} className="inline-flex items-center justify-center gap-0.5">
                          <input type="hidden" name="id" value={r.id} />
                          <input type="hidden" name="courseId" value={courseId} />
                          <button type="submit" className="p-0.5 text-gray-400 hover:text-red-500 rounded transition" title="Löschen"><IconTrash /></button>
                        </form>
                      </form>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-1 px-1 align-middle">
                      <div className="flex gap-2 items-center">
                        <input name="title" value={r.title} readOnly className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" onFocus={() => handleEdit(r)} />
                        <select name="weekDay" value={r.weekDay} disabled className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none">
                          <option value="MONDAY">Montag</option>
                          <option value="TUESDAY">Dienstag</option>
                          <option value="WEDNESDAY">Mittwoch</option>
                          <option value="THURSDAY">Donnerstag</option>
                          <option value="FRIDAY">Freitag</option>
                          <option value="SATURDAY">Samstag</option>
                          <option value="SUNDAY">Sonntag</option>
                        </select>
                        <input name="startTime" type="time" value={r.startTime.slice(11, 16)} readOnly className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" onFocus={() => handleEdit(r)} />
                        <input name="endTime" type="time" value={r.endTime.slice(11, 16)} readOnly className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" onFocus={() => handleEdit(r)} />
                        <input name="pauseDuration" type="time" value={r.pauseDuration.slice(11, 16)} readOnly className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none" onFocus={() => handleEdit(r)} />
                        <button type="button" className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition" title="Bearbeiten" onClick={() => handleEdit(r)}><IconEdit /></button>
                        <form action={deleteCourseRythm} className="inline-flex items-center justify-center gap-0.5">
                          <input type="hidden" name="id" value={r.id} />
                          <input type="hidden" name="courseId" value={courseId} />
                          <button type="submit" className="p-0.5 text-gray-400 hover:text-red-500 rounded transition" title="Löschen"><IconTrash /></button>
                        </form>
                      </div>
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