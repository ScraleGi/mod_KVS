import { PrismaClient } from '../../../../../generated/prisma/client'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function EditParticipantPage({ params }: { params: { id: string } }) {
  const { id } = await params

  // Fetch participant and all available courses
  const participant = await prisma.participant.findUnique({
    where: { id },
    include: {
      registrations: {
        include: { course: { include: { program: true } } }
      }
    }
  })

  if (!participant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full px-4">
          <Link href="/participant" className="text-blue-500 hover:underline mb-6 block">
            &larr; Back to Participants
          </Link>
          <div className="text-red-600 text-lg font-semibold">Participant not found.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-2 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-neutral-100 p-8">
        
        <h1 className="text-2xl font-bold mb-6 text-neutral-900 text-center">Edit Participant</h1>
        <form
          action={async (formData) => {
            'use server'
            const code = formData.get('code') as string
            const name = formData.get('name') as string
            const surname = formData.get('surname') as string
            const salutation = formData.get('salutation') as string
            const title = formData.get('title') as string | null
            const email = formData.get('email') as string
            const phoneNumber = formData.get('phoneNumber') as string
            const birthday = formData.get('birthday') as string
            const postalCode = formData.get('postalCode') as string
            const city = formData.get('city') as string
            const street = formData.get('street') as string
            const country = formData.get('country') as string

            await prisma.participant.update({
              where: { id },
              data: {
                code,
                name,
                surname,
                salutation,
                title: title || null,
                email,
                phoneNumber,
                birthday: new Date(birthday),
                postalCode,
                city,
                street,
                country,
              }
            })

            redirect(`/participant/${id}?edited=1`)
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Code
              <input
                name="code"
                required
                defaultValue={participant.code}
                className="mt-1 border rounded px-2 py-1"
                autoFocus
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Salutation
              <input
                name="salutation"
                required
                defaultValue={participant.salutation}
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Title
              <input
                name="title"
                defaultValue={participant.title ?? ''}
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Name
              <input
                name="name"
                required
                defaultValue={participant.name}
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Surname
              <input
                name="surname"
                required
                defaultValue={participant.surname}
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Email
              <input
                name="email"
                type="email"
                required
                defaultValue={participant.email}
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Phone Number
              <input
                name="phoneNumber"
                required
                defaultValue={participant.phoneNumber}
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Birthday
              <input
                name="birthday"
                type="date"
                required
                defaultValue={participant.birthday ? new Date(participant.birthday).toISOString().split('T')[0] : ''}
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Postal Code
              <input
                name="postalCode"
                required
                defaultValue={participant.postalCode}
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              City
              <input
                name="city"
                required
                defaultValue={participant.city}
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Street
              <input
                name="street"
                required
                defaultValue={participant.street}
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Country
              <input
                name="country"
                required
                defaultValue={participant.country}
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
          </div>
          <div className="flex justify-between mt-6">
            <Link
              href={`/participant/${id}`}
              className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 text-xs font-medium transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}