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
    // Await params before using its properties (Next.js 15+ requirement)
    const { id } = await params;

    // Fetch program data from the database, including its area
    const program = await prisma.program.findUnique({
        where: { id },
        include: {
            area: { select: { name: true } }
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

// ...existing code above...
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
                        {/* Program image placeholder */}
                        <div className="w-full h-56 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                            <span className="text-gray-400 text-lg">Program Image Placeholder</span>
                        </div>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
