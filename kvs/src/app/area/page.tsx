import { PrismaClient } from '../../../generated/prisma/client'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const prisma = new PrismaClient()

async function getAreasWithPrograms() {
  // Fetch areas, their programs, and for each program, fetch courses and registrations
  const areas = await prisma.area.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      programs: {
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          course: {
            select: {
              id: true,
              registrations: { select: { id: true } }
            }
          }
        }
      }
    }
  })

  // For each area, calculate total courses and total participants
  return areas.map(area => {
    let courseCount = 0
    let participantCount = 0
    area.programs.forEach(program => {
      courseCount += program.course.length
      program.course.forEach(course => {
        participantCount += course.registrations.length
      })
    })
    return {
      ...area,
      courseCount,
      participantCount
    }
  })
}

export default async function AreasPage() {
  const areas = await getAreasWithPrograms()

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Areas</h1>
          <div className="flex gap-2">
            <Link
              href="/area/new"
              className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              title="Add New Area"
              aria-label="Add New Area"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/"
              className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              title="Back to Home"
              aria-label="Back to Home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/area/deleted"
              className="p-2 rounded-md bg-red-100 text-gray-700 hover:bg-red-200 transition"
              title="Deleted Areas"
              aria-label="Deleted Areas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
        {/* Areas Table */}
        <div className="shadow border border-gray-200 overflow-hidden bg-white rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-600 hover:bg-gray-600 border-b border-gray-200">
                <TableHead className="py-4 px-3 text-gray-100 font-semibold text-base">Area</TableHead>
                <TableHead className="py-4 px-3 text-gray-100 font-semibold text-base text-center">Programs</TableHead>
                <TableHead className="py-4 px-3 text-gray-100 font-semibold text-base text-center">Courses</TableHead>
                <TableHead className="py-4 px-3 text-gray-100 font-semibold text-base text-center">Participants</TableHead>
                <TableHead className="py-4 px-3 text-gray-100 font-semibold text-base text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-400">
                    No areas found.
                  </TableCell>
                </TableRow>
              ) : (
                areas.map((area, idx, arr) => (
                  <TableRow
                    key={area.id}
                    className={`transition-colors ${
                      idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                    } hover:bg-blue-50 ${
                      idx !== arr.length - 1 ? "border-b border-gray-200" : ""
                    }`}
                  >
                    <TableCell className="py-3 px-3 text-gray-800 pl-2">
                      <Link href={`/area/${area.id}`} className="text-blue-700 hover:underline">
                        {area.name}
                      </Link>
                    </TableCell>
                    <TableCell className="py-3 px-3 text-gray-800 text-center">{area.programs.length}</TableCell>
                    <TableCell className="py-3 px-3 text-gray-800 text-center">{area.courseCount}</TableCell>
                    <TableCell className="py-3 px-3 text-gray-800 text-center">{area.participantCount}</TableCell>
                    <TableCell className="py-3 px-3 text-gray-800 text-center">
                      <div className="flex justify-center gap-1">
                        <Link
                          href={`/area/${area.id}/edit`}
                          className="p-2 rounded hover:bg-blue-100 text-blue-600 transition"
                          title="Edit"
                          aria-label="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <form action={deleteArea}>
                          <input type="hidden" name="id" value={area.id} />
                          <button
                            type="submit"
                            className="p-2 rounded hover:bg-red-100 text-red-600 transition"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
