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
            <h1>Areas</h1>
            <ul>
                {areas.map(area => (
                    <li key={area.id}>
                        <Link href={`/areas/${area.id}`}>{area.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}


/*
async function addKICampus() {
  const area = await prisma.area.create({
    data: { name: 'KI Campus' }
  })
  console.log('Added area:', area)
}

addKICampus()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
  */