import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { CourseTable, participantColumns, ParticipantRow } from "@/components/overviewTable/table"
import { AddParticipantButton } from "@/components/participants/buttonAddParticipant"
import ParticipantToaster from './[id]/ParticipantToaster'
import Link from 'next/link'
import { getAuthorizing } from '@/lib/getAuthorizing'
import { redirect } from "next/navigation";

//---------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------
export default async function ParticipantOverviewPage() {
  //---------------------------------------------------
  // DATA FETCHING
  //---------------------------------------------------
  
    // Fetch only non-deleted participants with their registrations and courses
    const participantsData = await db.participant.findMany({
      where: {
        deletedAt: null  // Only include participants that haven't been soft-deleted
      },
      include: {
        registrations: {
          where: { deletedAt: null }, // Only include active registrations
          include: {
            course: {
              include: {
                program: true,
              },
            },
          },
        },
      },
    })

    // Sanitize data to handle any Decimal values
    const participants = sanitize(participantsData)
    
    // Data loader for the table
    const data: ParticipantRow[] = participants.map(p => ({
      id: p.id,
      name: p.name,
      surname: p.surname,
      email: p.email || '',
      phoneNumber: p.phoneNumber || '',
      courses: p.registrations
        .filter(r => r.course)
        .map(r => ({
          id: r.course.id,
          name: r.course.program?.name || 'Unnamed Program',
          startDate: r.course.startDate,
        })),
    }))

    // Check user authorization
      const roles = await getAuthorizing({
        privilige: ['ADMIN', 'PROGRAMMMANAGER', 'TRAINER', 'RECHNUNGSWESEN', 'MARKETING'],
      })

      if (roles.length === 0) {
        redirect('/403') // Redirect to 403 if no roles found
      }


    //---------------------------------------------------
    // RENDER UI
    //---------------------------------------------------
    return (
      <div className="container mx-auto py-8 px-4">
        <ParticipantToaster />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teilnehmerübersicht</h1>
          <div className="flex items-center space-x-2">
            <AddParticipantButton />
            <Link
              href="/"
              className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              title="Startseite"
              aria-label="Startseite"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/participant/deleted"
              className="p-2 rounded-md bg-red-100 text-gray-700 hover:bg-red-200 transition"
              title="Teilnehmer löschen"
              aria-label="Teilnehmer löschen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M96,208a8,8,0,0,1-8,8H40a24,24,0,0,1-20.77-36l34.29-59.25L39.47,124.5A8,8,0,1,1,35.33,109l32.77-8.77a8,8,0,0,1,9.8,5.66l8.79,32.77A8,8,0,0,1,81,148.5a8.37,8.37,0,0,1-2.08.27,8,8,0,0,1-7.72-5.93l-3.8-14.15L33.11,188A8,8,0,0,0,40,200H88A8,8,0,0,1,96,208Zm140.73-28-23.14-40a8,8,0,0,0-13.84,8l23.14,40A8,8,0,0,1,216,200H147.31l10.34-10.34a8,8,0,0,0-11.31-11.32l-24,24a8,8,0,0,0,0,11.32l24,24a8,8,0,0,0,11.31-11.32L147.31,216H216a24,24,0,0,0,20.77-36ZM128,32a7.85,7.85,0,0,1,6.92,4l34.29,59.25-14.08-3.78A8,8,0,0,0,151,106.92l32.78,8.79a8.23,8.23,0,0,0,2.07.27,8,8,0,0,0,7.72-5.93l8.79-32.79a8,8,0,1,0-15.45-4.14l-3.8,14.17L148.77,28a24,24,0,0,0-41.54,0L84.07,68a8,8,0,0,0,13.85,8l23.16-40A7.85,7.85,0,0,1,128,32Z"/>
              </svg>
            </Link>
          </div>
        </div>
        
        <CourseTable<ParticipantRow> 
          data={data} 
          columns={participantColumns} 
          filterColumn="name" 
        />
      </div>
    )
}