import { PrismaClient } from '../../../../generated/prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

interface ParticipantPageProps {
  params: {
    id: string
  }
}

export default async function ParticipantPage({ params }: ParticipantPageProps) {
  const { id } = await params

  const participant = await prisma.participant.findUnique({
    where: { id },
    include: {
      registrations: {
        include: {
          course: {
            include: { program: true }
          },
          invoices: true,
          coupon: true,
        }
      },
      invoiceRecipients: true,
    }
  })

  if (!participant) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Link href="/" className="text-blue-500 hover:underline mb-6 block">
          &larr; Back to Home
        </Link>
        <div className="text-red-600 text-lg font-semibold">Participant not found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4">{participant.name}</h1>
        <div className="mb-2"><span className="font-semibold">Email:</span> {participant.email}</div>
        <div className="mb-2"><span className="font-semibold">Phone:</span> {participant.phoneNumber}</div>
        <div className="mb-4"><span className="font-semibold">ID:</span> {participant.id}</div>
        <h2 className="text-xl font-bold mt-6 mb-2">Courses Registered</h2>
        <ul className="mb-4">
          {participant.registrations.map(reg => (
            <li key={reg.id} className="mb-4">
              <div>
                <Link
                  href={`/course/${reg.course?.id}`}
                  className="text-blue-600 underline hover:text-blue-800 font-semibold"
                >
                  {reg.course?.program?.name ?? 'Unknown Course'}
                </Link>
                <span className="ml-2 text-gray-500 text-sm">({reg.status})</span>
              </div>
              {reg.coupon && (
                <div className="mt-1">
                  <span className="text-xs text-green-700 bg-green-100 rounded px-2 py-1">
                    Coupon: {reg.coupon.code}
                    {reg.coupon.percent && <> ({reg.coupon.percent}% off)</>}
                    {reg.coupon.amount && <> ({reg.coupon.amount}€ off)</>}
                  </span>
                </div>
              )}
              {reg.discount && (
                <div className="mt-1">
                  <span className="text-xs text-yellow-700 bg-yellow-100 rounded px-2 py-1">
                    Extra Discount: €{reg.discount}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-bold mt-6 mb-2">Invoices</h2>
        <ul>
        {participant.registrations.flatMap(reg => reg.invoices).length === 0 ? (
            <li className="text-gray-400 italic">No invoices found</li>
        ) : (
            participant.registrations.flatMap(reg =>
            reg.invoices.map(inv => (
                <li key={inv.id}>
                <Link
                    href={`/invoice/${inv.id}`}
                    className="text-blue-600 underline hover:text-blue-800"
                >
                    #{inv.id}: €{inv.amount}
                </Link>
                </li>
            ))
            )
        )}
        </ul>
        <div className="flex gap-6 mt-6">
        <Link href="/participant" className="text-blue-500 hover:underline">
            &larr; Back to Participants
        </Link>
        <Link href="/" className="text-blue-500 hover:underline">
            &larr; Back to Home
        </Link>
        </div>
      </div>
    </div>
  )
}