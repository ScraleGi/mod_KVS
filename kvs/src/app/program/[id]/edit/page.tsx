import { PrismaClient } from '../../../../../generated/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

interface EditProgramPageProps {
  params: {
    id: string
  }
}

export default async function EditProgramPage({ params }: EditProgramPageProps) {
  const { id } = await params

  const [program, areas] = await Promise.all([
    prisma.program.findUnique({
      where: { id },
      include: { area: true },
    }),
    prisma.area.findMany({ orderBy: { name: 'asc' } }),
  ])

  const changeProgram = async (formData: FormData) => {
    'use server'
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const teachingUnits = formData.get('teachingUnits')
    const price = formData.get('price')
    const areaId = formData.get('areaId') as string

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
    redirect('/program')
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">Program not found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-sm shadow border border-gray-100">
          <div className="px-6 py-8">
            <h1 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
              Edit Program
            </h1>
            <form action={changeProgram} className="space-y-6">
              <input type="hidden" name="id" value={id} />
              <div className="space-y-1">
                <label htmlFor="name" className="block text-xs font-medium text-gray-600">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={program.name}
                  required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter program name"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="areaId" className="block text-xs font-medium text-gray-600">
                  Area
                </label>
                <select
                  id="areaId"
                  name="areaId"
                  defaultValue={program.areaId}
                  required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="" disabled>Select area</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor="description" className="block text-xs font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={program.description || ''}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter program description"
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="teachingUnits" className="block text-xs font-medium text-gray-600">
                  Teaching Units
                </label>
                <input
                  id="teachingUnits"
                  name="teachingUnits"
                  type="number"
                  min={0}
                  defaultValue={program.teachingUnits ?? ''}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter number of units"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="price" className="block text-xs font-medium text-gray-600">
                  Price (€)
                </label>
                <input
                  id="price"
                  name="price"
                  type="decimal"
                  min={0}
                  step="0.01"
                  defaultValue={program.price ? program.price.toString() : ''}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter price"
                />
              </div>
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-2 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
                <Link
                  href="/program"
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center"
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