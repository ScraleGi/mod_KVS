import { PrismaClient } from '../../../../../generated/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

interface EditCoursePageProps {
  params: {
    id: string
  }
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  // Server action to update the course in the database
  const changeCourse = async (formData: FormData) => {
    'use server'
    const id = formData.get('id') as string
    const startDate = formData.get('startDate') as string
    const mainTrainerId = formData.get('mainTrainerId') as string
    const trainerIds = formData.getAll('trainerIds') as string[]

    // Filter out mainTrainerId from additional trainers for safety
    const filteredTrainerIds = trainerIds.filter(tid => tid !== mainTrainerId)

    await prisma.course.update({
      where: { id },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        mainTrainer: { connect: { id: mainTrainerId } },
        trainers: {
          set: filteredTrainerIds.map(id => ({ id })),
        },
      },
    })
    redirect('/course')
  }

  const { id } = await params
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      program: true,
      mainTrainer: true,
      trainers: true,
    },
  })

  // Fetch all trainers for selection
  const trainers = await prisma.trainer.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="px-8 py-10">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 tracking-tight">
              Edit Course
            </h1>
            <form action={changeCourse} className="space-y-8" id="edit-course-form">
              <input type="hidden" name="id" value={id} />
              {/* Program (readonly) */}
              <div className="space-y-2">
                <label htmlFor="program" className="block text-sm font-medium text-gray-600">
                  Program
                </label>
                <input
                  id="program"
                  name="program"
                  type="text"
                  value={course?.program?.name || ''}
                  disabled
                  className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                />
              </div>
              {/* Start Date */}
              <div className="space-y-2">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-600">
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  defaultValue={course?.startDate?.toISOString().slice(0, 10)}
                  className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                  required
                />
              </div>
              {/* Main Trainer */}
              <div className="space-y-2">
                <label htmlFor="mainTrainerId" className="block text-sm font-medium text-gray-600">
                  Main Trainer
                </label>
                <select
                  id="mainTrainerId"
                  name="mainTrainerId"
                  defaultValue={course?.mainTrainer?.id || ''}
                  className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                  required
                >
                  <option value="" disabled>Select main trainer</option>
                  {trainers.map(trainer => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Additional Trainers */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Additional Trainers
                </label>
                <div className="flex flex-wrap gap-2" id="trainer-checkboxes">
                  {trainers.map(trainer => (
                    <label key={trainer.id} className="flex items-center space-x-2 trainer-checkbox-label" data-trainer-id={trainer.id}>
                      <input
                        type="checkbox"
                        name="trainerIds"
                        value={trainer.id}
                        defaultChecked={course?.trainers.some(t => t.id === trainer.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 trainer-checkbox"
                      />
                      <span className="text-sm">{trainer.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
                <Link
                  href="/course"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Courses
                </Link>
              </div>
            </form>
            {/* Inline script to hide the main trainer from additional trainers */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  function updateTrainerCheckboxes() {
                    var mainTrainerId = document.getElementById('mainTrainerId').value;
                    document.querySelectorAll('.trainer-checkbox-label').forEach(function(label) {
                      var tid = label.getAttribute('data-trainer-id');
                      if (tid === mainTrainerId) {
                        label.style.display = 'none';
                        label.querySelector('input[type="checkbox"]').checked = false;
                      } else {
                        label.style.display = '';
                      }
                    });
                  }
                  document.getElementById('mainTrainerId').addEventListener('change', updateTrainerCheckboxes);
                  updateTrainerCheckboxes();
                `,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}