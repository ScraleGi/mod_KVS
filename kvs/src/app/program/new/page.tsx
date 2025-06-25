import { PrismaClient } from '../../../../generated/prisma/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

// Server action to create a new program
async function createProgram(formData: FormData) {
  'use server'
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const teachingUnits = formData.get('teachingUnits')
  const price = formData.get('price')
  const areaId = formData.get('areaId') as string

  if (!name || !areaId) {
    throw new Error('Name and Area are required')
  }

  await prisma.program.create({
    data: {
      name,
      description: description || null,
      teachingUnits: teachingUnits ? Number(teachingUnits) : null,
      price: price ? Number(price) : null,
      areaId,
    },
  })
  redirect('/program')
}

export default async function NewProgramPage() {
  // Fetch all areas for the select dropdown
  const areas = await prisma.area.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="px-8 py-10">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 tracking-tight">
              Add New Program
            </h1>
            <form action={createProgram} className="space-y-8">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                  placeholder="Enter program name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="areaId" className="block text-sm font-medium text-gray-600">
                  Area
                </label>
                <select
                  id="areaId"
                  name="areaId"
                  required
                  defaultValue=""
                  className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                >
                  <option value="" disabled>
                    Select area
                  </option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                  placeholder="Enter program description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="teachingUnits" className="block text-sm font-medium text-gray-600">
                  Teaching Units
                </label>
                <input
                  id="teachingUnits"
                  name="teachingUnits"
                  type="number"
                  min={0}
                  className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                  placeholder="Enter number of units"
                />
              </div>
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
                  className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                  placeholder="Enter price"
                />
              </div>
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Program
                </button>
                <Link
                  href="/program"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}