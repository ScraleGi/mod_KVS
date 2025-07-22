import RecipientForm from "@/components/recipientForm/RecipientForm"
import Link from 'next/link'

export default function CreateInvoiceRecipientPage() {
  return (

<div className="w-full px-2 py-2 m-auto justify-center flex items-center h-full align-center">
  <div className="w-full max-w-xl">
    <nav className="max-w-xl mx-auto mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
      <Link href="/invoiceRecipient" className="hover:underline text-gray-700">Empfänger</Link>
      <span>&gt;</span>
    </nav>
    <div className="w-full max-w-xl bg-white rounded-lg border-neutral-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-neutral-900 text-center">
        Rechnungsempfänger erstellen
      </h1>
      <div className="w-full border border-neutral-200 rounded-lg p-10">
        <RecipientForm />
      </div>
    </div>
  </div>
</div>
  )
}