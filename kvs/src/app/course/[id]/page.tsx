import React from 'react'
import Link from 'next/link'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { Course } from '@/types/models'
import { formatFullName, formatDateGerman } from '@/lib/utils'

/**
 * Props interface for the course detail page
 */
interface CoursePageProps {
  params: {
    id: string
  }
}

/**
 * Extended Course type with nested relations for the detailed view
 */
interface CourseWithRelations extends Omit<Course, 'program' | 'mainTrainer' | 'trainers' | 'registrations'> {
  program: {
    name: string;
    area: {
      name: string;
    } | null;
  } | null;
  mainTrainer: {
    name: string;
    surname: string;
    title?: string | null;
  } | null;
  trainers: {
    name: string;
    surname: string;
    title?: string | null;
  }[];
  registrations: {
    id: string;
    participant: {
      name: string;
      surname: string;
    } | null;
    invoices: {
      id: string;
      invoiceNumber: string;
      dueDate: Date | null;
    }[];
    generatedDocuments: {
      id: string;
      file: string;
      role: string;
      createdAt: Date;
    }[];
  }[];
}

/**
 * Format date to German locale format (DD.MM.YYYY)
 */

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params

  // Fetch course with related data, including generatedDocuments for each registration
  const courseData = await db.course.findUnique({
    where: { id },
    include: {
      program: { include: { area: true } },
      mainTrainer: true,
      trainers: true,
      registrations: {
        include: {
          participant: true,
          invoices: true,
          generatedDocuments: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' }
          }
        },
      },
    },
  })

  // Sanitize data to handle any Decimal values
  const course = sanitize<typeof courseData, CourseWithRelations>(courseData)

  // Show error if course not found
  if (!course) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Link href="/" className="text-blue-500 hover:underline mb-6 block">
          &larr; Back to Home
        </Link>
        <div className="text-red-600 text-lg font-semibold">Course not found.</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container mx-auto py-8 px-4">
        {/* Navigation links */}
        <div className="flex justify-left gap-6 mb-8">
          <Link href="/course" className="text-blue-500 hover:underline">
            &larr; Back to Courses
          </Link>
          <Link href="/" className="text-blue-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">{course.program?.name ?? 'Course'}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main course details and participants */}
          <div className="md:col-span-2">
            {/* Course information card */}
            <div className="bg-white shadow rounded-lg p-6 mb-6 flex flex-col md:flex-row md:gap-8">
              <div className="flex-1">
                {/* Course Code */}
                <div className="flex items-center mb-4">
                  <span className="font-semibold mr-2">Code:</span>
                  <span>{course.code ?? 'N/A'}</span>
                </div>
                {/* Area information */}
                <div className="flex items-center mb-4">
                  <span className="font-semibold mr-2">Area:</span>
                  <span>{course.program?.area?.name ?? 'Unknown'}</span>
                </div>
                
                {/* Trainer information */}
                <div className="flex items-center mb-4">
                  <span className="font-semibold mr-2">Trainer:</span>
                  <span>
                    {course.mainTrainer
                      ? formatFullName(course.mainTrainer)
                      : 'N/A'}
                  </span>
                  {course.trainers && course.trainers.length > 0 && (
                    <span className="ml-2 text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">
                      Additional: {course.trainers.map(t => formatFullName(t)).join(', ')}
                    </span>
                  )}
                </div>
                
                {/* Date information */}
                <div className="flex items-center mb-4">
                  <span className="font-semibold mr-2">Start Date:</span>
                  <span>{formatDateGerman(course.startDate)}</span>
                </div>
                <div className="flex items-center mb-4">
                  <span className="font-semibold mr-2">End Date:</span>
                  <span>{formatDateGerman(course.endDate)}</span>
                </div>
                
                {/* Registration count */}
                <div className="flex items-center mb-4">
                  <span className="font-semibold mr-2">Registrations:</span>
                  <span>{course.registrations.length}</span>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col gap-2 md:w-48 w-full mt-4 md:mt-0">
                <button
                  type="button"
                  className="cursor-pointer w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded border border-blue-200 shadow-sm transition text-sm"
                >
                  Generate Diplom
                </button>
                <button
                  type="button"
                  className="cursor-pointer w-full px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded border border-emerald-200 shadow-sm transition text-sm"
                >
                  Generate Invoice
                </button>
              </div>
            </div>

            {/* Participants list */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Participants</h2>
              {course.registrations.length === 0 ? (
                <p className="text-gray-500">No participants registered.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {course.registrations.map(reg => (
                    <li
                      key={reg.id}
                      className="py-4 flex flex-col md:flex-row md:items-start md:gap-6"
                    >
                      {/* Participant Name */}
                      <div className="md:w-1/4 w-full mb-2 md:mb-0">
                        <Link
                          href={`/courseregistration/${reg.id}`}
                          className="font-semibold text-blue-600 hover:text-blue-800"
                        >
                          {reg.participant
                            ? `${reg.participant.name} ${reg.participant.surname ?? ''}`
                            : 'Unknown'}
                        </Link>
                      </div>
                      
                      {/* Invoices */}
                      <div className="md:w-1/3 w-full mb-2 md:mb-0 text-sm text-gray-600">
                        <span className="font-semibold">Invoice(s): </span>
                        {reg.invoices.length
                          ? reg.invoices.map((inv, idx) => (
                              <React.Fragment key={inv.id}>
                                <Link
                                  href={`/invoice/${inv.id}`}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  #{inv.invoiceNumber}
                                </Link>
                                {inv.dueDate && (
                                  <span className="ml-1 text-xs text-gray-500">
                                    (Fällig: {formatDateGerman(inv.dueDate)})
                                  </span>
                                )}
                                {idx < reg.invoices.length - 1 && ", "}
                              </React.Fragment>
                            ))
                          : "No invoices"}
                      </div>
                      
                      {/* Documents */}
                      <div className="md:w-1/3 w-full text-sm text-gray-600">
                        <span className="font-semibold">Document(s): </span>
                        {reg.generatedDocuments && reg.generatedDocuments.length > 0 ? (
                          reg.generatedDocuments.map((doc, idx) => (
                            <React.Fragment key={doc.id}>
                              <a
                                href={doc.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                {doc.file.split('/').pop()}
                              </a>
                              <span className="ml-1 text-xs text-gray-500">({doc.role})</span>
                              {doc.createdAt && (
                                <span className="ml-1 text-xs text-gray-400">
                                  [{formatDateGerman(doc.createdAt)}]
                                </span>
                              )}
                              {idx < reg.generatedDocuments.length - 1 && ", "}
                            </React.Fragment>
                          ))
                        ) : (
                          "No documents"
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}