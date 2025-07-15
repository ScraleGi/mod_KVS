import Link from 'next/link';
import { redirect } from 'next/navigation';
import { EditLabel } from '@/components/trainer/EditLabel';
import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

type User = {
    id: string;
    email: string;
    roles: { name: string }[];
};


export default async function EditUserPage({ params, }: { params: { id: string }; }) {
    const { id } = params;
    const user = await prisma.user.findUnique({
        where: { id },
        include: { roles: true },
    }) as User | null;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow text-center">
                    <h2 className="text-xl font-bold mb-4">Benutzer nicht gefunden</h2>
                    <Link href="/user" className="text-blue-600 hover:underline">Zurück zur Übersicht</Link>
                </div>
            </div>
        );
    }

    // Server action to update the trainer in the database
    const changeUser = async (formData: FormData) => {
        'use server';
        const id = formData.get('id') as string;
        const email = formData.get('email') as string;
        const roles = formData.get('roles') as string;

        await prisma.user.update({
            where: { id },
            data: {
                email,
                roles: {
                    set: roles.split(',').map(role => ({ name: role.trim() })),
                },
            },
        });
        redirect(`/user/${id}?edited=1`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-2 py-8">
            <div className="w-full max-w-xl mx-auto">
                <nav className="max-w-xl mx-auto mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
                    <Link href="/trainer" className="hover:underline text-gray-700">Trainer</Link>
                    <span>&gt;</span>
                    <Link href={`/trainer/${user.id}`} className="text-gray-700 hover:underline">{user.email}</Link>
                    <span>&gt;</span>
                    <span className="text-gray-700 font-semibold">Trainer bearbeiten</span>
                </nav>
            </div>
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-neutral-100 p-8">

                <h1 className="text-2xl font-bold mb-6 text-neutral-900 text-center">Trainer bearbeiten</h1>
                <form
                    action={changeUser}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="hidden" name="id" value={user.id} />
                        <EditLabel
                            labelName="Email"
                            name="email"
                            value={user.email}
                        />
                        <EditLabel
                            labelName="Rollen"
                            name="roles"
                            value={user.roles.map(role => role.name).join(', ')} // Assuming roles is an array of objects with a 'name' property
                            type="select"
                            options={[
                                { value: 'ADMIN', label: 'Admin' },
                                { value: 'PROGRAMMMANAGER', label: 'Programmmanager' },
                                { value: 'TRAINER', label: 'Trainer' },
                                { value: 'RECHNUNGSWESEN', label: 'Rechnungswesen' },
                                { value: 'MARKETING', label: 'Marketing' }
                            ]}
                        />
                    </div>
                    <div className="flex justify-between mt-6">
                        <Link
                            href={`/user/${user.id}`}
                            className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 text-xs font-medium transition"
                        >
                            Abbrechen
                        </Link>
                        <button
                            type="submit"
                            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition"
                        >
                            Speichern
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


