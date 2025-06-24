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

    // 2. Create all areas
    await prisma.area.createMany({
        data: areaNames.map(name => ({ name })),
        skipDuplicates: true,
    })

    // 3. Fetch all areas and map by name
    const areas = await prisma.area.findMany()
    const areaMap = Object.fromEntries(areas.map(area => [area.name, area.id]))

    // 4. Create programs using area name for areaId
    await prisma.program.createMany({
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
        ],
        skipDuplicates: true,
    })

    // 5. Fetch all programs and map by name
    const programs = await prisma.program.findMany()
    const programMap = Object.fromEntries(programs.map(program => [program.name, program.id]))

    // 6. Create trainers
    await prisma.trainer.createMany({
        data: [
            { name: 'Alice Smith' },
            { name: 'Bob Johnson' },
        ],
        skipDuplicates: true,
    })

    // 7. Fetch all trainers and map by name
    const trainerList = await prisma.trainer.findMany()
    const trainerMap = Object.fromEntries(trainerList.map(t => [t.name, t.id]))

    // 8. Create courses for programs
    await prisma.course.createMany({
        data: [
            {
                programId: programMap['AI Fundamentals'],
                startDate: new Date('2024-09-01'),
                trainerId: trainerMap['Alice Smith'],
            },
            {
                programId: programMap['Web Development Bootcamp'],
                startDate: new Date('2024-10-01'),
                trainerId: trainerMap['Bob Johnson'],
            },
            {
                programId: programMap['Python for Beginners'],
                startDate: new Date('2024-11-01'),
                trainerId: trainerMap['Alice Smith'],
            },
            {
                programId: programMap['Digital Marketing 101'],
                startDate: new Date('2024-12-01'),
                trainerId: trainerMap['Bob Johnson'],
            },
        ],
        skipDuplicates: true,
    })

    // 9. Fetch all courses and map by program name (for registration)
    const coursesList = await prisma.course.findMany()
    const courseMap = Object.fromEntries(
        coursesList.map(course => [course.programId, course.id])
    )

    // 10. Create participants (add more here)
    await prisma.participant.createMany({
        data: [
            { name: 'Charlie Brown', email: 'charlie.brown@example.com' },
            { name: 'Dana White', email: 'dana.white@example.com' },
            { name: 'Eve Adams', email: 'eve.adams@example.com' },
            { name: 'Frank Miller', email: 'frank.miller@example.com' },
            { name: 'Grace Lee', email: 'grace.lee@example.com' },
            { name: 'Henry Ford', email: 'henry.ford@example.com' },
        ],
        skipDuplicates: true,
    })

    // 11. Fetch all participants and map by name
    const participantList = await prisma.participant.findMany()
    const participantMap = Object.fromEntries(participantList.map(p => [p.name, p.id]))

    // 12. Create course registrations (assign participants to different courses)
    await prisma.courseRegistration.createMany({
        data: [
            {
                courseId: courseMap[programMap['AI Fundamentals']],
                participantId: participantMap['Charlie Brown'],
                status: 'Registered',
            },
            {
                courseId: courseMap[programMap['Web Development Bootcamp']],
                participantId: participantMap['Dana White'],
                status: 'Interested',
            },
            {
                courseId: courseMap[programMap['Python for Beginners']],
                participantId: participantMap['Eve Adams'],
                status: 'Registered',
            },
            {
                courseId: courseMap[programMap['Digital Marketing 101']],
                participantId: participantMap['Frank Miller'],
                status: 'Started',
            },
            {
                courseId: courseMap[programMap['AI Fundamentals']],
                participantId: participantMap['Grace Lee'],
                status: 'Interested',
            },
            {
                courseId: courseMap[programMap['Web Development Bootcamp']],
                participantId: participantMap['Henry Ford'],
                status: 'Registered',
            },
        ],
        skipDuplicates: true,
    })

    // 13. Fetch all course registrations for invoice linking
    const registrations = await prisma.courseRegistration.findMany()
    const registrationMap = Object.fromEntries(
        registrations.map(r => [r.participantId + '_' + r.courseId, r.id])
    )

    // 14. Create invoices (fractured payments example)
    await prisma.invoice.createMany({
        data: [
            {
                amount: 299.99,
                courseRegistrationId: registrationMap[participantMap['Charlie Brown'] + '_' + courseMap[programMap['AI Fundamentals']]],
            },
            {
                amount: 149.99,
                courseRegistrationId: registrationMap[participantMap['Dana White'] + '_' + courseMap[programMap['Web Development Bootcamp']]],
            },
            {
                amount: 199.99,
                courseRegistrationId: registrationMap[participantMap['Eve Adams'] + '_' + courseMap[programMap['Python for Beginners']]],
            },
            {
                amount: 179.99,
                courseRegistrationId: registrationMap[participantMap['Frank Miller'] + '_' + courseMap[programMap['Digital Marketing 101']]],
            },
            {
                amount: 299.99,
                courseRegistrationId: registrationMap[participantMap['Grace Lee'] + '_' + courseMap[programMap['AI Fundamentals']]],
            },
            {
                amount: 399.99,
                courseRegistrationId: registrationMap[participantMap['Henry Ford'] + '_' + courseMap[programMap['Web Development Bootcamp']]],
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