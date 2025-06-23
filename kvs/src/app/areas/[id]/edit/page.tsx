import { PrismaClient } from '../../../../../generated/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const prisma = new PrismaClient();
interface EditAreaPageProps {
    params: {
        id: string;
    };
}

export default async function EditAreaPage({ params }: EditAreaPageProps) {
    const changeArea = async (formData: FormData) => {
        'use server';
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        await prisma.area.update({
            where: { id },
            data: { name },
        });
        redirect('/areas');
    }
    
    const { id } = await params;
    const area = await prisma.area.findUnique({
        where: { id },
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
                <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
                    <div className="px-8 py-10">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 tracking-tight">
                            Edit Area
                        </h1>
                        
                        <form action={changeArea} className="space-y-8">
                            <input type="hidden" name="id" value={id} />
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                                    Name
                                </label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        defaultValue={area?.name || ''}
                                        className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                                        placeholder="Enter area name"
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-2 flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Save Changes
                                </button>
                                
                                <Link
                                    href="/areas"
                                    className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Areas
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}