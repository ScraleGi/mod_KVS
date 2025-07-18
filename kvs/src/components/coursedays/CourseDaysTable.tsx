'use client'
import React from 'react'

export type CourseDay = {
  id: string
  startTime: string
  endTime: string
  pauseDuration: string
  title?: string | null
}

type Props = {
  courseDays: CourseDay[]

}

export function CourseDaysTable({ courseDays }: Props) {
  if (courseDays.length === 0) {
    return <div className="text-gray-400 text-sm">Noch keine Kurstage generiert.</div>
  }
  return (
<table className="min-w-full border rounded">
  <thead>
    <tr className="bg-gray-100">
      <th className="px-2 py-1 text-left">Datum</th>
      <th className="px-2 py-1 text-left">Titel</th>
      <th className="px-2 py-1 text-left">Wochentag</th>
      <th className="px-2 py-1 text-left">Start</th>
      <th className="px-2 py-1 text-left">Ende</th>
      <th className="px-2 py-1 text-left">Pause</th>
    </tr>
  </thead>
  <tbody>
    {courseDays.map(day => (
      <tr key={day.id} className="border-t">
        <td className="px-2 py-1">
          {new Date(day.startTime).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </td>
        <td className="px-2 py-1">{day.title ?? 'Kurstag'}</td>
        <td className="px-2 py-1">
          {new Date(day.startTime).toLocaleDateString('de-DE', { weekday: 'long' })}
        </td>
        <td className="px-2 py-1">
          {new Date(day.startTime).toLocaleString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
        </td>
        <td className="px-2 py-1">
          {new Date(day.endTime).toLocaleString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
        </td>
        <td className="px-2 py-1">
          {new Date(day.pauseDuration).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
        </td>
      </tr>
    ))}
  </tbody>
</table>
  )
}