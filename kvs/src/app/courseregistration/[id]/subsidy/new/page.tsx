import { updateSubsidy } from '../../sharedServerActions/page'
import { redirect } from 'next/navigation'

export default async function SubsidyNewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  async function createSubsidy(formData: FormData) {
    "use server"
    const amount = formData.get('amount') as string
    const remark = formData.get('remark') as string
    await updateSubsidy(id, amount, remark)
    redirect(`/courseregistration/${id}`)
  }

  return (
    <form action={createSubsidy} className="max-w-md mx-auto mt-10 space-y-4 bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold">Gutschein hinzufügen</h2>
      <div>
        <label className="block text-sm">Betrag (€)</label>
        <input
          name="amount"
          type="number"
          step="0.01"
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm">Bemerkung</label>
        <input
          name="remark"
          type="text"
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Speichern</button>
    </form>
  )
}