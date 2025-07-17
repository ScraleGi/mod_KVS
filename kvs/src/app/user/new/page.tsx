import { PrismaClient } from "../../../../generated/prisma";
import { redirect } from 'next/navigation';
import { EditLabel } from "../../../components/trainer/EditLabel";
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function NewUserPage() {
    const createUser = async (formData: FormData) => {
        'use server';
        const email = formData.get('email') as string;
        const roles = formData.get('roles') as string;

        const user = await prisma.user.create({
            data: {
                email,
                roles: {
                    connect: { name: roles.trim() },
                },
            }
        });

        redirect(`/user/${user.id}?created=1`);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-2 py-8">
            <div className="w-full max-w-xl mx-auto">
                <nav className="mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
                    <Link href="/user" className="hover:underline text-gray-700">Benutzer</Link>
                    <span>&gt;</span>
                    <span className="text-gray-700 font-semibold">Benutzer hinzufügen</span>
                </nav>
            </div>

            <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-neutral-100 p-8">
                <h1 className="text-2xl font-bold mb-6 text-neutral-900 text-center">Benutzer hinzufügen</h1>
                <form
                    action={createUser}
                    className="space-y-6"
                >
                    <EditLabel
                        labelName="E-Mail"
                        name="email"
                        value=""
                        type="email"
                        required
                    />
                    <EditLabel
                        labelName="Rollen"
                        name="roles"
                        value=""
                        type="select"
                        options={[
                                { value: 'ADMIN', label: 'Admin' },
                                { value: 'PROGRAMMMANAGER', label: 'Programmmanager' },
                                { value: 'TRAINER', label: 'Trainer' },
                                { value: 'RECHNUNGSWESEN', label: 'Rechnungswesen' },
                                { value: 'MARKETING', label: 'Marketing' }
                            ]}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Benutzer erstellen
                    </button>
                </form>
            </div>
        </div>
    );
}