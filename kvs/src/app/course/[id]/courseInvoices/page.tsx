import Link from "next/link"
import { db } from "@/lib/db"
import { sanitize } from "@/lib/sanitize"
import type { SanitizedRegistration, SanitizedCourse } from "@/types/query-models"
import { ClientGenerateCourseInvoices } from "./ClientGenerateCourseInvoices"

export default async function CourseInvoicesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch course, registrations, invoices, and all possible custom recipients for this course
  const course = await db.course.findUnique({
    where: { id },
    include: {
      program: true,
      registrations: {
        where: { deletedAt: null },
        include: {
          participant: true,
          invoices: true,
        },
      },
      mainTrainer: true,
    },
  })



  if (!course) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-red-600 mb-4">Kurs nicht gefunden</h1>
        <Link href="/course" className="text-blue-500 hover:underline">
          &larr; Zurück zur Kursliste
        </Link>
      </div>
    )
  }

  const sanitizedRegistrations = sanitize(course.registrations) as unknown as SanitizedRegistration[]
  const sanitizedCourse = sanitize(course) as unknown as SanitizedCourse

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">
          Rechnungen generieren für {sanitizedCourse.program?.name || sanitizedCourse.code || ""}
        </h1>
        <ClientGenerateCourseInvoices
          registrations={sanitizedRegistrations}
          courseId={sanitizedCourse.id}
        />
        <div className="mt-8">
          <Link href={`/course/${course.id}`} className="text-blue-500 hover:underline text-sm">
            &larr; Zurück zum Kurs
          </Link>
        </div>
      </div>
    </div>
  )
}