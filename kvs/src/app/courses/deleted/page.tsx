import { PrismaClient } from '../../../../generated/prisma/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

// Server action to restore a course
async function restoreCourse(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await prisma.course.update({
        where: { id },
        data: { deletedAt: null },
    })
    redirect('/courses/deleted')
}

export default async function DeletedCoursesPage() {
    // Fetch only soft-deleted courses
    const deletedCourses = await prisma.course.findMany({
        where: { deletedAt: { not: null } },
        orderBy: { deletedAt: 'desc' },
    })

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Deleted Courses</h1>
            
            {deletedCourses.length === 0 ? (
                <p className="text-gray-600">No deleted courses found.</p>
            ) : (
                <ul className="space-y-3">
                    {deletedCourses.map(course => (
                        <li key={course.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                            <span className="font-medium text-gray-700">{course.name}</span>
                            <form action={restoreCourse}>
                                <input type="hidden" name="id" value={course.id} />
                                <button 
                                    type="submit" 
                                    className="cursor-pointer px-3 py-1.5 bg-emerald-400 hover:bg-emerald-500 text-white text-sm font-medium rounded-md transition-colors"
                                >
                                    Restore
                                </button>
                            </form>
                        </li>
                    ))}
                </ul>
            )}
            <Link 
                href="/areas" 
                className="mt-6 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
                <span className="mr-2">←</span> Back to Areas
            </Link>
        </div>
    )
}