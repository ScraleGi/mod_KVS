import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '../../../../generated/prisma/client';

interface CoursePageProps {
    params: {
        id: string;
    }
}

const prisma = new PrismaClient();

export default async function CoursePage({ params }: CoursePageProps) {
    // Await params before using its properties (Next.js 15+ requirement)
    const { id } = await params;

    // Fetch course data from the database, including its area
    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            area: { select: { name: true } }
        }
    });

    if (!course) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Link href="/courses" className="text-blue-500 hover:underline mb-6 block">
                    &larr; Back to Courses
                </Link>
                <div className="text-red-600 text-lg font-semibold">Course not found.</div>
            </div>
        );
    }

// ...existing code above...
    return (
        <div className="container mx-auto py-8 px-4">
            {/* Horizontal links at the top */}
            <div className="flex justify-left gap-6 mb-8">
                <Link href="/courses" className="text-blue-500 hover:underline">
                    &larr; Back to Courses
                </Link>
                <Link href="/areas" className="text-blue-500 hover:underline">
                    &larr; Back to Areas
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-6">{course.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    {/* Course image placeholder */}
                    <div className="w-full h-56 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                        <span className="text-gray-400 text-lg">Course Image Placeholder</span>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <p className="text-gray-600 mb-4">Course ID: {course.id}</p>
                        <div className="flex items-center mb-4">
                            <span className="font-semibold mr-2">Area:</span>
                            <span>{course.area?.name ?? 'Unknown'}</span>
                        </div>
                        <div className="flex items-center mb-4">
                            <span className="font-semibold mr-2">Teaching Units:</span>
                            <span>{course.teachingUnits ?? 'N/A'}</span>
                        </div>
                        <div className="flex items-center mb-4">
                            <span className="font-semibold mr-2">Price:</span>
                            <span>{course.price != null ? `€${course.price.toFixed(2)}` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center mb-4">
                            <span className="font-semibold mr-2">Created At:</span>
                            <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">Course Description</h2>
                        <p className="mb-4">{course.description || 'No description provided.'}</p>
                    </div>
                </div>
                
                <div className="md:col-span-1 flex flex-col gap-6">
                    <div className="bg-white shadow rounded-lg p-6 sticky top-6">
                        <h2 className="text-xl font-bold mb-4">Enroll Now</h2>
                        <p className="text-2xl font-bold mb-4">
                            {course.price != null ? `€${course.price.toFixed(2)}` : 'N/A'}
                        </p>
                        <button className="cursor-pointer w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                            Add to Cart
                        </button>
                        <button className="cursor-pointer w-full mt-2 border border-blue-600 text-blue-600 py-2 px-4 rounded hover:bg-blue-50">
                            Enroll Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
