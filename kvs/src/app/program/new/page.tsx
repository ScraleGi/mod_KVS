import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'

// Server action to create a new program
async function createProgram(formData: FormData) {
  'use server'
  
  const code = formData.get('code') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const teachingUnits = formData.get('teachingUnits')
  const price = formData.get('price')
  const areaId = formData.get('areaId') as string

  if (!code || !name || !areaId) {
    throw new Error('Code, Name, and Area are required')
  }

  let program;

  try {
    program = await db.program.create({
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
    console.error('Failed to create program:', error)
    throw error
  }
  redirect(`/program/${program?.id}?created=1`)
}

export default async function NewProgramPage() {
  try {
    // Fetch all non-deleted areas for the select dropdown
    const areas = await db.area.findMany({ 
      where: { deletedAt: null },
      orderBy: { name: 'asc' } 
    })

    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-sm shadow border border-gray-100">
            <div className="px-6 py-8">
              <h1 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
                Programm hinzufügen
              </h1>
              <form action={createProgram} className="space-y-6">
                <div className="space-y-1">
                  <label htmlFor="code" className="block text-xs font-medium text-gray-600">
                    Code
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
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
                    required
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter program name"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="areaId" className="block text-xs font-medium text-gray-600">
                    Bereich
                  </label>
                  <select
                    id="areaId"
                    name="areaId"
                    required
                    defaultValue=""
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="" disabled>
                      Bereich wählen
                    </option>
                    {areas.map(area => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="description" className="block text-xs font-medium text-gray-600">
                    Beschreibung
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter program description"
                    rows={3}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="teachingUnits" className="block text-xs font-medium text-gray-600">
                    Unterrichtseinheiten
                  </label>
                  <input
                    id="teachingUnits"
                    name="teachingUnits"
                    type="number"
                    min={0}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter number of units"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="price" className="block text-xs font-medium text-gray-600">
                    Preis (€)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min={0}
                    step="0.01"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter price"
                  />
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="inline-flex cursor-pointer items-center px-5 py-2 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Programm erstellen 
                  </button>
                  <Link
                    href="/program"
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Programme
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to load new program page:', error)
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md bg-white rounded-sm shadow border border-gray-100 p-6">
          <div className="text-lg text-red-500 mb-4">Fehler beim laden des Formulars</div>
          <Link
            href="/program"
            className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Programme
          </Link>
        </div>
      </div>
    )
  }
}