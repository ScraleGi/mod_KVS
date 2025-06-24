import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function seedDatabase() {
    // 1. Area names array
    const areaNames = [
        'KI Campus',
        'It & Coding Campus',
        'Digital Markeing Academy',
        'Green Campus',
        'Business & Management Academy',
        'E-Learning Courses',
        'Digital Studies',
    ]

    // 2. Create all areas (skipDuplicates in case of reruns)
    await prisma.area.createMany({
        data: areaNames.map(name => ({ name })),
        skipDuplicates: true,
    })

    // 3. Fetch all areas and map by name
    const areas = await prisma.area.findMany()
    const areaMap = Object.fromEntries(
        areas.map(area => [area.name, area.id])
    )

    // 4. Create courses using area name for areaId
    await prisma.course.createMany({
        data: [
            {
                name: 'AI Fundamentals',
                description: 'Introduction to Artificial Intelligence.',
                teachingUnits: 8,
                courseStart: new Date('2024-09-01'),
                price: 299.99,
                areaId: areaMap['KI Campus'],
            },
            {
                name: 'Machine Learning Basics',
                teachingUnits: 10,
                price: 349.99,
                areaId: areaMap['KI Campus'],
            },
            {
                name: 'Web Development Bootcamp',
                description: 'Full stack web development.',
                teachingUnits: 12,
                courseStart: new Date('2024-10-10'),
                price: 399.99,
                areaId: areaMap['It & Coding Campus'],
            },
            {
                name: 'Python for Beginners',
                teachingUnits: 6,
                price: 149.99,
                areaId: areaMap['It & Coding Campus'],
            },
            {
                name: 'Digital Marketing 101',
                description: 'Basics of digital marketing.',
                teachingUnits: 7,
                areaId: areaMap['Digital Markeing Academy'],
            },
            {
                name: 'Sustainability in Business',
                description: 'Green business practices.',
                teachingUnits: 5,
                areaId: areaMap['Green Campus'],
            },
            {
                name: 'Business Strategy',
                teachingUnits: 9,
                price: 299.99,
                areaId: areaMap['Business & Management Academy'],
            },
            {
                name: 'E-Learning Essentials',
                description: 'How to create effective e-learning courses.',
                areaId: areaMap['E-Learning Lehrgänge'],
            },
            {
                name: 'Digital Transformation',
                teachingUnits: 8,
                price: 199.99,
                areaId: areaMap['Digital Studies'],
            },
        ]
    })
}

seedDatabase()
    .then(() => console.log('Dummy Data seeded.'))
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })