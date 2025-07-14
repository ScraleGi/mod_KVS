import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"

async function createRecipient(formData: FormData) {
  "use server"
  const courseId = formData.get("courseId") as string
  const type = formData.get("type") as "PERSON" | "COMPANY"
  const recipientSalutation = formData.get("recipientSalutation") as string
  const recipientName = formData.get("recipientName") as string
  const recipientSurname = formData.get("recipientSurname") as string
  const companyName = formData.get("companyName") as string
  const recipientEmail = formData.get("recipientEmail") as string
  const recipientStreet = formData.get("recipientStreet") as string
  const postalCode = formData.get("postalCode") as string
  const recipientCity = formData.get("recipientCity") as string
  const recipientCountry = formData.get("recipientCountry") as string

  const newRecipient = await db.invoiceRecipient.create({
    data: {
      type,
      recipientSalutation: type === "PERSON" ? recipientSalutation : null,
      recipientName: type === "PERSON" ? recipientName : null,
      recipientSurname: type === "PERSON" ? recipientSurname : null,
      companyName: type === "COMPANY" ? companyName : null,
      recipientEmail,
      recipientStreet,
      postalCode,
      recipientCity,
      recipientCountry,
    }
  })

  // Redirect with the new recipient's ID as a query param
  redirect(`/course/${courseId}/courseInvoices?customRecipientId=${newRecipient.id}`)
}

export default async function NewInvoiceRecipientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow border border-gray-100 p-8 max-w-xl w-full">
        <h1 className="text-xl font-bold mb-6">Neuen Rechnungsempfänger anlegen</h1>
        <form action={createRecipient} className="flex flex-col gap-4">
          <input type="hidden" name="courseId" value={courseId} />
          <div>
            <label className="block text-sm font-medium mb-1">Empfängertyp</label>
            <select name="type" required className="border rounded px-2 py-1 w-full">
              <option value="PERSON">Person</option>
              <option value="COMPANY">Firma</option>
            </select>
          </div>
          <div className="border rounded p-3 bg-neutral-50">
            <div className="text-xs text-neutral-500 mb-2">
              Für <b>Person</b>: Nur Anrede, Vorname, Nachname ausfüllen.<br />
              Für <b>Firma</b>: Nur Firmenname ausfüllen.
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Anrede (Person)</label>
                <input name="recipientSalutation" className="border rounded px-2 py-1 w-full" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Vorname (Person)</label>
                <input name="recipientName" className="border rounded px-2 py-1 w-full" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Nachname (Person)</label>
                <input name="recipientSurname" className="border rounded px-2 py-1 w-full" />
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">Firmenname (Firma)</label>
              <input name="companyName" className="border rounded px-2 py-1 w-full" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">E-Mail</label>
            <input name="recipientEmail" type="email" required className="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Straße</label>
            <input name="recipientStreet" required className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="flex gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">PLZ</label>
              <input name="postalCode" required className="border rounded px-2 py-1 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ort</label>
              <input name="recipientCity" required className="border rounded px-2 py-1 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Land</label>
              <input name="recipientCountry" required className="border rounded px-2 py-1 w-full" />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
          >
            Empfänger anlegen
          </button>
        </form>
        <div className="mt-8">
          <Link href={`/course/${courseId}/courseInvoices`} className="text-blue-500 hover:underline text-sm">
            &larr; Zurück zur Rechnungsliste
          </Link>
        </div>
      </div>
    </div>
  )
}