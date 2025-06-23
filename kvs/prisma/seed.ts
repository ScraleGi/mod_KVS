import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function seedDatabase() {
    await prisma.area.createMany({
        data: [
            {name: 'KI Campus'},
            {name: 'It & Coding Campus'},
            {name: 'Digital Markeing Academy'},
            {name: 'Green Campus'},
            {name: 'Business & Management Academy'},
            {name: 'E-Learning Lehrgänge'},
            {name: 'Digital Studies'},
    ]
    })

}

seedDatabase()
.then(() => console.log('Dummy Data found.'))
.catch((e) => {
    console.error(e)
    process.exit(1)
})
.finally(async () => {
    await prisma.$disconnect()
})