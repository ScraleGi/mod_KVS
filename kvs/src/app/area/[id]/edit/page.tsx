import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Area } from '@/types/models';
import { sanitize } from '@/lib/sanitize';
import RemoveButton from '@/components/RemoveButton/RemoveButton';

export default async function EditAreaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params; // Await the promise

  // Fetch area and its programs in parallel
  const [area] = await Promise.all([
    db.area.findUnique({
      where: { id },
    }),
    db.program.findMany({
      where: { areaId: id },
      orderBy: { name: 'asc' },
    }),
  ]);

  // Show error if area not found
  if (!area) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">Bereich nicht gefunden.</div>
      </div>
    );
  }

  // Sanitize area data to handle any Decimal types
  const sanitizedArea = sanitize<typeof area, Area>(area);

  // Server action to update the area in the database
  const changeArea = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    const code = formData.get('code') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;

    await db.area.update({
      where: { id },
      data: { code, name, description: description || null },
    });
    redirect(`/area/${id}?edited=1`);
  };

  // Server action to soft-delete the area
  async function deleteArea(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const now = new Date();

    await db.program.updateMany({
      where: { areaId: id },
      data: { deletedAt: now }
    });

    await db.area.update({
      where: { id },
      data: { deletedAt: now }
    });

    redirect('/area/deleted?deleted=1');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md">
        <nav className="mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
          <Link href="/area" className="hover:underline text-gray-700">Bereiche</Link>
          <span>&gt;</span>
          <span className="text-gray-700 font-semibold">Bereich bearbeiten</span>
          <span>&gt;</span>
          <Link href={`/area/${id}`} className="hover:underline text-gray-700">Details</Link>

        </nav>
        <div className="bg-white rounded-sm shadow border border-gray-100">
          <div className="px-6 py-8">
            <h1 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
              Bereich bearbeiten
            </h1>
            <form action={changeArea} className="space-y-6">
              <input type="hidden" name="id" value={id} />
              <div className="space-y-1">
                <label htmlFor="code" className="block text-xs font-medium text-gray-600">
                  Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  defaultValue={sanitizedArea?.code || ''}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter unique area code"
                  required
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
                  defaultValue={sanitizedArea?.name || ''}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter area name"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="description" className="block text-xs font-medium text-gray-600">
                  Beschreibung (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={sanitizedArea?.description || ''}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter area description"
                  rows={2}
                />
              </div>
              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-2 border border-transparent cursor-pointer text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Änderungen speichern
                </button>
                
              
              </div>
            </form>
          </div>
          {/* Danger Zone Section */}
          <div className="border-t border-gray-200 mt-2"></div>
          <div className="px-6 py-4 bg-gray-50 rounded-b-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Archiv</h3>
                <p className="text-xs text-gray-500 mt-1">In Ablage verwahren.</p>
              </div>
              <RemoveButton
                itemId={id}
                onRemove={deleteArea}
                title="Delete Area"
                message="Are you sure you want to soft delete this area? This will also remove all associated programs."
                fieldName="id"
                customButton={
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-white border border-red-300 rounded text-sm text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-30"
                  >
                    <div className="flex items-center cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      Archivieren
                    </div>
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}