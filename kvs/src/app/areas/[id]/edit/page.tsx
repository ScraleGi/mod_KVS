import { PrismaClient } from '../../../../../generated/prisma';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();
interface EditAreaPageProps {
    params: {
        id: string;
    };
}

export default async function EditAreaPage({ params }: EditAreaPageProps) {
    const changeArea = async (formData: FormData) => {
        'use server';
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
        <div>
            <h1>Edit Area</h1>
            <form action={changeArea}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        defaultValue={area?.name || ''}
                    />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
}
