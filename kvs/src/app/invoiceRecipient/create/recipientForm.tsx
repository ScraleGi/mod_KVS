"use client"
import { useState, useTransition } from "react"
import Link from "next/link"
import { createRecipientAction } from "../../actions/createRecipientAction"

/**
 * Form UI for creating a new InvoiceRecipient.
 * - Displays validation errors from server action.
 * - Shows loading state while submitting.
 */
export default function RecipientForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await createRecipientAction(formData)
      if (result && result.error) {
        setError(result.error)
      } else if (result && result.redirect) {
        window.location.href = result.redirect
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-2 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-2xl font-bold mb-6 text-neutral-900 text-center">
          Rechnungsempfänger erstellen
        </h1>

        {/* Display validation error if present */}
        {error && (
          <div className="mb-4 text-red-600 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <form
          id="invoice-recipient-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <fieldset className="border border-neutral-200 rounded-lg p-5">
            <legend className="text-base font-semibold text-blue-700 px-2">
              Rechnungsempfänger
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Empfänger
                <select name="type" required className="mt-1 border rounded px-2 py-1">
                  <option value="PERSON">Person</option>
                  <option value="COMPANY">Firma</option>
                </select>
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Anrede (Empfänger)
                <input name="recipientSalutation" className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Name (Empfänger)
                <input name="recipientName" className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Nachname (Empfänger)
                <input name="recipientSurname" className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Firmen Name (Empfänger)
                <input name="companyName" className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Email (Empfänger)
                <input name="recipientEmail" type="email" required className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700 sm:col-span-2">
                Straße (Empfänger)
                <input name="recipientStreet" required className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                PLZ (Empfänger)
                <input name="postalCode" required className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Ort (Empfänger)
                <input name="recipientCity" required className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700 sm:col-span-2">
                Land (Empfänger)
                <input name="recipientCountry" required className="mt-1 border rounded px-2 py-1" />
              </label>
            </div>
          </fieldset>

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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition disabled:opacity-50"
            >
              {isPending ? "Speichern..." : "Empfänger erstellen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}