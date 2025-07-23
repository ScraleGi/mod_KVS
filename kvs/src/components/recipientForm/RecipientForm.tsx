"use client"
import React, { useRef, useState, useTransition } from "react"
import Link from "next/link"
import { addRecipientToCourseRegistration, createRecipientAction } from "@/app/actions/createRecipientAction"

export default function RecipientForm(params: { courseregistrationId?: string }) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const [fieldErrors, setFieldErrors] = useState({
    recipientName: false,
    recipientSurname: false,
    recipientSalutation: false,
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setFieldErrors({ recipientName: false, recipientSurname: false, recipientSalutation: false })

    const formData = new FormData(event.currentTarget)
    const type = formData.get("type")

    if (type === "PERSON") {
      const name = formData.get("recipientName")?.toString().trim()
      const surname = formData.get("recipientSurname")?.toString().trim()
      const salutation = formData.get("recipientSalutation")?.toString().trim()

      const newErrors = {
        recipientName: !name,
        recipientSurname: !surname,
        recipientSalutation: !salutation,
      }

      if (newErrors.recipientName || newErrors.recipientSurname || newErrors.recipientSalutation) {
        setFieldErrors(newErrors)
        setError("Bitte fülle alle Pflichtfelder für 'Person' aus.")
        return
      }
    }

    startTransition(async () => {
      const result = await createRecipientAction(formData, params.courseregistrationId)
      if (result && result.error) {
        setError(result.error)
      } else if (result && result.redirect) {
        if (params.courseregistrationId) {
          await addRecipientToCourseRegistration(params.courseregistrationId, result.recipientId)
        }
        formRef.current?.reset()
      }
    })
  }

  return (
    <form
      ref={formRef}
      id="invoice-recipient-form"
      onSubmit={handleSubmit}
      className="space-y-6 w-full"
    >
      <div className="mt-4">
        <h1 className="text-2xl font-bold mb-6 text-neutral-900 text-center">
          Rechnungsempfänger erstellen
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="type" className="block text-xs font-medium text-gray-600">
              Empfänger
            </label>
            <select
              id="type"
              name="type"
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="PERSON">Person</option>
              <option value="COMPANY">Firma</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="recipientSalutation" className="block text-xs font-medium text-gray-600">
              Anrede (Empfänger)
            </label>
            <input
              id="recipientSalutation"
              name="recipientSalutation"
              className={`w-full px-3 py-2 bg-gray-50 border ${
                fieldErrors.recipientSalutation ? "border-red-400" : "border-gray-200"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
            />
            {fieldErrors.recipientSalutation && (
              <p className="text-xs text-red-500 mt-1">Fülle mich auf</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="recipientName" className="block text-xs font-medium text-gray-600">
              Name (Empfänger)
            </label>
            <input
              id="recipientName"
              name="recipientName"
              className={`w-full px-3 py-2 bg-gray-50 border ${
                fieldErrors.recipientName ? "border-red-400" : "border-gray-200"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
            />
            {fieldErrors.recipientName && (
              <p className="text-xs text-red-500 mt-1">Fülle mich auf</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="recipientSurname" className="block text-xs font-medium text-gray-600">
              Nachname (Empfänger)
            </label>
            <input
              id="recipientSurname"
              name="recipientSurname"
              className={`w-full px-3 py-2 bg-gray-50 border ${
                fieldErrors.recipientSurname ? "border-red-400" : "border-gray-200"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
            />
            {fieldErrors.recipientSurname && (
              <p className="text-xs text-red-500 mt-1">Fülle mich auf</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="companyName" className="block text-xs font-medium text-gray-600">
              Firmen Name (Empfänger)
            </label>
            <input
              id="companyName"
              name="companyName"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="recipientEmail" className="block text-xs font-medium text-gray-600">
              Email (Empfänger)
            </label>
            <input
              id="recipientEmail"
              name="recipientEmail"
              type="email"
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label htmlFor="recipientStreet" className="block text-xs font-medium text-gray-600">
              Straße (Empfänger)
            </label>
            <input
              id="recipientStreet"
              name="recipientStreet"
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="postalCode" className="block text-xs font-medium text-gray-600">
              PLZ (Empfänger)
            </label>
            <input
              id="postalCode"
              name="postalCode"
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="recipientCity" className="block text-xs font-medium text-gray-600">
              Ort (Empfänger)
            </label>
            <input
              id="recipientCity"
              name="recipientCity"
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label htmlFor="recipientCountry" className="block text-xs font-medium text-gray-600">
              Land (Empfänger)
            </label>
            <input
              id="recipientCountry"
              name="recipientCountry"
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Link
          href="/invoiceRecipient"
          className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 text-xs font-medium transition"
        >
          Abbrechen
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition disabled:opacity-50"
        >
          {isPending ? "Speichern..." : "Empfänger erstellen"}
        </button>
      </div>
    </form>
  )
}
