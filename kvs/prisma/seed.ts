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

    // prepare Room data 
    const rawRooms: [string, number, string][] = [
        ['Hörsaal',         35, 'Feldkirch'],
        ['Seminarraum-A',   25, 'Dornbirn'],
        ['Seminarraum-B',   20, 'Dornbirn'],
        ['Seminarraum-C',   17, 'Dornbirn'],
        ['Raum 1',          20, 'Feldkirch'],
        ['Raum 2',          20, 'Dornbirn'],
        ['Raum 3',           5, 'Feldkirch'],
    ]

    // insert rooms in database
    const createdRooms = await Promise.all(
            rawRooms.map(([name, capacity, location]) =>
                prisma.room.create({ data: { name, capacity, location } })
            )
    )

    // prepare reservation 
    const rawReservations: [string, string, string, number][] = [
        ['JavaScript Kurs', 'Seminarraum-A', '2025-06-24T14:00:00', 90],
        ['CSS Basics', 'Seminarraum-B', '2025-06-25T10:00:00', 60],
        ['Vue Einführung', 'Seminarraum-C', '2025-06-26T13:30:00', 120],
    ]

    // save reservations 
    await Promise.all(
        rawReservations.map(async ([title, roomName, startTimeStr, duration]) => {
        const room = createdRooms.find(r => r.name === roomName)
            if (!room) {
            console.warn(`Raum ${roomName} nicht gefunden`)
            return
        }
        // if a room been found 
        const startTime = new Date(startTimeStr as string)
        const endTime = new Date(startTime.getTime() + Number(duration) * 60000)

        await prisma.roomReservation.create({
        data: {
            name: title as string,
            startTime,
            duration: Number(duration),
            endTime,
            roomId: room.id,
        },
        })
    })
    )

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