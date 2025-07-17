import { db } from '@/lib/db';
import Link from 'next/link';
import { Pencil, Info } from 'lucide-react';


export default async function PrivilegesDetailsPage ({ params }: { params: Promise<{ id: string }> }) {
    const user = await params;
    if (!user || !user.id) {
        return <div>Invalid user ID</div>;
    }
    const idUser= user.id;
    const userId = await db.user.findUnique({
        where: { id: idUser },
        include: {
            roles: true, // Include roles in the query
        },
    });

    if (!userId) {
        return <div>User not found</div>;
    }
    const roles = userId.roles.map(role => role.name).join(', '); // Join roles into a string
    return (
        <div className="min-h-screen bg-[#f8fafd] py-14 px-4">
            <nav className="max-w-xl mx-auto mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
                <Link href="/user" className="hover:underline text-gray-700">Benutzer</Link>
                <span>&gt;</span>
                <span className="text-gray-700 font-semibold">{userId.email}</span>
            </nav>
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg px-6 py-8 relative">
                <Link
                    href={`/user/${userId.id}/edit`}
                    className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 transition"
                    title="Edit Trainer"
                >
                    <Pencil className="w-5 h-5 cursor-pointer" />
                </Link>

                <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 drop-shadow-sm">{userId.email}</h1>

                <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center mb-8">
                    <span className="text-gray-400">[Image Placeholder]</span>
                </div>

                <div className="mb-10">
                    <h2 className="text-xl font-bold mb-2 text-gray-600 flex items-center gap-2">
                        <Info className="w-5 h-5 text-gray-400" />
                        Rollen
                    </h2>
                    <div className="text-gray-700 text-base ml-7">
                        {roles ? (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                {roles}
                            </span>
                        ) : (
                            <span className="text-red-500">Keine Rollen zugewiesen</span>
                        )}
                    </div>
                </div>
                

                {/* Danger Zone Section */}
                <div className="border-t border-gray-200 mt-2"></div>
                {/* <div className="ml-1 mt-1 px-6 py-4 bg-gray-50 rounded-b-sm">
                    <div className="flex items-center justify-between">
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
                </div> */}
            </div>
        </div>
    );
}