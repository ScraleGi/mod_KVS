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

  const { id } = await params;
  const area = await prisma.area.findUnique({
    where: { id },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
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
      </div>
    </div>
  );
}