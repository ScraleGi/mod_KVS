
import { redirect } from 'next/navigation'
import CreateCourseForm from '@/components/course/CreateCourseForm'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { Program, Trainer } from '@/types/models'

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

  // Create the course
  await db.course.create({
    data: {
      code,
      program: { connect: { id: programId } },
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      mainTrainer: { connect: { id: mainTrainerId } },
      trainers: {
        connect: trainerIds.map(id => ({ id })),
      },
    },
  })
  
  redirect('/course')
}

/**
 * New Course Page - Provides form to create a new course
 */
export default async function NewCoursePage() {
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
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="px-8 py-10">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 tracking-tight">
              Kurs anlegen
            </h1>
            <CreateCourseForm
              course={null}
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