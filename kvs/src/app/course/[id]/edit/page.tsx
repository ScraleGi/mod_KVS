import { redirect } from 'next/navigation';
import EditCourseForm from '@/components/course/EditCourseForm';
import Link from 'next/link';
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize';
import { CourseWithEditRelations } from '@/types/query-models';
import { formatDateISO } from '@/lib/utils';
import RemoveButton from '@/components/RemoveButton/RemoveButton';
import { getAuthorizing } from '@/lib/getAuthorizing';


/**
 * Course Edit Page - Allows editing of course details
 */
  export default async function EditCoursePage({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    // Check user authorization
  const roles = await getAuthorizing({
    privilige: ['ADMIN', 'PROGRAMMMANAGER'],
  })
  if (roles.length === 0) {
    redirect('/403')
  }
  const { id } = await params

  // Fetch course and all available trainers in parallel
  const [course, trainers] = await Promise.all([
    db.course.findUnique({
      where: { id },
      include: {
        program: true,
        mainTrainer: true,
        trainers: true,
      },
    }),
    db.trainer.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  // Sanitize course to remove Decimal objects
  const sanitizedCourse = course ? sanitize<typeof course, CourseWithEditRelations>(course) : null

  // Create a new object with properly formatted dates for the form
  const formattedCourse = sanitizedCourse ? {
    ...sanitizedCourse,
    startDate: formatDateISO(sanitizedCourse.startDate),
    endDate: formatDateISO(sanitizedCourse.endDate)
  } : null;

  /**
   * Server action to update course details
   */
  const changeCourse = async (formData: FormData) => {
    'use server'
    const id = formData.get('id') as string
    const code = formData.get('code') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const mainTrainerId = formData.get('mainTrainerId') as string
    const trainerIds = formData.getAll('trainerIds') as string[]
    

    // Exclude main trainer from additional trainers list
    const filteredTrainerIds = trainerIds.filter(tid => tid !== mainTrainerId)

    await db.course.update({
      where: { id },
      data: {
        code,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        mainTrainer: { connect: { id: mainTrainerId } },
        trainers: {
          set: filteredTrainerIds.map(id => ({ id })),
        },
      },
    })
    redirect(`/course/${id}?edited=1`)
  }

  /**
   * Server action to soft delete a course
   */
  async function deleteCourse(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await db.course.update({
      where: { id },
      data: { deletedAt: new Date() }
    })
    redirect('/course/deleted?deleted=1')
  }

  // Show error if course not found
  if (!formattedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">Keine Kurse gefunden.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <nav className='mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2'>
          <Link href="/course" className="hover:underline text-gray-700">
            Kursübersicht
          </Link>
          <span>&gt;</span>
          <Link href={`/course/${id}`} className="hover:underline text-gray-700">
            {course?.program?.name ?? 'Kurs'}
          </Link>
          <span>&gt;</span>
          <span className='text-gray-700 font-semibold'>
            Kurs bearbeiten
          </span>
        </nav>
        <div className="bg-white rounded-sm shadow border border-gray-100">
          <div className="px-6 py-8">
            <h1 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
              Kurs bearbeiten
            </h1>
            <EditCourseForm
              id={id}
              course={formattedCourse}
              trainers={trainers}
              onSubmit={changeCourse}
            />
          </div>

          {/* Danger Zone Section */}
          <div className="border-t border-gray-200"></div>
          <div className="px-6 py-4 bg-gray-50 rounded-b-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Archiv</h3>
                <p className="text-xs text-gray-500 mt-1">In Ablage verwahren.</p>
              </div>
              <RemoveButton
                itemId={id}
                onRemove={deleteCourse}
                title="Kurs löschen"
                message="Sind Sie sicher, dass Sie diesen Kurs sanft löschen möchten? Dadurch werden auch alle zugehörigen Registrierungen entfernt."
                fieldName="id"
                customButton={
                  <button
                    type="submit"
                    className="px-3 py-1.5 cursor-pointer bg-white border border-red-300 rounded text-sm text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-30"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      Archivieren
                    </div>
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}