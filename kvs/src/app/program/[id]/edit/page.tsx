import { PrismaClient } from '../../../../../generated/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Initialize Prisma client for database operations
const prisma = new PrismaClient()

// Props interface for the EditProgramPage component
interface EditProgramPageProps {
  params: {
    id: string
  }
}

// Edit Program Page component
export default async function EditProgramPage({ params }: EditProgramPageProps) {
  // Await params (Next.js 15+ requirement) and get the program id
  const { id } = await params

  // Fetch the program to edit and all areas for the dropdown in parallel
  const [program, areas] = await Promise.all([
    prisma.program.findUnique({
      where: { id },
      include: { area: true },
    }),
    prisma.area.findMany({ orderBy: { name: 'asc' } }),
  ])

  // Server action to update the program in the database
  const changeProgram = async (formData: FormData) => {
    'use server'
    // Get all form values
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const teachingUnits = formData.get('teachingUnits')
    const price = formData.get('price')
    const areaId = formData.get('areaId') as string

    // Update the program in the database
    await prisma.program.update({
      where: { id },
      data: {
        name,
        description: description || null,
        teachingUnits: teachingUnits ? Number(teachingUnits) : null,
        price: price ? Number(price) : null,
        areaId,
      },
    })
    // Redirect back to the program list after saving
    redirect('/program')
  }

  // If the program does not exist, show an error message
  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">Program not found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Card container */}
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="px-8 py-10">
            {/* Page title */}
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 tracking-tight">
              Edit Program
            </h1>
            {/* Edit program form */}
            <form action={changeProgram} className="space-y-8">
              {/* Hidden input for program id */}
              <input type="hidden" name="id" value={id} />
              {/* Program name input */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={program.name}
                  required
                  className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                  placeholder="Enter program name"
                />
              </div>
              {/* Area select dropdown */}
              <div className="space-y-2">
                <label htmlFor="areaId" className="block text-sm font-medium text-gray-600">
                  Area
                </label>
                <select
                  id="areaId"
                  name="areaId"
                  defaultValue={program.areaId}
                  required
                  className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                >
                  <option value="" disabled>Select area</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Description textarea */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={program.description || ''}
                  className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                  placeholder="Enter program description"
                  rows={3}
                />
              </div>
              {/* Teaching units input */}
              <div className="space-y-2">
                <label htmlFor="teachingUnits" className="block text-sm font-medium text-gray-600">
                  Teaching Units
                </label>
                <input
                  id="teachingUnits"
                  name="teachingUnits"
                  type="number"
                  min={0}
                  defaultValue={program.teachingUnits ?? ''}
                  className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                  placeholder="Enter number of units"
                />
              </div>

              {/* Price input */}
              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-600">
                  Price (€)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue={program.price ?? ''}
                  className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                  placeholder="Enter price"
                />
              </div>
              {/* Form actions: Save and Back */}
              <div className="pt-2 flex items-center justify-between">
                {/* Save button */}
                <button
                  type="submit"
                  className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
                {/* Back to Program link */}
                <Link
                  href="/program"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Programs
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}