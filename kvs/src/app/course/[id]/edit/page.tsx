import { redirect } from 'next/navigation'
import EditCourseForm from '@/components/course/EditCourseForm'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { CourseWithEditRelations } from '@/types/query-models'
import { formatDateISO } from '@/lib/utils'

/**
 * Props interface for the edit course page
 */
interface EditCoursePageProps {
  params: {
    id: string
  }
}

/**
 * Course Edit Page - Allows editing of course details
 */
export default async function EditCoursePage({ params }: EditCoursePageProps) {
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
    redirect('/course')
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
    redirect('/course')
  }

  // Show error if course not found
  if (!formattedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">Course not found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-sm shadow border border-gray-100">
          <div className="px-6 py-8">
            <h1 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
              Edit Course
            </h1>
            <EditCourseForm
              id={id}
              course={formattedCourse}
              trainers={trainers}
              onSubmit={changeCourse}
            />
          </div>
        </div>
        {/* Soft Delete Form */}
        <form action={deleteCourse} className="mt-4 flex justify-end w-full">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="inline-flex items-center cursor-pointer text-sm text-red-600 hover:text-red-800 hover:bg-red-50 transition bg-transparent border-none p-0 font-normal pr-12"
            style={{ boxShadow: 'none' }}
            title="Soft delete this course"
            aria-label="Delete course"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c1.657 0 3.22.402 4.575 1.125M21.542 12c-1.274 4.057-5.065 7-9.542 7-1.657 0-3.22-.402-4.575-1.125M9.88 9.88l4.24 4.24" />
            </svg>
            Delete
          </button>
        </form>
      </div>
    </div>
  )
}