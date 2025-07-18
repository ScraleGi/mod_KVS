import { getCourseHolidays, getCourseSpecialDays, getCourseRythms } from '../../coursedays/actions'
import { db } from '@/src/../lib/db'
import { CourseTablesClient } from '../../../components/coursedays/CourseTablesClient'

function formatDateISO(date: Date | string | null | undefined) {
  if (!date) return ''
  // Prisma returns JS Date objects, so convert to ISO string
  if (typeof date === 'string') return date
  return date.toISOString()
}

export default async function CourseRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params

  const [course, holidaysRaw, specialDaysRaw, rythmsRaw] = await Promise.all([
    db.course.findUnique({
      where: { id: courseId },
      include: { program: true }
    }),
    getCourseHolidays(courseId),
    getCourseSpecialDays(courseId),
    getCourseRythms(courseId)
  ])

  const holidays = holidaysRaw.map(h => ({
    ...h,
    date: formatDateISO(h.date),
    createdAt: formatDateISO(h.createdAt),
    deletedAt: h.deletedAt ? formatDateISO(h.deletedAt) : null,
  }))
  const specialDays = specialDaysRaw.map(d => ({
    ...d,
    title: d.title ?? '',
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
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-200 flex flex-col items-center py-16 px-2">
      <div className="w-full max-w-5xl bg-white/80 rounded-xl shadow-lg p-8"> {/* changed max-w-3xl to max-w-5xl */}
        <h1 className="text-3xl font-bold mb-8 text-center">
          {course?.program?.name ?? 'Kurs'} ({course?.code})
        </h1>
        <CourseTablesClient
          holidays={holidays}
          specialDays={specialDays}
          rythms={rythms}
          courseId={courseId}
        />
      </div>
    </main>
  )
}