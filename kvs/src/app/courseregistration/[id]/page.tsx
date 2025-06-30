import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '../../../../generated/prisma/client';
import { DownloadPDFButton } from '../../../components/DownloadButton/DownloadButton';

interface CourseRegistrationPageProps {
  params: {
    id: string;
  };
}

const prisma = new PrismaClient();

export default async function CourseRegistrationPage({
  params,
}: CourseRegistrationPageProps) {
  const { id } = await params;

  const registration = await prisma.courseRegistration.findUnique({
    where: { id },
    include: {
      course: { include: { program: { include: { area: true } }, mainTrainer: true } },
      participant: true,
      invoices: true,
    },
  });

  // Debugging output
  console.log(registration, 'Registration fetched for ID:', id);

  if (!registration) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Link href="/" className="text-blue-500 hover:underline mb-6 block">
          &larr; Back to Home
        </Link>
        <div className="text-red-600 text-lg font-semibold">Registration not found.</div>
      </div>
    );
  }

  //filename generation
  const participantName = registration.participant.name.replace(/\s+/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const certificateFilename = `certificate_${participantName}_${dateStr}.pdf`;
  const kursRegelnFilename = `KursRegeln_${participantName}_${dateStr}.pdf`;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {registration.participant.name}
      </h2>
      <DownloadPDFButton
        registration={registration}
        type="certificate"
        filename={certificateFilename}
      />
      <DownloadPDFButton
        registration={registration}
        type="KursRegeln"
        filename={kursRegelnFilename}
      />
    </div>
  );
}


/* This code was made with gyula
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

*/
