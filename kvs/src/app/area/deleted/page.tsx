import { PrismaClient } from '../../../../generated/prisma/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

// Server action to restore an area and its courses
async function restoreArea(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    // Restore the area
    await prisma.area.update({
        where: { id },
        data: { deletedAt: null }
    })
    // Restore all programs in this area
    await prisma.program.updateMany({
        where: { areaId: id },
        data: { deletedAt: null }
    })
    redirect('/area/deleted')
}

export default async function DeletedAreasPage() {
    // Fetch only soft-deleted areas
    const deletedAreas = await prisma.area.findMany({
        where: { deletedAt: { not: null } },
        orderBy: { deletedAt: 'desc' },
        include: {
            programs: {
                where: { deletedAt: { not: null } },
                select: { id: true, name: true }
            }
        }
    })

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Deleted Areas</h1>
            {deletedAreas.length === 0 ? (
                <p className="text-gray-600">No deleted areas found.</p>
            ) : (
                <ul className="space-y-3">
                    {deletedAreas.map(area => (
                        <li key={area.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-lg shadow">
                            <div>
                                <span className="font-medium text-gray-700">{area.name}</span>
                                {area.programs.length > 0 && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        Courses: {area.programs.map(p => p.name).join(', ')}
                                    </div>
                                )}
                            </div>
                            <form action={restoreArea} className="mt-2 sm:mt-0">
                                <input type="hidden" name="id" value={area.id} />
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
                href="/area" 
                className="mt-6 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
                <span className="mr-2">←</span> Back to Areas
            </Link>
        </div>
    )
}