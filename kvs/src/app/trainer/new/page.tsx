import { db } from '@/lib/db'
import { redirect } from 'next/navigation';
import { EditLabel } from "../../../components/trainer/EditLabel";
import Link from 'next/link';
import { getAuthorizing } from "@/lib/getAuthorizing";
import CancelButton from '@/components/cancelButton/cancelButton';

export default async function NewTrainerPage() {
    // Check user authorization
  const roles = await getAuthorizing({
    privilige: ['ADMIN', 'PROGRAMMMANAGER'],
  })
    if (roles.length === 0) {
        redirect('/403')
    }
    const createTrainer = async (formData: FormData) => {
        'use server';
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

        const trainer = await db.trainer.create({
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

        redirect(`/trainer/${trainer.id}?created=1`);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-2 py-8">
            <div className="w-full max-w-xl mx-auto">
                <nav className="mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
                    <Link href="/trainer" className="hover:underline text-gray-700">Trainerübersicht</Link>
                    <span>&gt;</span>
                    <span className="text-gray-700 font-semibold">Trainer hinzufügen</span>
                </nav>
            </div>

            <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-neutral-100 p-8">
                <h1 className="text-2xl font-bold mb-6 text-neutral-900 text-center">Trainer hinzufügen</h1>
                <form
                    action={createTrainer}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <EditLabel
                            labelName="Code"
                            name="code"
                            value=""
                            required={true}
                        />
                        <EditLabel
                            labelName="Anrede"
                            name="salutation"
                            value=""
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
                            value=""
                            type="text"
                            required={false}
                        />
                        <EditLabel
                            labelName="Vorname"
                            name="name"
                            value=""
                        />
                        <EditLabel
                            labelName="Nachname"
                            name="surname"
                            value=""
                        />
                        <EditLabel
                            labelName="Geburtsdatum"
                            name="birthday"
                            value=""
                            type="date"
                        />
                        <EditLabel
                            labelName="Email"
                            name="email"
                            value=""
                        />
                        <EditLabel
                            labelName="Telefonnummer"
                            name="phoneNumber"
                            type="tel"
                            value=""
                        />
                        <EditLabel
                            labelName="Straße und Hausnummer"
                            name="street"
                            value=""
                        />
                        <EditLabel
                            labelName="Postleitzahl"
                            name="postalCode"
                            value=""
                        />
                        <EditLabel
                            labelName="Stadt"
                            name="city"
                            value=""
                        />
                        <EditLabel
                            labelName="Land"
                            name="country"
                            value=""
                        />
                    </div>
                    <div className="flex justify-between mt-6">
                       <CancelButton>Abbrechen</CancelButton>
                        <button
                            type="submit"
                            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition"
                        >
                            Trainer erstellen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}