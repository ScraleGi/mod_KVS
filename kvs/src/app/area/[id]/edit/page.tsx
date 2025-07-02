import { PrismaClient } from '../../../../../generated/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const prisma = new PrismaClient();

interface EditAreaPageProps {
  params: {
    id: string;
  };
}

export default async function EditAreaPage({ params }: EditAreaPageProps) {
  // Server action to update the area in the database
  const changeArea = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    await prisma.area.update({
      where: { id },
      data: { name },
    });
    redirect('/area');
  };

  // Server action soft-delete the area
  async function deleteArea(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const now = new Date()
  
    await prisma.program.updateMany({
      where: { areaId: id },
      data: { deletedAt: now }
    })
  
    await prisma.area.update({
      where: { id },
      data: { deletedAt: now }
    })
  
    redirect('/area')
  }

  const { id } = await params;
  const area = await prisma.area.findUnique({
    where: { id },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-sm shadow border border-gray-100">
          <div className="px-6 py-8">
            <h1 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
              Edit Area
            </h1>
            <form action={changeArea} className="space-y-6">
              <input type="hidden" name="id" value={id} />
              <div className="space-y-1">
                <label htmlFor="name" className="block text-xs font-medium text-gray-600">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={area?.name || ''}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter area name"
                  required
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
                  href="/area"
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Areas
                </Link>
              </div>
            </form>
          </div>
        </div>
        {/* Soft Delete Link außerhalb der Box, rechtsbündig */}
        <form action={deleteArea} className="mt-4 flex justify-end w-full">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="inline-flex items-center cursor-pointer text-sm text-red-600 hover:text-red-800 hover:bg-red-50 transition bg-transparent border-none p-0 font-normal pr-10"
            style={{ boxShadow: 'none' }}
            title="Soft Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c1.657 0 3.22.402 4.575 1.125M21.542 12c-1.274 4.057-5.065 7-9.542 7-1.657 0-3.22-.402-4.575-1.125M9.88 9.88l4.24 4.24" />
            </svg>
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}