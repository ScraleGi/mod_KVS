import { PrismaClient } from '../../../../generated/prisma/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Initialize Prisma client for database operations
const prisma = new PrismaClient()

// Server action to create a new area in the database
async function createArea(formData: FormData) {
  'use server'
  
  // Get the area name from the form data
  const name = formData.get('name') as string
  
  // Validate that the name is not empty
  if (!name || name.trim() === '') {
     throw new Error('Name is required')
  }
  
  // Create the new area in the database
  await prisma.area.create({
    data: { name },
  })
  
  // Redirect to the area list page after creation
  redirect('/area')
}

// Page component for adding a new area
export default function NewAreaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Card container */}
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="px-8 py-10">
            {/* Page title */}
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 tracking-tight">
              Add New Area
            </h1>
            
            {/* Form for creating a new area */}
            <form action={createArea} className="space-y-8">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <div className="relative">
                  {/* Input for area name */}
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                    placeholder="Enter area name"
                    required
                  />
                </div>
              </div>
              
              {/* Form actions: Create and Cancel */}
              <div className="pt-2 flex items-center justify-between">
                {/* Submit button */}
                <button
                  type="submit"
                  className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Area
                </button>
                
                {/* Cancel button, navigates back to areas list */}
                <Link
                  href="/area"
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