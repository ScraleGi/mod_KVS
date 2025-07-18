import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { CourseTable, participantColumns, ParticipantRow } from "@/components/overviewTable/table"
import { AddParticipantButton } from "@/components/participants/buttonAddParticipant"
import ParticipantToaster from './[id]/ParticipantToaster'
import Link from 'next/link'
import { getAuthorizing } from '@/lib/getAuthorizing'
import { redirect } from "next/navigation";
import TableTopButton from '@/components/navigation/TableTopButton'

//---------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------
export default async function ParticipantOverviewPage() {
  // Check user authorization
      const roles = await getAuthorizing({
        privilige: ['ADMIN', 'PROGRAMMMANAGER', 'RECHNUNGSWESEN', 'MARKETING'],
      })
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


      if (roles.length === 0) {
        redirect('/403') // Redirect to 403 if no roles found
      }


    //---------------------------------------------------
    // RENDER UI
    //---------------------------------------------------
    return (
      <div className="container mx-auto py-8 px-4">
        <ParticipantToaster />
        <TableTopButton
          title="Teilnehmer Übersicht"
          button2="/"
          button3="/participant/deleted"
        >
          <AddParticipantButton />
        </TableTopButton>

        <CourseTable<ParticipantRow>
          data={data}
          columns={participantColumns}
          filterColumn="name"
        />
      </div>
    )
}