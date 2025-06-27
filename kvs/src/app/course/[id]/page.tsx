import React from 'react'
import Link from 'next/link'
import { PrismaClient } from '../../../../generated/prisma/client'

interface CoursePageProps {
  params: {
    id: string
  }
}

const prisma = new PrismaClient()

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params

  // Fetch course with related data
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      program: { include: { area: true } },
      mainTrainer: true,
      trainers: true,
      registrations: {
        include: {
          participant: true,
          invoices: true,
        },
      },
    },
  })

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
        {/* Horizontal links at the top */}
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
          <div className="md:col-span-2">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <p className="text-gray-600 mb-4">Course ID: {course.id}</p>
              <div className="flex items-center mb-4">
                <span className="font-semibold mr-2">Program:</span>
                <span>{course.program?.name ?? 'Unknown'}</span>
              </div>
              <div className="flex items-center mb-4">
                <span className="font-semibold mr-2">Area:</span>
                <span>{course.program?.area?.name ?? 'Unknown'}</span>
              </div>
              <div className="flex items-center mb-4">
                <span className="font-semibold mr-2">Trainer:</span>
                <span>{course.mainTrainer?.name ?? 'N/A'}</span>
              {/* Optionally show additional trainers */}
              {course.trainers && course.trainers.length > 0 && (
                <span className="ml-2 text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">
                  Additional: {course.trainers.map(t => t.name).join(', ')}
                </span>
              )}
              </div>
              <div className="flex items-center mb-4">
                <span className="font-semibold mr-2">Start Date:</span>
                <span>{course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex items-center mb-4">
                <span className="font-semibold mr-2">Registrations:</span>
                <span>{course.registrations.length}</span>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Participants</h2>
              {course.registrations.length === 0 ? (
                <p className="text-gray-500">No participants registered.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {course.registrations.map(reg => (
                    <li key={reg.id} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <Link
                          href={`/courseregistration/${reg?.id}`}
                          className="font-semibold text-blue-600 underline hover:text-blue-800"
                        >
                          {reg.participant?.name ?? 'Unknown'}
                        </Link>
                        <span className="ml-2 text-gray-500 text-sm">({reg.status})</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Invoice(s):{" "}
                        {reg.invoices.length
                          ? reg.invoices.map((inv, idx) => (
                              <React.Fragment key={inv.id}>
                                <Link
                                  href={`/invoice/${inv.id}`}
                                  className="text-blue-600 underline hover:text-blue-800"
                                >
                                  #{inv.id}: €{inv.amount}
                                </Link>
                                {idx < reg.invoices.length - 1 && ", "}
                              </React.Fragment>
                            ))
                          : "No invoice"}
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