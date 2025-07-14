import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'

/**
 * Server action to create a new area
 */
async function createArea(formData: FormData) {
  'use server'
  try {
    const code = formData.get('code') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string | null

    // Validate required fields
    if (!code || code.trim() === '') {
      throw new Error('Code is required')
    }
    if (!name || name.trim() === '') {
      throw new Error('Name is required')
    }

    // Create new area in database
    await db.area.create({
      data: { code, name, description: description || null },
    })
  } catch (error) {
    console.error('Failed to create area:', error)
    throw error
  }
  
  // Redirect to areas list after successful creation
  redirect('/area')
}

export default function NewAreaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-sm shadow border border-gray-100">
          <div className="px-6 py-8">
            <h1 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
              Bereich hinzufügen
            </h1>
            <form action={createArea} className="space-y-6">
              {/* Area Code Field */}
              <div className="space-y-1">
                <label htmlFor="code" className="block text-xs font-medium text-gray-600">
                  Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Code einfügen"
                  required
                />
              </div>
              
              {/* Area Name Field */}
              <div className="space-y-1">
                <label htmlFor="name" className="block text-xs font-medium text-gray-600">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Name einfügen"
                  required
                />
              </div>
              
              {/* Area Description Field (Optional) */}
              <div className="space-y-1">
                <label htmlFor="description" className="block text-xs font-medium text-gray-600">
                  Beschreibung (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Beschreibung einfügen"
                  rows={2}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-2 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Bereich erstellen
                </button>
                <Link
                  href="/area"
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Bereiche
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}