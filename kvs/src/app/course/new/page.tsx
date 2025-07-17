
import { redirect } from 'next/navigation'
import CreateCourseForm from '@/components/course/CreateCourseForm'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { Program, Trainer } from '@/types/models'
import { getAuthorizing } from '@/lib/getAuthorizing'
import Link from 'next/link'
/**
 * Server action to create a new course
 */
async function createCourse(formData: FormData) {
  'use server'

  const code = formData.get('code') as string
  const programId = formData.get('programId') as string
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string
  const mainTrainerId = formData.get('mainTrainerId') as string
  const trainerIds = formData.getAll('trainerIds') as string[]
  
  // Validate required fields
  if (!code || !programId || !startDate || !endDate || !mainTrainerId) {
    throw new Error('All required fields must be filled')
  }

  let course;
  
  // Create the course
  try {
  course = await db.course.create({
    data: {
      code,
      program: { connect: { id: programId } },
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      mainTrainer: { connect: { id: mainTrainerId } },
      trainers: {
        connect: trainerIds.map(id => ({ id })),
      },
    }
  })
  } catch (error) {
    console.error('Failed to create course:', error)
    throw error
  }
  
  redirect(`/course/${course?.id}?created=1`)
}

/**
 * New Course Page - Provides form to create a new course
 */
export default async function NewCoursePage() {
  // Check user authorization
  await getAuthorizing({
    privilige: ['ADMIN', 'PROGRAMMMANAGER', 'TRAINER'],
  })
  // Fetch trainers and programs in parallel for better performance
  const [trainersData, programsData] = await Promise.all([
    db.trainer.findMany({
      orderBy: { name: 'asc' },
    }),
    db.program.findMany({
      orderBy: { name: 'asc' },
    })
  ]);
  
  // Sanitize data to handle any Decimal values
  const trainers = sanitize<typeof trainersData, Trainer[]>(trainersData);
  const programs = sanitize<typeof programsData, Program[]>(programsData);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <nav className="mb-6 text-sm text-gray-500 flex items-start gap-2 pl-0 w-full max-w-2xl">
        <Link href="/" className="hover:underline text-gray-700">Startseite</Link>
        <span>&gt;</span>
        <span className="text-gray-700 font-semibold">Kurs anlegen</span>
      </nav>
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="px-8 py-10">
            <h1 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
              Kurs anlegen
            </h1>
              <CreateCourseForm
                course={undefined}
                trainers={trainers}
                programs={programs}
                onSubmit={createCourse}
              />
          </div>
        </div>
      </div>
    </div>
  )
}