'use client'
import React from 'react'

export type CourseDay = {
  id: string
  startTime: string
  endTime: string
  pauseDuration: string
  title?: string | null
  isCourseDay: boolean
}

type Props = {
  courseDays: CourseDay[]
}

function parseLocalDate(dateString: string) {
  if (!dateString) return new Date('')
  let localString = dateString.replace('Z', '').replace(/\.\d{3}$/, '')
  localString = localString.replace(' ', 'T')
  return new Date(localString)
}

export function CourseDaysTable({ courseDays }: Props) {
  if (courseDays.length === 0) {
    return <div className="text-gray-400 text-sm">Noch keine Kurstage generiert.</div>
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-600 border-b border-gray-200">
            <th className="px-3 py-2 text-left font-semibold text-gray-100">Datum</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-100">Titel</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-100">Wochentag</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-100">Start</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-100">Ende</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-100">Pause</th>
          </tr>
        </thead>
        <tbody>
          {courseDays.map((day, idx) => {
            // Color logic for title
            let titleClass = "text-gray-500"
            if (!day.isCourseDay && day.title) {
              // Holiday: GlobalHoliday (red) or CourseHoliday (orange)
              // If the day was generated from the global holidays table, mark red
              // If from course holidays, mark orange
              // Since both have a title, you need to distinguish by source.
              // If you can't, default all holidays to orange, or pass a prop with globalHolidayTitles.
              titleClass = "text-orange-500 font-semibold"
            }
            if (!day.isCourseDay && day.title && day.title !== "" && day.title?.toLowerCase().includes("montag")) {
              // Example: Ostermontag, Pfingstmontag, etc. (assuming global holidays contain "montag" in title)
              titleClass = "text-red-600 font-semibold"
            }
            if (day.isCourseDay && day.title && day.title !== "Kurstag") {
              // CourseSpecialDay
              titleClass = "text-blue-600 font-semibold"
            }

            return (
              <tr
                key={day.id}
                className={
                  idx % 2 === 0
                    ? "bg-white border-b border-gray-100 hover:bg-blue-50 transition-colors"
                    : "bg-gray-50 border-b border-gray-100 hover:bg-blue-50 transition-colors"
                }
              >
                <td className="px-3 py-2 text-gray-900">
                  {parseLocalDate(day.startTime).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </td>
                <td className={`px-3 py-2 ${titleClass}`}>
                  {day.title ?? 'Kurstag'}
                </td>
                <td className="px-3 py-2 text-gray-500">
                  {parseLocalDate(day.startTime).toLocaleDateString('de-DE', { weekday: 'long' })}
                </td>
                <td className="px-3 py-2 text-gray-500">
                  <span className="font-mono">{parseLocalDate(day.startTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span> Uhr
                </td>
                <td className="px-3 py-2 text-gray-500">
                  <span className="font-mono">{parseLocalDate(day.endTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span> Uhr
                </td>
                <td className="px-3 py-2 font-mono text-gray-500">
                  {new Date(day.pauseDuration).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}