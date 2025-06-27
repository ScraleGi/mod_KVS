import { PrismaClient } from "../../../generated/prisma/client"
import { CourseTable } from "@/components/overviewTable/table"
import { participantColumns, ParticipantRow, AddParticipantButton } from "@/components/overviewTable/participantColumns"

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

  // Data loader for the table
const data: ParticipantRow[] = participants.map(p => ({
  id: p.id,
  name: p.name,
  email: p.email,
  phoneNumber: p.phoneNumber,
  courses: p.registrations
    .filter(r => r.course)
    .map(r => ({
      id: r.course.id,
      name: r.course.program.name,
      startDate: r.course.startDate, // <-- Add this line!
    })),
}))

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Participants Overview</h1>
        <AddParticipantButton />
      </div>
      <CourseTable data={data} columns={participantColumns} filterColumn="name" />
    </div>
  )
}