import { PrismaClient } from "../../../../../generated/prisma";
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { EditLabel } from "../../../../components/trainer/EditLabel";

const prisma = new PrismaClient();

interface EditTrainerPageProps {
    params: {
        id: string;
    };
}

export default async function EditTrainerPage({ params }: EditTrainerPageProps) {
    // Server action to update the trainer in the database
    const changeTrainer = async (formData: FormData) => {
        'use server';
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const surname = formData.get('surname') as string;
        const email = formData.get('email') as string;
        const phoneNumber = formData.get('phoneNumber') as string;
        const street = formData.get('street') as string;
        const postalCode = formData.get('postalCode') as string;
        const city = formData.get('city') as string;
        const country = formData.get('country') as string;
        const code = formData.get('code') as string;
        const salutation = formData.get('salutation') as string;
        const birthday = formData.get('birthday') as string;
        const title = formData.get('title') as string | null;

        await prisma.trainer.update({
            where: { id },
            data: {
                name,
                surname,
                email,
                phoneNumber,
                street,
                postalCode,
                city,
                country,
                code,
                salutation,
                birthday: new Date(birthday),
                title: title ? title : null // Assuming title is optional
            }
        });
        redirect(`/trainer/${id}`);
    };

    // Server action soft-delete the trainer
    async function deleteTrainer(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        const now = new Date()

        await prisma.trainer.update({
            where: { id },
            data: { deletedAt: now }
        })

        redirect('/trainer')
    }

    const { id } = await params;
    const trainer = await prisma.trainer.findUnique({
        where: { id },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-2 py-8">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-neutral-100 p-8">

                <h1 className="text-2xl font-bold mb-6 text-neutral-900 text-center">Trainer bearbeiten</h1>
                <form
                    action={changeTrainer}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="hidden" name="id" value={trainer?.id} />
                        <EditLabel
                            labelName="Code"
                            name="code"
                            value={trainer?.code}
                        />
                        <EditLabel
                            labelName="Anrede"
                            name="salutation"
                            value={trainer?.salutation}
                            type="select"
                            options={[
                                { value: 'Herr', label: 'Herr' },
                                { value: 'Frau', label: 'Frau' },
                                { value: 'Divers', label: 'Divers' }
                            ]}
                        />
                        <EditLabel
                            labelName="Titel"
                            name="title"
                            value={trainer?.title ?? ""}
                            type="text"
                        />
                        <EditLabel
                            labelName="Vorname"
                            name="name"
                            value={trainer?.name}
                        />
                        <EditLabel
                            labelName="Nachname"
                            name="surname"
                            value={trainer?.surname}
                        />
                        <EditLabel
                            labelName="Email"
                            name="email"
                            value={trainer?.email}
                        />
                        <EditLabel
                            labelName="Telefon"
                            name="phoneNumber"
                            value={trainer?.phoneNumber}
                        />
                        <EditLabel
                            labelName="Anschrift"
                            name="street"
                            value={trainer?.street}
                        />
                        <EditLabel
                            labelName="PLZ"
                            name="postalCode"
                            value={trainer?.postalCode}
                        />
                        <EditLabel
                            labelName="Stadt"
                            name="city"
                            value={trainer?.city}
                        />
                        <EditLabel
                            labelName="Land"
                            name="country"
                            value={trainer?.country}
                        />
                    </div>
                    <div className="flex justify-between mt-6">
                        <Link
                            href={`/trainer/${id}`}
                            className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 text-xs font-medium transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
                <form action={deleteTrainer} className="mt-4 flex justify-end w-full">
                    <input type="hidden" name="id" value={id} />
                    <button
                        type="submit"
                        className="inline-flex items-center cursor-pointer text-sm text-red-600 hover:text-red-800 hover:bg-red-50 transition bg-transparent border-none p-0 font-normal pr-10"
                        style={{ boxShadow: 'none' }}
                        title="Delete Area"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c1.657 0 3.22.402 4.575 1.125M21.542 12c-1.274 4.057-5.065 7-9.542 7-1.657 0-3.22-.402-4.575-1.125M9.88 9.88l4.24 4.24" />
                        </svg>
                        Löschen
                    </button>
                </form>
            </div>
            
        </div>


    );
}
