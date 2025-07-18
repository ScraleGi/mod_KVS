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
}

export function CourseTablesClient({ holidays, specialDays, rythms, courseDays, courseId }: Props) {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-semibold mb-4">Kurs-Feiertage</h2>
        <CourseHolidayTable holidays={holidays} courseId={courseId} />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Besondere Kurstage</h2>
        <CourseSpecialDaysTable specialDays={specialDays} courseId={courseId} />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Kurs-Rhythmus</h2>
        <CourseRythmTable rythms={rythms} courseId={courseId} />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Generierte Kurstage</h2>
        <CourseDaysTable courseDays={courseDays}/>
      </section>
    </div>
  )
}