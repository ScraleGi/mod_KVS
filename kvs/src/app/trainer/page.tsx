import { PrismaClient } from "../../../generated/prisma";
import { CourseTable, TrainerRow, trainerColumns } from "@/components/overviewTable/table";
import Link from "next/link";
import TrainerToaster from './[id]/TrainerToaster';
import { redirect } from "next/navigation";
import { getAuthorizing } from "@/lib/getAuthorizing";
import TableTopButton from '@/components/navigation/TableTopButton'


export default async function TrainerPage() {
    // Check user authorization
      const roles = await getAuthorizing({
        privilige: ['ADMIN', 'PROGRAMMMANAGER'],
      })
    
      if (roles.length === 0) {
        redirect('/403')
      }

    const prisma = new PrismaClient();

    // Fetch trainers with related data
    const trainers = await prisma.trainer.findMany({
        where: {
            deletedAt: null, // Filter out deleted trainers
        },
        include: {
            mainCourses: {
                select: {
                    id: true,
                    program: true,
                    startDate: true,
                },
            },
            courses: {
                select: {
                    id: true,
                    program: true,
                    startDate: true,
                },
            },
        },
    });

    // Transform data for the table
    const tableData: TrainerRow[] = trainers.map(trainer => ({
        id: trainer.id,
        name: trainer.name ?? 'N/A',
        surname: trainer.surname ?? '',
        email: trainer.email ?? '',
        phoneNumber: trainer.phoneNumber ?? '',
        mainCourses: trainer.mainCourses?.map(course => ({
            id: course.id,
            name: course.program?.name ?? 'N/A',
            startDate: course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A',
        })) ?? [],
        courses: trainer.courses?.map(course => ({
            id: course.id,
            name: course.program?.name ?? 'N/A',
            startDate: course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A',
        })) ?? [],
    }));

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
            <TrainerToaster />
            {/* Header */}
            <TableTopButton
                title="Trainer Übersicht"
                button1="/trainer/new"
                button2="/"
                button3="/trainer/deleted"
            />
            <CourseTable
                data={tableData} columns={trainerColumns} />
        </div>
    )
}