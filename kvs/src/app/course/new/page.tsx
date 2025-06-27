import { PrismaClient } from '../../../../generated/prisma/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function NewCoursePage() {
  // Server action to create a new course in the database
  const createCourse = async (formData: FormData) => {
    'use server'
    const programId = formData.get('programId') as string
    const startDate = formData.get('startDate') as string
    const mainTrainerId = formData.get('mainTrainerId') as string
    const trainerIds = formData.getAll('trainerIds') as string[]

    // Filter out mainTrainerId from additional trainers for safety
    const filteredTrainerIds = trainerIds.filter(tid => tid !== mainTrainerId)

    await prisma.course.create({
      data: {
        program: { connect: { id: programId } },
        startDate: new Date(startDate),
        mainTrainer: { connect: { id: mainTrainerId } },
        trainers: {
          connect: filteredTrainerIds.map(id => ({ id })),
        },
      },
    })
    redirect('/course')
  }

  // Fetch all programs and trainers for selection
  const programs = await prisma.program.findMany({
    orderBy: { name: 'asc' },
  })
  const trainers = await prisma.trainer.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-sm shadow border border-gray-100">
          <div className="px-6 py-8">
            <h1 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
              Create New Course
            </h1>
            <form action={createCourse} className="space-y-6" id="new-course-form">
              {/* Program */}
              <div className="space-y-1">
                <label htmlFor="programId" className="block text-xs font-medium text-gray-600">
                  Program
                </label>
                <select
                  id="programId"
                  name="programId"
                  defaultValue=""
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="" disabled>Select program</option>
                  {programs.map(program => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Start Date */}
              <div className="space-y-1">
                <label htmlFor="startDate" className="block text-xs font-medium text-gray-600">
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              {/* Main Trainer */}
              <div className="space-y-1">
                <label htmlFor="mainTrainerId" className="block text-xs font-medium text-gray-600">
                  Main Trainer
                </label>
                <select
                  id="mainTrainerId"
                  name="mainTrainerId"
                  defaultValue=""
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Additional Trainers
                </label>
                <div className="flex flex-wrap gap-2" id="trainer-checkboxes">
                  {trainers.map(trainer => (
                    <label key={trainer.id} className="flex items-center space-x-2 trainer-checkbox-label" data-trainer-id={trainer.id}>
                      <input
                        type="checkbox"
                        name="trainerIds"
                        value={trainer.id}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 trainer-checkbox"
                      />
                      <span className="text-xs">{trainer.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-2 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Course
                </button>
                <Link
                  href="/course"
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center"
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