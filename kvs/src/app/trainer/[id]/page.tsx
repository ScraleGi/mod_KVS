import { PrismaClient } from "../../../../generated/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info, GraduationCap, Pencil } from "lucide-react";
import { redirect } from "next/navigation";
import RemoveButton from "@/components/RemoveButton/RemoveButton";
import { formatDateGerman } from '@/lib/utils'
import TrainerToaster from './TrainerToaster';
import { getAuthorizing } from "@/lib/getAuthorizing";

const prisma = new PrismaClient();

export default async function TrainerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // Check user authorization
  const roles = await getAuthorizing({
    privilige: ['ADMIN', 'PROGRAMMMANAGER'],
  })
    if (roles.length === 0) {
        redirect('/403')
    }
    const { id } = await params;
    const trainer = await prisma.trainer.findUnique({
        where: { id, deletedAt: null },
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

    // Server action soft-delete the trainer
    async function deleteTrainer(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        const now = new Date()

        await prisma.trainer.update({
            where: { id },
            data: { deletedAt: now }
        })

        redirect('/trainer/deleted?deleted=1')
    }

    if (!trainer) return notFound();

    return (
        <div className="min-h-screen bg-[#f8fafd] py-14 px-4">
            <TrainerToaster />
            <nav className="max-w-xl mx-auto mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
                <Link href="/trainer" className="hover:underline text-gray-700">Trainers</Link>
                <span>&gt;</span>
                <span className="text-gray-700 font-semibold">{trainer.name} {trainer.surname}</span>
            </nav>
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg pt-8 relative">
                <Link
                href={`/trainer/${trainer.id}/edit`}
                className="absolute top-6 right-6 z-20 text-gray-400 hover:text-blue-600 transition flex items-center justify-center p-2 rounded-full"
                title="Edit Trainer"
                >
                <Pencil className="w-5 h-5 cursor-pointer pointer-events-auto block" />
                </Link>




                <div className="mx-6">
                   <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 drop-shadow-sm">{trainer.title} {trainer.name} {trainer.surname}</h1>

                <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center mb-8">
                    <span className="text-gray-400">[Image Placeholder]</span>
                </div>
                <div className="mb-10">
                    <h2 className="text-xl font-bold mb-2 text-gray-600 flex items-center gap-2">
                        <Info className="w-5 h-5 text-gray-400" />
                        Kontakt
                    </h2>
                    <div className="text-gray-700 text-base ml-7">
                        Email: {trainer.email || 'N/A'}<br />
                        Tel: {trainer.phoneNumber || 'N/A'}<br />
                        Addresse: {trainer.street || 'No address provided.'}
                        {trainer.postalCode && trainer.city ? (
                            <span>, {trainer.postalCode} {trainer.city}</span>
                        ) : (
                            <span className="text-gray-500">Keine Stadt oder PLZ angegeben.</span>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4 text-gray-600 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-gray-400" />
                        Hauptkurse
                    </h2>
                    <div className="ml-7">
                        {trainer.mainCourses.length > 0 ? (
                            trainer.mainCourses.map(course => (
                                <div key={course.id} className="text-gray-700">
                                    {course.program?.name || 'N/A'} - {formatDateGerman(course.startDate)}
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500">Keine Hauptkurse zugeteilt.</div>
                        )}
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-600 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-gray-400" />
                        Nebenkurse
                    </h2>
                    <div className="ml-7">
                        {trainer.courses.length > 0 ? (
                            trainer.courses.map(course => (
                                <div key={course.id} className="text-gray-700">
                                    {course.program?.name || 'N/A'} - {formatDateGerman(course.startDate)}
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500">Keine Hauptkurse zugeteilt.</div>
                        )}
                    </div>
                </div>
                </div>

                {/* Danger Zone Section */}
                <div className="border-t border-gray-200 rounded-2xl mt-2">
                <div className="py-4 bg-gray-50 w-full">
                    <div className="flex items-center justify-between mx-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700">Archiv</h3>
                            <p className="text-xs text-gray-500 mt-1">In Ablage verwahren.</p>
                        </div>
                        <RemoveButton
                            itemId={trainer.id}
                            onRemove={deleteTrainer}
                            title="Delete Trainer"
                            message="Are you sure you want to archive this trainer?"
                            fieldName="id"
                            customButton={
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 cursor-pointer bg-white border border-red-300 rounded text-sm text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-30"
                                >
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                        Archivieren
                                    </div>
                                </button>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}