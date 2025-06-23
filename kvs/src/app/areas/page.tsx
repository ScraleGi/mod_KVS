import { PrismaClient } from '../../../generated/prisma/client'
import Link from 'next/link'

// Initialize Prisma Client
const prisma = new PrismaClient()

async function getAreas() {
    const areas = await prisma.area.findMany({
        select: {
            id: true,
            name: true
        }
    })
    return areas
}


export default async function AreasPage() {
    const areas = await getAreas()

    return (
        <div>
            <h1 className="text-4xl text-blue-900 tracking-wider font-bold mb-6">Areas</h1>
            <ul>
                {areas.map(area => (
                    <li key={area.id}>
                        <Link href={`/areas/${area.id}/edit`}>{area.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

