import { getCourseHolidays, getCourseSpecialDays, getCourseRythms } from '../actions'
import { CourseHolidayTable } from '../components/CourseHolidayTable'
import { CourseSpecialDaysTable } from '../components/CourseSpecialDaysTable'
import { CourseRythmTable } from '../components/CourseRythmTable'
import { formatDateISO } from '../../../lib/utils'

export default async function CourseDaysPage({ params }: { params: { id: string } }) {
  const [holidaysRaw, specialDaysRaw, rythmsRaw] = await Promise.all([
    getCourseHolidays(params.id),
    getCourseSpecialDays(params.id),
    getCourseRythms(params.id),
  ])

  const holidays = holidaysRaw.map(h => ({
    ...h,
    date: formatDateISO(h.date),
    createdAt: formatDateISO(h.createdAt),
    deletedAt: h.deletedAt ? formatDateISO(h.deletedAt) : null,
  }))

  const specialDays = specialDaysRaw.map(d => ({
    ...d,
    startTime: formatDateISO(d.startTime),
    endTime: formatDateISO(d.endTime),
    pauseDuration: formatDateISO(d.pauseDuration),
    createdAt: formatDateISO(d.createdAt),
    deletedAt: d.deletedAt ? formatDateISO(d.deletedAt) : null,
  }))

  const rythms = rythmsRaw.map(r => ({
    ...r,
    startTime: formatDateISO(r.startTime),
    endTime: formatDateISO(r.endTime),
    pauseDuration: formatDateISO(r.pauseDuration),
    createdAt: formatDateISO(r.createdAt),
    deletedAt: r.deletedAt ? formatDateISO(r.deletedAt) : null,
  }))

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Kurstermine verwalten</h1>
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Kurs-Feiertage</h2>
        <CourseHolidayTable holidays={holidays} courseId={params.id} />
      </section>
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Spezielle Kurstage</h2>
        <CourseSpecialDaysTable specialDays={specialDays} courseId={params.id} />
      </section>
      <section>
        <h2 className="font-semibold mb-2">Kurs-Rhythmus</h2>
        <CourseRythmTable rythms={rythms} courseId={params.id} />
      </section>
    </main>
  )
}