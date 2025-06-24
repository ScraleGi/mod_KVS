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
        'E-Learning Lehrgänge',
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

    // 5. Create trainers
    await prisma.trainer.createMany({
        data: [
            { name: 'Alice Smith' },
            { name: 'Bob Johnson' },
        ],
        skipDuplicates: true,
    })

    // 6. Fetch all trainers and map by name
    const trainerList = await prisma.trainer.findMany()
    const trainerMap = Object.fromEntries(trainerList.map(t => [t.name, t.id]))

    // 7. Create participants
    await prisma.participant.createMany({
        data: [
            { name: 'Charlie Brown', email: 'charlie.brown@example.com' },
            { name: 'Dana White', email: 'dana.white@example.com' },
        ],
        skipDuplicates: true,
    })

    // 8. Fetch all participants and map by name
    const participantList = await prisma.participant.findMany()
    const participantMap = Object.fromEntries(participantList.map(p => [p.name, p.id]))

    // 9. Create invoices
    await prisma.invoice.createMany({
        data: [
            { amount: 299.99 },
            { amount: 149.99 },
        ],
        skipDuplicates: true,
    })

    // 10. Fetch all invoices
    const invoiceList = await prisma.invoice.findMany()

    // 11. Fetch all courses for courseId mapping
    const coursesList = await prisma.course.findMany()
    const courseMap = Object.fromEntries(coursesList.map(c => [c.name, c.id]))

    // 12. Create course dates (CourseDate)
    await prisma.courseDate.createMany({
        data: [
            {
                courseId: courseMap['AI Fundamentals'],
                startDate: new Date('2024-09-01'),
                trainerId: trainerMap['Alice Smith'],
            },
            {
                courseId: courseMap['Web Development Bootcamp'],
                startDate: new Date('2024-10-01'),
                trainerId: trainerMap['Bob Johnson'],
            },
        ],
        skipDuplicates: true,
    })

    // 13. Fetch all course dates for courseDateId mapping
    const courseDates = await prisma.courseDate.findMany()
    const courseDateMap = Object.fromEntries(courseDates.map(cd => [cd.courseId, cd.id]))

    // 14. Create course registrations
    await prisma.courseRegistration.createMany({
        data: [
            {
                courseDateId: courseDateMap[courseMap['AI Fundamentals']],
                participantId: participantMap['Charlie Brown'],
                status: 'Registered',
                invoiceId: invoiceList[0]?.id,
            },
            {
                courseDateId: courseDateMap[courseMap['Web Development Bootcamp']],
                participantId: participantMap['Dana White'],
                status: 'Interested',
                invoiceId: invoiceList[1]?.id,
            },
        ],
        skipDuplicates: true,
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