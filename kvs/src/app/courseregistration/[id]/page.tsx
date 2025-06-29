import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '../../../../generated/prisma/client';
import { savePDF } from '@/utils/fileStorage';
import { generatePDF } from '@/utils/generatePDF';

interface CourseRegistrationPageProps {
  params: {
    id: string;
  };
}

const prisma = new PrismaClient();

// ✅ Helper: Centralized PDF Generate + Save + Filename Logic
async function generateAndSavePDFWithName(
  type: string,
  registration: any
) {
  const pdfBuffer = await generatePDF(type, registration);

  const participantName = registration.participant.name.replace(/\s+/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${type}_${participantName}_${dateStr}.pdf`;

  await savePDF(filename, pdfBuffer);
}

export default async function CourseRegistrationPage({
  params,
}: CourseRegistrationPageProps) {
  const { id } = params;

  console.log('Fetching registration for ID:', id);

  const registration = await prisma.courseRegistration.findUnique({
    where: { id },
    include: {
      course: { include: { program: { include: { area: true } }, mainTrainer: true } },
      participant: true,
      invoices: true,
    },
  });

  console.log('Registration:', registration);

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

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {registration.participant.name}
      </h2>

      {/* Certificate PDF Button */}
      <form
        action={async () => {
          'use server';
          console.log('Certificate button clicked for registration:', registration.id);
          await generateAndSavePDFWithName('certificate', registration);
        }}
      >
        <button
          type="submit"
          className="w-full mb-4 px-4 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Certificate
        </button>
      </form>

      {/* Kurs Regeln PDF Button */}
      <form
        action={async () => {
          'use server';
          console.log('Kurs Regeln button clicked for registration:', registration.id);
          await generateAndSavePDFWithName('KursRegeln', registration);
        }}
      >
        <button
          type="submit"
          className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Kurs Regeln
        </button>
      </form>
    </div>
  );
}
