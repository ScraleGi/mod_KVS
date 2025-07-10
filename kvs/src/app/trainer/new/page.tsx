import { PrismaClient } from "../../../../generated/prisma";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { EditLabel } from "../../../components/trainer/EditLabel";

const prisma = new PrismaClient();

export default async function NewTrainerPage() {
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

        const trainer = await prisma.trainer.create({
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

        redirect(`/trainer/${trainer.id}`);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-2 py-8">
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
                            required={false} // Assuming title is optional
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
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Trainer erstellen
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}