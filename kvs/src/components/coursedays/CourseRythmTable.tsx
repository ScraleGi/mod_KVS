'use client'
import React, { useState } from 'react'
import { CourseRythm } from '../../types/courseDaysTypes'
import { createCourseRythm, updateCourseRythm, deleteCourseRythm } from '../../app/actions/courseDaysActions'
import { TableToolbar } from './TableToolbar'

// List of week days for dropdowns and display
const WEEK_DAYS = [
  { key: 'MONDAY', label: 'Montag' },
  { key: 'TUESDAY', label: 'Dienstag' },
  { key: 'WEDNESDAY', label: 'Mittwoch' },
  { key: 'THURSDAY', label: 'Donnerstag' },
  { key: 'FRIDAY', label: 'Freitag' },
  { key: 'SATURDAY', label: 'Samstag' },
  { key: 'SUNDAY', label: 'Sonntag' },
]

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

// Helper to check if endTime is after startTime (both "HH:mm")
function isEndTimeAfterStartTime(startTime: string, endTime: string) {
  if (!startTime || !endTime) return false
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  return endH > startH || (endH === startH && endM > startM)
}

export function CourseRythmTable({ rythms, courseId }: { rythms: CourseRythm[], courseId: string }) {
  // State for editing an existing row
  const [editId, setEditId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ startTime: string, endTime: string, pauseDuration: string, weekDay: string } | null>(null)
  const [editError, setEditError] = useState<string | null>(null)

  // State for adding a new row
  const [newValues, setNewValues] = useState<{ weekDay: string, startTime: string, endTime: string, pauseDuration: string }>({
    weekDay: '',
    startTime: '',
    endTime: '',
    pauseDuration: ''
  })
  const [addError, setAddError] = useState<string | null>(null)

  // Used and available week days for the dropdown (to prevent duplicates)
  const usedWeekDays = rythms.map(r => r.weekDay)
  const availableWeekDays = WEEK_DAYS.filter(day => !usedWeekDays.includes(day.key))

  // Start editing a row
  function handleEdit(r: CourseRythm) {
    setEditId(r.id)
    setEditValues({
      startTime: r.startTime.slice(11, 16),
      endTime: r.endTime.slice(11, 16),
      pauseDuration: r.pauseDuration.slice(11, 16),
      weekDay: r.weekDay
    })
    setEditError(null)
  }

  // Cancel editing
  function handleCancel() {
    setEditId(null)
    setEditValues(null)
    setEditError(null)
  }

  // Handle input changes in edit mode
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    if (!editValues) return
    const { name, value } = e.target
    const updated = { ...editValues, [name]: value }
    setEditValues(updated)
    // Validate endTime
    if (name === 'startTime' || name === 'endTime') {
      if (updated.startTime && updated.endTime && !isEndTimeAfterStartTime(updated.startTime, updated.endTime)) {
        setEditError('Ende darf nicht vor Beginn liegen!')
      } else {
        setEditError(null)
      }
    }
  }

  // Handle input changes in add mode
  function handleNewChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    const updated = { ...newValues, [name]: value }
    setNewValues(updated)
    // Validate endTime
    if ((name === 'startTime' || name === 'endTime') && updated.startTime && updated.endTime) {
      if (!isEndTimeAfterStartTime(updated.startTime, updated.endTime)) {
        setAddError('Ende darf nicht vor Beginn liegen!')
      } else {
        setAddError(null)
      }
    }
  }

  // Validate and handle add form submit
  function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!newValues.weekDay || !newValues.startTime || !newValues.endTime || !newValues.pauseDuration) {
      e.preventDefault()
      setAddError('Bitte alle Felder ausfüllen.')
      return
    }
    if (!isEndTimeAfterStartTime(newValues.startTime, newValues.endTime)) {
      e.preventDefault()
      setAddError('Ende darf nicht vor Beginn liegen!')
      return
    }
    setAddError(null)
    // Reset add form after submit
    setTimeout(() => {
      setNewValues({ weekDay: '', startTime: '', endTime: '', pauseDuration: '' })
    }, 0)
  }

  // Validate and handle edit form submit
  function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!editValues || !editValues.startTime || !editValues.endTime || !editValues.pauseDuration) {
      e.preventDefault()
      setEditError('Bitte alle Felder ausfüllen.')
      return
    }
    if (!isEndTimeAfterStartTime(editValues.startTime, editValues.endTime)) {
      e.preventDefault()
      setEditError('Ende darf nicht vor Beginn liegen!')
      return
    }
    setEditError(null)
    // Reset edit state after submit
    setTimeout(() => {
      setEditId(null)
      setEditValues(null)
    }, 0)
  }

  // Reset state after delete
  function handleDelete() {
    setEditId(null)
    setEditValues(null)
    setTimeout(() => {
      setNewValues({ weekDay: '', startTime: '', endTime: '', pauseDuration: '' })
    }, 0)
  }

  return (
    <div className="mt-10 mb-10">
      {/* Toolbar for search and disabling used week days in dropdown */}
      <TableToolbar
        searchPlaceholder="Kurstag suchen…"
        disabledWeekDays={usedWeekDays}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300 rounded-lg bg-white shadow-sm">
          <thead>
            <tr>
              <th className="py-2 px-2 font-medium text-white border-b border-r border-gray-300 bg-gray-600 text-left">Wochentag</th>
              <th className="py-2 px-2 font-medium text-white border-b border-r border-gray-300 bg-gray-600 text-left">Beginn</th>
              <th className="py-2 px-2 font-medium text-white border-b border-r border-gray-300 bg-gray-600 text-left">Ende</th>
              <th className="py-2 px-2 font-medium text-white border-b border-r border-gray-300 bg-gray-600 text-left">Pause</th>
              <th className="py-2 px-2 font-medium text-white border-b bg-gray-600 text-center border-gray-300">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {/* Row for adding a new rythm */}
            <tr className="bg-white border-b border-gray-300">
              <td className="py-1 px-1 align-middle border-r border-gray-200">
                <select
                  name="weekDay"
                  value={newValues.weekDay}
                  onChange={handleNewChange}
                  className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer"
                  required
                >
                  <option value="">Wochentag wählen…</option>
                  {availableWeekDays.map(day => (
                    <option key={day.key} value={day.key}>{day.label}</option>
                  ))}
                </select>
              </td>
              <td className="py-1 px-1 align-middle border-r border-gray-200">
                <input name="startTime" type="time" value={newValues.startTime} onChange={handleNewChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer" required />
              </td>
              <td className="py-1 px-1 align-middle border-r border-gray-200">
                <input name="endTime" type="time" value={newValues.endTime} onChange={handleNewChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer" required />
                {addError && <div className="text-red-600 text-xs mt-1">{addError}</div>}
              </td>
              <td className="py-1 px-1 align-middle border-r border-gray-200">
                <input name="pauseDuration" type="time" value={newValues.pauseDuration} onChange={handleNewChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer" required />
              </td>
              <td className="py-1 px-1 align-middle text-center">
                <form action={createCourseRythm} className="inline-flex items-center gap-0.5" onSubmit={handleAddSubmit}>
                  <input type="hidden" name="weekDay" value={newValues.weekDay} />
                  <input type="hidden" name="startTime" value={newValues.startTime} />
                  <input type="hidden" name="endTime" value={newValues.endTime} />
                  <input type="hidden" name="pauseDuration" value={newValues.pauseDuration} />
                  <input type="hidden" name="courseId" value={courseId} />
                  <button type="submit" className="mx-auto block p-0.5 text-gray-400 hover:text-green-600 rounded transition cursor-pointer" title="Hinzufügen" disabled={!!addError}><IconAdd /></button>
                </form>
              </td>
            </tr>
            {/* Render each rythm row, editable if in edit mode */}
            {rythms.map(r => {
              const isEditing = editId === r.id && editValues
              const dayLabel = WEEK_DAYS.find(day => day.key === r.weekDay)?.label || r.weekDay
              return (
                <tr key={r.id} className="bg-white border-b border-gray-300 hover:bg-gray-50 transition">
                  <td className="py-1 px-1 align-middle border-r border-gray-200 font-medium">{dayLabel}</td>
                  {isEditing ? (
                    <>
                      <td className="py-1 px-1 align-middle border-r border-gray-200">
                        <input name="startTime" type="time" value={editValues!.startTime} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer" required />
                      </td>
                      <td className="py-1 px-1 align-middle border-r border-gray-200">
                        <input name="endTime" type="time" value={editValues!.endTime} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer" required />
                        {editError && <div className="text-red-600 text-xs mt-1">{editError}</div>}
                      </td>
                      <td className="py-1 px-1 align-middle border-r border-gray-200">
                        <input name="pauseDuration" type="time" value={editValues!.pauseDuration} onChange={handleChange} className="bg-transparent border-none px-0 py-1 text-gray-800 w-full focus:ring-0 focus:outline-none cursor-pointer" required />
                      </td>
                      <td className="py-1 px-1 align-middle text-center flex gap-1 justify-center">
                        {/* Save changes */}
                        <form
                          action={updateCourseRythm}
                          className="inline-flex items-center gap-0.5"
                          onSubmit={handleEditSubmit}
                        >
                          <input type="hidden" name="id" value={r.id} />
                          <input type="hidden" name="weekDay" value={editValues!.weekDay} />
                          <input type="hidden" name="startTime" value={editValues!.startTime} />
                          <input type="hidden" name="endTime" value={editValues!.endTime} />
                          <input type="hidden" name="pauseDuration" value={editValues!.pauseDuration} />
                          <input type="hidden" name="courseId" value={courseId} />
                          <button type="submit" className="p-0.5 text-gray-400 hover:text-green-600 rounded transition cursor-pointer" title="Speichern" disabled={!!editError}><IconSave /></button>
                        </form>
                        {/* Cancel editing */}
                        <button type="button" className="p-0.5 text-gray-400 hover:text-orange-500 rounded transition cursor-pointer" title="Abbrechen" onClick={handleCancel}><IconCancel /></button>
                        {/* Delete rythm */}
                        <form
                          action={deleteCourseRythm}
                          className="inline-flex items-center justify-center gap-0.5"
                          onSubmit={handleDelete}
                        >
                          <input type="hidden" name="id" value={r.id} />
                          <input type="hidden" name="courseId" value={courseId} />
                          <button type="submit" className="p-0.5 text-gray-400 hover:text-red-500 rounded transition cursor-pointer" title="Löschen"><IconTrash /></button>
                        </form>
                      </td>
                    </>
                  ) : (
                    // Read-only mode: show values and edit/delete actions
                    <>
                      <td className="py-1 px-1 align-middle border-r border-gray-200">{r.startTime ? r.startTime.slice(11, 16) : '--:--'}</td>
                      <td className="py-1 px-1 align-middle border-r border-gray-200">{r.endTime ? r.endTime.slice(11, 16) : '--:--'}</td>
                      <td className="py-1 px-1 align-middle border-r border-gray-200">{r.pauseDuration ? r.pauseDuration.slice(11, 16) : '--:--'}</td>
                      <td className="py-1 px-1 align-middle text-center flex gap-1 justify-center">
                        {/* Edit rythm */}
                        <button type="button" className="p-0.5 text-gray-400 hover:text-blue-600 rounded transition cursor-pointer" title="Bearbeiten" onClick={() => handleEdit(r)}><IconEdit /></button>
                        {/* Delete rythm */}
                        <form
                          action={deleteCourseRythm}
                          className="inline-flex items-center justify-center gap-0.5"
                          onSubmit={handleDelete}
                        >
                          <input type="hidden" name="id" value={r.id} />
                          <input type="hidden" name="courseId" value={courseId} />
                          <button type="submit" className="p-0.5 text-gray-400 hover:text-red-500 rounded transition cursor-pointer" title="Löschen"><IconTrash /></button>
                        </form>
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}