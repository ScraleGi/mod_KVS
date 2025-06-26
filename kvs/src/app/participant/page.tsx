import { PrismaClient } from "../../../generated/prisma/client"
import { CourseTable } from "@/components/overviewTable/table"
import { participantColumns, ParticipantRow } from "@/components/overviewTable/participantColumns"

const prisma = new PrismaClient()

export default async function ParticipantOverviewPage() {
  // Fetch all participants with their registrations and courses
    const participants = await prisma.participant.findMany({
    include: {
        registrations: {
        include: {
            course: {
            include: {
                program: true, // <-- Add this line!
            },
            },
        },
        },
    },
    })

  // Prepare data for the table
  const data: ParticipantRow[] = participants.map(p => ({
    id: p.id,
    name: p.name,
    email: p.email,
    phoneNumber: p.phoneNumber,
    courses: p.registrations
    .filter(r => r.course)
    .map(r => ({
        id: r.course.id,
        name: r.course.program.name, // <-- This will show the course name!
    })),
  }))

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Participants Overview</h1>
      <CourseTable data={data} columns={participantColumns} filterColumn="name" />
    </div>
  )
}