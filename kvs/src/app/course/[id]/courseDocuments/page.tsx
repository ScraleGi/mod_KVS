import Link from "next/link"
import { db } from "@/lib/db"
import { sanitize } from "@/lib/sanitize"
import { ClientGenerateCourseDocuments } from "./ClientGenerateCourseDocuments"
import type { SanitizedRegistration, SanitizedCourse } from "@/types/query-models"
import { getAuthorizing } from "@/lib/getAuthorizing"
import { redirect } from "next/navigation"

export default async function CourseDocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  // Check user authorization
    const roles = await getAuthorizing({
      privilige: ['ADMIN', 'PROGRAMMMANAGER', 'RECHNUNGSWESEN'],
    })
  
    if (roles.length === 0) {
      redirect('/403')
    }
  const { id } = await params;

  const course = await db.course.findUnique({
    where: { id },
    include: {
      program: true,
      registrations: {
        where: { deletedAt: null },
        include: { participant: true },
      },
      mainTrainer: true,
    },
  });

  if (!course) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-red-600 mb-4">Kurs nicht gefunden</h1>
        <Link href="/course" className="text-blue-500 hover:underline">
          &larr; Zurück zur Kursliste
        </Link>
      </div>
    );
  }

  // Cast sanitized data to the correct types
  const sanitizedRegistrations = sanitize(course.registrations) as unknown as SanitizedRegistration[];
  const sanitizedCourse = sanitize(course) as unknown as SanitizedCourse;

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-8">
        <ClientGenerateCourseDocuments
          registrations={sanitizedRegistrations}
          courseName={sanitizedCourse.program?.name || sanitizedCourse.code || ""}
          courseId={sanitizedCourse.id}
          course={sanitizedCourse}
        />
        <div className="mt-8">
          <Link href={`/course/${course.id}`} className="text-blue-500 hover:underline text-sm">
            &larr; Zurück zum Kurs
          </Link>
        </div>
      </div>
    </div>
  );
}