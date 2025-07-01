import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '../../../../generated/prisma/client';
import { DownloadPDFButton } from '../../../components/';

interface CourseRegistrationPageProps {
  params: {
    id: string;
  };
}

const prisma = new PrismaClient();

export default async function CourseRegistrationPage({ params }: CourseRegistrationPageProps) {
  const { id } = await params;

  const registration = await prisma.courseRegistration.findUnique({
    where: { id },
    include: {
      course: { include: { program: { include: { area: true } }, mainTrainer: true } },
      participant: true,
      invoices: true,
    },
  });

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

  const participantName = registration.participant.name.replace(/\s+/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const certificateFilename = `certificate_${participantName}_${dateStr}.pdf`;
  const kursRegelnFilename = `KursRegeln_${participantName}_${dateStr}.pdf`;
  const teilnahmebestaetigungFilename = `Teilnahmebestaetigung_${participantName}_${dateStr}.pdf`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-2xl py-8 px-4">
        {/* Navigation */}
        <div className="flex gap-4 mb-6">
          <Link href="/course" className="text-blue-500 hover:underline">
            &larr; Back to Courses
          </Link>
          <Link href="/" className="text-blue-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>

        {/* Participant Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{registration.participant.name}</h2>

          <div className="mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Course:</span> {registration.course?.program?.name ?? 'N/A'}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Trainer:</span> {registration.course?.mainTrainer?.name ?? 'N/A'}
            </div>
          </div>

          {/* Button Section - Equal Row Height */}
          <div className="space-y-3">
            {/* Certificate Row */}
            <div className="flex items-center justify-between bg-blue-50 rounded px-4 py-3 h-14">
              <span className="font-medium text-blue-700 truncate">Certificate PDF</span>
              <div className="flex-shrink-0">
                <DownloadPDFButton
                  registration={registration}
                  documentType="certificate"
                  filename={certificateFilename}
                />
              </div>
            </div>

            {/* Kursregeln Row */}
            <div className="flex items-center justify-between bg-emerald-50 rounded px-4 py-3 h-14">
              <span className="font-medium text-emerald-700 truncate">Kursregeln PDF</span>
              <div className="flex-shrink-0">
                <DownloadPDFButton
                  registration={registration}
                  documentType="KursRegeln"
                  filename={kursRegelnFilename}
                />
              </div>
            </div>

            {/* Teilnahmebestätigung Row */}
            <div className="flex items-center justify-between bg-yellow-50 rounded px-4 py-3 h-14">
              <span className="font-medium text-yellow-700 truncate">Teilnahmebestätigung PDF</span>
              <div className="flex-shrink-0">
                <DownloadPDFButton
                  registration={registration}
                  documentType="Teilnahmebestaetigung"
                  filename={teilnahmebestaetigungFilename}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
