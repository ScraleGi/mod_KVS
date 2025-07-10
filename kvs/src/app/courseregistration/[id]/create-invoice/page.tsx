// page.tsx
import { PrismaClient } from '../../../../../generated/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { generateInvoice } from '@/utils/generateInvoice'

import RecipientSelect from './RecipientSelect' // <-- import client component

const prisma = new PrismaClient()

export default async function CreateInvoicePage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const { id } = await params

  const registration = await prisma.courseRegistration.findUnique({
    where: { id },
    include: {
      participant: true,
      course: { include: { program: true } },
    },
  })

  console.log("Registration", registration )
  
  if (!registration || !registration.participant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full px-4">
          <Link href={`/courseregistration/${id}`} className="text-blue-500 hover:text-blue-800 mb-6 block">
            &larr; Back to Registration
          </Link>
          <div className="text-red-600 text-lg font-semibold">Registration or participant not found.</div>
        </div>
      </div>
    )
  }

  // NEW: Fetch saved recipients to pass to client component
  const recipients = await prisma.invoiceRecipient.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-2 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-2xl font-bold mb-6 text-neutral-900 text-center">Create Invoice</h1>
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-neutral-700">
            <div>
              <span className="font-semibold">Participant:</span> {registration.participant.name} {registration.participant.surname}
            </div>
            <div>
              <span className="font-semibold">Course:</span> {registration.course?.program?.name}
            </div>
          </div>
        </div>

        {/* Add id here for client component to target */}
        <form
          id="invoice-form"
          action={async (formData) => {
            'use server'
            await generateInvoice(formData)
            redirect(`/courseregistration/${id}`)
          }}
          className="space-y-6"
        >
          <input type="hidden" name="registrationId" value={registration.id} />

          {/* NEW: Dropdown autofill component */}
          <RecipientSelect
            recipients={recipients.map(r => ({
              ...r,
              recipientSalutation: r.recipientSalutation ?? undefined,
              recipientName: r.recipientName ?? undefined,
              recipientSurname: r.recipientSurname ?? undefined,
              companyName: r.companyName ?? undefined,
              recipientEmail: r.recipientEmail ?? undefined,
              postalCode: r.postalCode ?? undefined,
              recipientStreet: r.recipientStreet ?? undefined,
              recipientCity: r.recipientCity ?? undefined,
              recipientCountry: r.recipientCountry ?? undefined,
              participantId: r.participantId ?? undefined,
            }))}
          />

          {/* Invoice Recipient Section (UNCHANGED) */}
          <fieldset className="border border-neutral-200 rounded-lg p-5">
            <legend className="text-base font-semibold text-blue-700 px-2">Invoice Recipient</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Recipient Type
                <select name="type" required className="mt-1 border rounded px-2 py-1">
                  <option value="PERSON">Person</option>
                  <option value="COMPANY">Company</option>
                </select>
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
              Salutation (Recipient)
              <input name="recipientSalutation" className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                First Name (Recipient)
                <input name="recipientName" className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Surname (Recipient)
                <input name="recipientSurname" className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Company Name (Recipient)
                <input name="companyName" className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700 sm:col-span-2">
                Email (Recipient)
                <input name="recipientEmail" type="email" required className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700 sm:col-span-2">
                Street (Recipient)
                <input name="recipientStreet" required className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Postal Code (Recipient)
                <input name="postalCode" required className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                City (Recipient)
                <input name="recipientCity" required className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700 sm:col-span-2">
                Country (Recipient)
                <input name="recipientCountry" required className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700 sm:col-span-2">
                Due Date
                <input
                  name="dueDate"
                  type="date"
                  required
                  className="mt-1 border rounded px-2 py-1"
                  defaultValue={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
              </label>
            </div>
          </fieldset>

          {/* Course Participant Reference Section (UNCHANGED) */}
          <fieldset className="border border-neutral-200 rounded-lg p-5">
            <legend className="text-base font-semibold text-blue-700 px-2">Course Participant (Reference)</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs text-neutral-600">
              <div>
                <span className="font-semibold">Name:</span> {registration.participant.name} {registration.participant.surname}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {registration.participant.email}
              </div>
              <div className="sm:col-span-2">
                <span className="font-semibold">Address:</span> {registration.participant.street}, {registration.participant.postalCode} {registration.participant.city}, {registration.participant.country}
              </div>
            </div>
          </fieldset>

          <div className="flex justify-between mt-6">
            <Link
              href={`/courseregistration/${id}`}
              className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 text-xs font-medium transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
