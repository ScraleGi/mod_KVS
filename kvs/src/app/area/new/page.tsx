import { getAuthorizing } from '@/lib/getAuthorizing'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { EditLabel } from '../../../components/trainer/EditLabel'
import { NewAndEditForm } from '../../../components/forms/NewAndEditForm'

/**
 * Server action to create a new area
 */
async function createArea(formData: FormData) {
  'use server'
  let area
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
    area = await db.area.create({
      data: { code, name, description: description || null },
    })
  } catch (error) {
    console.error('Failed to create area:', error)
    throw error
  }

  // Redirect to areas list after successful creation
  redirect(`/area/${area?.id}?created=1`)
}

export default async function NewAreaPage() {

  // Check user authorization
  const roles = await getAuthorizing({
    privilige: ['ADMIN', 'PROGRAMMMANAGER'],
  })
  if (roles.length === 0) {
    redirect('/403')
  }

  return (
    <NewAndEditForm
      title="Bereich hinzufügen"
      formAction={createArea}
      navHref="/area"
      navHrefText="Bereiche"
      navTitle="Bereich hinzufügen"
      buttonText="Bereich erstellen"
    >
      <EditLabel
        name="code"
        labelName="Bereichscode"
        value=""
        type="text"
        required={true}
      />
      {/* Area Name Field */}
      <EditLabel
        name="name"
        labelName="Name"
        value=""
        type="text"
        required={true}
      />
      {/* Area Description Field (Optional) */}
      <EditLabel
        name="description"
        labelName="Beschreibung"
        value=""
        type="textarea"
        rows={2}
      />      
    </NewAndEditForm>

  )
}