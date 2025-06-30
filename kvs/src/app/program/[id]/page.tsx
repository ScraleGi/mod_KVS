import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '../../../../generated/prisma/client';

interface ProgramPageProps {
    params: {
        id: string;
    }
}

const prisma = new PrismaClient();

export default async function ProgramPage({ params }: ProgramPageProps) {
    const { id } = await params;

    // Fetch program data, area, and courses with mainTrainer and registrations
    const program = await prisma.program.findUnique({
        where: { id },
        include: {
            area: { select: { name: true } },
            course: {
                include: {
                    mainTrainer: true,
                    registrations: {
                        include: { participant: true }
                    }
                },
                orderBy: { startDate: 'asc' }
            }
        }
    });

    if (!program) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Link href="/program" className="text-blue-500 hover:underline mb-6 block">
                    &larr; Back to Programs
                </Link>
                <div className="text-red-600 text-lg font-semibold">Program not found.</div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="container mx-auto py-8 px-4">
                {/* Horizontal links at the top */}
                <div className="flex justify-left gap-6 mb-8">
                    <Link href="/program" className="text-blue-500 hover:underline">
                        &larr; Back to Programs
                    </Link>
                    <Link href="/area" className="text-blue-500 hover:underline">
                        &larr; Back to Areas
                    </Link>
                </div>

                <h1 className="text-3xl font-bold mb-6">{program.name}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">

                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <p className="text-gray-600 mb-4">Program ID: {program.id}</p>
                            <div className="flex items-center mb-4">
                                <span className="font-semibold mr-2">Area:</span>
                                <span>{program.area?.name ?? 'Unknown'}</span>
                            </div>
                            <div className="flex items-center mb-4">
                                <span className="font-semibold mr-2">Teaching Units:</span>
                                <span>{program.teachingUnits ?? 'N/A'}</span>
                            </div>
                            <div className="flex items-center mb-4">
                                <span className="font-semibold mr-2">Price:</span>
                                <span>{program.price != null ? `€${program.price.toFixed(2)}` : 'N/A'}</span>
                            </div>
                            <div className="flex items-center mb-4">
                                <span className="font-semibold mr-2">Created At:</span>
                                <span>{new Date(program.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        
                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">Program Description</h2>
                            <p className="mb-4">{program.description || 'No description provided.'}</p>
                        </div>

                        {/* --- Courses List --- */}
                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">Courses for this Program</h2>
                            {program.course.length === 0 ? (
                                <div className="text-gray-400 italic">No courses for this program.</div>
                            ) : (
                                <ul className="space-y-4">
                                    {program.course.map(course => (
                                        <li key={course.id}>
                                            <Link
                                                href={`/course/${course.id}`}
                                                className="block p-4 rounded-lg border border-gray-200 hover:shadow-md transition group"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                                    <div>
                                                        <span className="text-lg font-semibold text-blue-700 group-hover:underline">
                                                            {program.name}
                                                        </span>
                                                        <div className="text-gray-500 text-sm">
                                                            <span className="font-semibold">Start Date:</span>{" "}
                                                            {course.startDate ? new Date(course.startDate).toLocaleDateString() : "N/A"}
                                                        </div>
                                                        <div className="text-gray-500 text-sm">
                                                            <span className="font-semibold">Main Trainer:</span>{" "}
                                                            {course.mainTrainer?.name || "N/A"}
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 md:mt-0">
                                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                            Participants: {course.registrations.filter(r => r.participant).length}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {/* --- End Courses List --- */}
                    </div>
                </div>
            </div>
        </div>
    );
}