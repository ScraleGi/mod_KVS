import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

export default async function Page() {
  const courseDates = await prisma.courseDate.findMany({
    include: {
      course: true,
      trainer: true,
      registrations: true,
    },
  })

  return (
    <main>
      <h1>Course Dates</h1>
      <ul>
        {courseDates.map(cd => (
          <li key={cd.id}>
            <strong>Course:</strong> {cd.course?.name} <br />
            <strong>Start Date:</strong> {cd.startDate.toISOString().split('T')[0]} <br />
            <strong>Trainer:</strong> {cd.trainer?.name || 'N/A'} <br />
            <strong>Registrations:</strong> {cd.registrations.length}
          </li>
        ))}
      </ul>
    </main>
  )
}