import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { InvoiceUpdateData } from '@/types/query-models' 

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      courseRegistration: {
        include: {
          participant: true,
          course: { include: { program: true } }
        }
      },
    }
  })
  
  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-4">
          <Link href="/invoice" className="text-blue-500 hover:text-blue-800 mb-6 block">
            &larr; Back to Invoices
          </Link>
          <div className="text-red-600 text-lg font-semibold">Invoice not found.</div>
        </div>
      </div>
    )
  }
  
  const sanitizedInvoice = sanitize(invoice)
  
    // Server action to update invoice
    async function updateInvoice(formData: FormData) {
      'use server'

    const transactionNumber = formData.get('transactionNumber') as string
    const isCancelled = formData.get('isCancelled') === 'on'
    const dueDateStr = formData.get('dueDate') as string

    // Create the update data object with proper typing
    const updateData: InvoiceUpdateData = {
      transactionNumber: transactionNumber || null,
      isCancelled,
    }

    // Don't include amount in updates - amount is read-only

    // Handle due date properly
    if (dueDateStr) {
      updateData.dueDate = new Date(dueDateStr)
    }

    // Update the invoice
    await db.invoice.update({
      where: { id },
      data: updateData
    })
    // Redirect back to course registration
    const registrationId = invoice?.courseRegistrationId
    revalidatePath(`/invoice/${id}`)

    if (registrationId) {
      revalidatePath(`/courseregistration/${registrationId}`)
      redirect(`/courseregistration/${registrationId}`)
    } else {
      // Fallback if registrationId is somehow missing
      redirect('/') // Or redirect to another appropriate page
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-2 py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Edit Invoice #{sanitizedInvoice.invoiceNumber || sanitizedInvoice.id}
        </h1>
        
        <div className="mb-6 text-sm text-gray-700 bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="mb-2">
            <span className="font-medium">Participant:</span> {invoice.courseRegistration?.participant.name} {invoice.courseRegistration?.participant?.surname}
          </div>
          <div className="mb-2">
            <span className="font-medium">Course:</span> {invoice.courseRegistration?.course.program?.name}
          </div>
          <div>
            <span className="font-medium">Recipient:</span> 
          </div>
        </div>
        
        <form action={updateInvoice} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (€)
                </label>
                <input
                type="number"
                name="amount"
                step="0.01"
                defaultValue={sanitizedInvoice.amount?.toString()}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                readOnly
                aria-readonly="true"
                />
                <p className="mt-1 text-xs text-gray-500">
                Amount cannot be changed after invoice creation.
                </p>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
                </label>
                <input
                type="date"
                name="dueDate"
                defaultValue={sanitizedInvoice.dueDate 
                    ? new Date(sanitizedInvoice.dueDate).toISOString().split('T')[0] 
                    : ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Number (leave empty if unpaid)
            </label>
            <input
              type="text"
              name="transactionNumber"
              defaultValue={sanitizedInvoice.transactionNumber || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter transaction number for paid invoices"
            />
            <p className="mt-1 text-xs text-gray-500">
              Adding a transaction number will mark this invoice as paid.
            </p>
          </div>
          
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="isCancelled"
              name="isCancelled"
              defaultChecked={sanitizedInvoice.isCancelled}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isCancelled" className="ml-2 block text-sm text-gray-700">
              Mark as cancelled
            </label>
          </div>
          
        <div className="flex justify-end gap-3 mt-6">
        <Link
            href={`/courseregistration/${invoice.courseRegistrationId}`}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
            Cancel
        </Link>
        <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
            Save Changes
        </button>
        </div>
        </form>
      </div>
    </div>
  )
}