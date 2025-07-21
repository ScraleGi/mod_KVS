import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { Area } from '@/types/models';
import { sanitize } from '@/lib/sanitize';
import RemoveButton from '@/components/RemoveButton/RemoveButton';
import { getAuthorizing } from '@/lib/getAuthorizing';
import { EditLabel } from '../../../../components/trainer/EditLabel';
import { NewAndEditForm } from '../../../../components/forms/NewAndEditForm';
import { NewAndEditButton } from '../../../../components/forms/NewAndEditButton';
import CancelButton from '@/components/cancle-Button/cnacleButton';

export default async function EditAreaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Check user authorization
  const roles = await getAuthorizing({
    privilige: ['ADMIN', 'PROGRAMMMANAGER'],
  })
  if (roles.length === 0) {
    redirect('/403')
  }
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
    <NewAndEditForm
      title="Bereich bearbeiten"
      formAction={changeArea}
      navHref="/area"
      navHrefText="Bereiche"
      navTitle="Bereich bearbeiten"
      nav2Href={`/area/${id}`}
      nav2HrefText={sanitizedArea.name}
      children2={
        <>
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
                title="Bereich löschen"
                message="Sind Sie sicher, dass Sie diesen Bereich sanft löschen wollen? Dadurch werden auch alle zugehörigen Programme entfernt."
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
          </>
      }
    >
      <input type="hidden" name="id" value={sanitizedArea.id} />
      <EditLabel
        name="code"
        labelName="Bereichscode"
        value={sanitizedArea.code}
        type="text"
        required={true}
      />
      <EditLabel
        name="name"
        labelName="Bezeichnung"
        value={sanitizedArea.name}
        type="text"
        required={true}
      />
      <EditLabel
        name="description"
        labelName="Beschreibung"
        value={sanitizedArea.description || ''}
        type="textarea"
      />
      <NewAndEditButton
        buttonText="Speichern"
      />
      
    </NewAndEditForm>
  );
}