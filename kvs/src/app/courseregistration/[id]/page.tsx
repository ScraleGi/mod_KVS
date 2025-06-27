import React from 'react'
import Link from 'next/link'
import { $Enums, PrismaClient } from '../../../../generated/prisma/client'
import { savePDF } from '@/utils/fileStorage'
import { generatePDF } from '@/utils/generatePDF'

interface CourseRegistrationPageProps {
  params: {
    id: string
  }
}

const prisma = new PrismaClient()

export default async function CourseRegistrationPage({ params }: CourseRegistrationPageProps) {
    const { id } = await params

    console.log('Fetching registration for ID:', id)
    const registration = await prisma.courseRegistration.findUnique({
    where: { id },
    include: {
      course: { include: { program: { include: {area: true }}, mainTrainer: true } },
      participant: true,
      invoices: true,
    },
  })

  console.log('Registration:', registration)

    if (!registration) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Link href="/" className="text-blue-500 hover:underline mb-6 block">
                    &larr; Back to Home
                </Link>
                <div className="text-red-600 text-lg font-semibold">Registration not found.</div>
            </div>
        )
    }



    return (
        <div>
          <div>Hello World!</div>
            <form action={async () => {
            'use server'
            // Call your server function here, e.g. generateCertificate(registration.id)
            // You can import and call a server action or API route
            console.log('Certificate button clicked for registration:', registration.id)
            
              const pdfBuffer = await generatePDF('certificate', registration)
              await savePDF('test.pdf', pdfBuffer);
            }}>
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              certificate
            </button>
            </form>

            <form action={async () => {
            'use server'
              const pdfBuffer = await generatePDF('KursRegeln', registration)
              await savePDF('kursregeln.pdf', pdfBuffer);
            }}>
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Kurs Regeln
            </button>
            </form>
        </div>
    )

}