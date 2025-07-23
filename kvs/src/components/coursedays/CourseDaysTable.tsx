'use client'
import React from 'react'

// Type for a single course day row
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
  globalHolidayTitles: string[]
  courseHolidayTitles: string[]
}

// Parse an ISO date string (with or without Z/space) to a local Date object
function parseLocalDate(dateString: string) {
  if (!dateString) return new Date('')
  let localString = dateString.replace('Z', '').replace(/\.\d{3}$/, '')
  localString = localString.replace(' ', 'T')
  return new Date(localString)
}

// Parse pause duration from ISO string to minutes
function parsePauseDuration(pauseString: string) {
  // Assumes pauseString is an ISO string like "1970-01-01T00:30:00.000Z"
  const pauseDate = new Date(pauseString)
  return pauseDate.getUTCHours() * 60 + pauseDate.getUTCMinutes()
}

// Calculate course duration in minutes, subtracting pause
function calculateCourseDuration(start: Date, end: Date, pauseMinutes: number): number {
  const durationMs = end.getTime() - start.getTime()
  const durationMinutes = durationMs / (1000 * 60) - pauseMinutes
  return Math.max(0, Math.round(durationMinutes))
}

// Format minutes as "HH:mm"
function formatMinutesToHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function CourseDaysTable({
  courseDays,
  globalHolidayTitles = [],
  courseHolidayTitles = [],
}: Props) {
  // Show info if no course days
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
            <th className="px-3 py-2 text-left font-semibold text-gray-100">Dauer (h)</th>
          </tr>
        </thead>
        <tbody>
          {courseDays.map((day, idx) => {
            // Determine color class for title based on type of day
            let titleClass = "text-gray-500"
            if (!day.isCourseDay && day.title && globalHolidayTitles.includes(day.title)) {
              titleClass = "text-red-600 font-semibold" // global holiday
            } else if (!day.isCourseDay && day.title && courseHolidayTitles.includes(day.title)) {
              titleClass = "text-orange-500 font-semibold" // course holiday
            } else if (day.isCourseDay && day.title && day.title !== "Kurstag") {
              titleClass = "text-blue-500 font-semibold" // special course day
            }

            // Is this row a holiday?
            const isHoliday = !day.isCourseDay && day.title && (globalHolidayTitles.includes(day.title) || courseHolidayTitles.includes(day.title))

            // Parse times and calculate duration
            const start = parseLocalDate(day.startTime)
            const end = parseLocalDate(day.endTime)
            const pauseMinutes = parsePauseDuration(day.pauseDuration)
            const durationMinutes = calculateCourseDuration(start, end, pauseMinutes)

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
                  {start.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </td>
                <td className={`px-3 py-2 ${titleClass}`}>
                  {day.title ?? 'Kurstag'}
                </td>
                <td className="px-3 py-2 text-gray-500">
                  {start.toLocaleDateString('de-DE', { weekday: 'long' })}
                </td>
                <td className="px-3 py-2 text-gray-500">
                  {/* Show dash for holidays, otherwise show start time */}
                  {isHoliday ? '-' : <span className="font-mono">{start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>} {isHoliday ? '' : 'Uhr'}
                </td>
                <td className="px-3 py-2 text-gray-500">
                  {/* Show dash for holidays, otherwise show end time */}
                  {isHoliday ? '-' : <span className="font-mono">{end.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>} {isHoliday ? '' : 'Uhr'}
                </td>
                <td className="px-3 py-2 font-mono text-gray-500">
                  {/* Show dash for holidays, otherwise show pause */}
                  {isHoliday ? '-' : formatMinutesToHHMM(pauseMinutes)}
                </td>
                <td className="px-3 py-2 font-mono text-gray-500">
                  {/* Show dash for holidays, otherwise show duration */}
                  {isHoliday ? '-' : formatMinutesToHHMM(durationMinutes)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}