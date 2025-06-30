import { PrismaClient } from '../../../../generated/prisma/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import EditCourseForm from '@/components/course/CreateCourseForm'

const prisma = new PrismaClient()

async function createCourse(formData: FormData) {
  'use server'

  const programId = formData.get('programId') as string
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string // <-- add this line
  const mainTrainerId = formData.get('mainTrainerId') as string
  const filteredTrainerIds = formData.getAll('trainerIds') as string[]

  await prisma.course.create({
    data: {
      program: { connect: { id: programId } },
      startDate: new Date(startDate),
      endDate: new Date(endDate), // <-- add this line
      mainTrainer: { connect: { id: mainTrainerId } },
      trainers: {
        connect: filteredTrainerIds.map(id => ({ id })),
      },
    },
  })
  redirect('/course')
}

export default async function NewCoursePage() {
    const trainers = await prisma.trainer.findMany({
        orderBy: { name: 'asc' },
    })
    // Serialize Decimal fields in programmes
    const programmes = (await prisma.program.findMany({
        orderBy: { name: 'asc' },
    })).map(p => ({
        ...p,
        price: p.price ? p.price.toString() : null, // <-- serialize Decimal to string
    }))

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
                <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
                    <div className="px-8 py-10">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 tracking-tight">
                            Kurs anlegen
                        </h1>
                        <EditCourseForm
                            course={null}
                            trainers={trainers}
                            programs={programmes}
                            onSubmit={createCourse}
                        />
                        <div className="mt-8 text-center">
                            <Link href="/course" className="text-blue-600 hover:underline">
                                Zurück zur Kursliste
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
