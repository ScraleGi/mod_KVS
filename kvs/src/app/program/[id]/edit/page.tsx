import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import RemoveButton from '@/components/RemoveButton/removeButton';

interface EditProgramPageProps {
  params: {
    id: string
  }
}

export default async function EditProgramPage({ params }: EditProgramPageProps) {
  try {
    const { id } = await params

    const [programData, areas] = await Promise.all([
      db.program.findUnique({
        where: { id },
        include: { area: true },
      }),
      db.area.findMany({ 
        where: { deletedAt: null },
        orderBy: { name: 'asc' } 
      }),
    ])

    // Sanitize data to handle Decimal values properly
    const program = sanitize(programData)

    if (!program) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg text-red-500">Program not found.</div>
        </div>
      )
    }

    const changeProgram = async (formData: FormData) => {
      'use server'
      
      // Get form values
      const id = formData.get('id') as string
      const code = formData.get('code') as string
      const name = formData.get('name') as string
      const description = formData.get('description') as string
      const teachingUnits = formData.get('teachingUnits')
      const price = formData.get('price')
      const areaId = formData.get('areaId') as string

      try {
        // Update program in database
        await db.program.update({
          where: { id },
          data: {
            code,
            name,
            description: description || null,
            teachingUnits: teachingUnits ? Number(teachingUnits) : null,
            price: price ? price.toString() : null, // Pass as string for Decimal
            areaId,
          },
        })
      } catch (error) {
        console.error('Failed to update program:', error)
        throw error
      }
      
      // Redirect outside the try/catch block
      redirect('/program')
    }

    // Soft Delete Handler
    async function deleteProgram(formData: FormData) {
      'use server'
      
      const id = formData.get('id') as string
      
      try {
        await db.program.update({
          where: { id },
          data: { deletedAt: new Date() }
        })
      } catch (error) {
        console.error('Failed to delete program:', error)
        throw error
      }
      
      // Redirect outside the try/catch block
      redirect('/program')
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
                  <label htmlFor="code" className="block text-xs font-medium text-gray-600">
                    Code
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    defaultValue={program.code}
                    required
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter unique program code"
                  />
                </div>
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
                    type="number"
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
                    href={`/program/${id}`}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Details
                  </Link>
                  <Link
                    href={`/program/`}
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
            
            {/* Danger Zone Section */}
            <div className="border-t border-gray-200 mt-2"></div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Danger Zone</h3>
                  <p className="text-xs text-gray-500 mt-1">This action will soft-delete Program</p>
                </div>
                <RemoveButton
                  itemId={id}
                  onRemove={deleteProgram}
                  title="Delete Program"
                  message="Are you sure you want to delete this program? This will also remove all associated courses and registrations."
                  fieldName="id"
                  customButton={
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-white border border-red-300 rounded text-sm text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-30"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        Delete
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
  } catch (error) {
    console.error('Failed to load program edit page:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">
          An error occurred while loading the program. Please try again.
        </div>
      </div>
    )
  }
}