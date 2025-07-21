'use client'
import { CourseHolidayTable } from './CourseHolidayTable'
import { CourseSpecialDaysTable } from './CourseSpecialDaysTable'
import { CourseRythmTable } from './CourseRythmTable'
import { CourseDaysTable } from './CourseDaysTable'
import { CourseHoliday, CourseSpecialDays, CourseRythm } from '../../app/coursedays/types'
import { CourseDay } from './CourseDaysTable'

type Props = {
  holidays: CourseHoliday[]
  specialDays: CourseSpecialDays[]
  rythms: CourseRythm[]
  courseDays: CourseDay[]
  courseId: string
  globalHolidayTitles: string[] 
}

export function CourseTablesClient({
  holidays,
  specialDays,
  rythms,
  courseDays,
  courseId,
  globalHolidayTitles,
}: Props) {
  const courseHolidayTitles = holidays.map(h => h.title)
  return (
    <div className="flex flex-col gap-8">
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
        <h2 className="text-lg font-semibold mb-6 text-gray-800 tracking-tight">Kurs-Feiertage</h2>
        <CourseHolidayTable holidays={holidays} courseId={courseId} />
      </section>
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
        <h2 className="text-lg font-semibold mb-6 text-gray-800 tracking-tight">Besondere Kurstage</h2>
        <CourseSpecialDaysTable specialDays={specialDays} courseId={courseId} />
      </section>
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
        <h2 className="text-lg font-semibold mb-6 text-gray-800 tracking-tight">Kurs-Rhythmus</h2>
        <CourseRythmTable rythms={rythms} courseId={courseId} />
      </section>
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
        <h2 className="text-lg font-semibold mb-6 text-gray-800 tracking-tight">Generierte Kurstage</h2>
        <CourseDaysTable
          courseDays={courseDays}
          globalHolidayTitles={globalHolidayTitles}
          courseHolidayTitles={courseHolidayTitles}
        />
      </section>
    </div>
  )
}