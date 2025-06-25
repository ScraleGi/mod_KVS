// npx prisma migrate reset   -> to reset the database
// npx prisma db seed         -> to seed the database with dummy data

import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

// -------------------- Area Seeding --------------------
async function seedAreas() {
  const areaNames = [
    'KI Campus',
    'It & Coding Campus',
    'Digital Markeing Academy',
    'Green Campus',
    'Business & Management Academy',
    'E-Learning Lehrgänge',
    'Digital Studies',
  ]
  await prisma.area.createMany({
    data: areaNames.map(name => ({ name })),
    skipDuplicates: true,
  })
  const areas = await prisma.area.findMany()
  return Object.fromEntries(areas.map(area => [area.name, area.id]))
}

// -------------------- Program Seeding --------------------
async function seedPrograms(areaMap: Record<string, string>) {
  await prisma.program.createMany({
    data: [
      { name: 'AI Fundamentals', description: 'Introduction to Artificial Intelligence.', teachingUnits: 8, price: 299.99, areaId: areaMap['KI Campus'] },
      { name: 'Machine Learning Basics', teachingUnits: 10, price: 349.99, areaId: areaMap['KI Campus'] },
      { name: 'Web Development Bootcamp', description: 'Full stack web development.', teachingUnits: 12, price: 399.99, areaId: areaMap['It & Coding Campus'] },
      { name: 'Python for Beginners', teachingUnits: 6, price: 149.99, areaId: areaMap['It & Coding Campus'] },
      { name: 'Digital Marketing 101', description: 'Basics of digital marketing.', teachingUnits: 7, areaId: areaMap['Digital Markeing Academy'] },
      { name: 'Sustainability in Business', description: 'Green business practices.', teachingUnits: 5, areaId: areaMap['Green Campus'] },
      { name: 'Business Strategy', teachingUnits: 9, price: 299.99, areaId: areaMap['Business & Management Academy'] },
      { name: 'E-Learning Essentials', description: 'How to create effective e-learning courses.', areaId: areaMap['E-Learning Lehrgänge'] },
      { name: 'Digital Transformation', teachingUnits: 8, price: 199.99, areaId: areaMap['Digital Studies'] },
    ],
    skipDuplicates: true,
  })
  const programs = await prisma.program.findMany()
  return Object.fromEntries(programs.map(program => [program.name, program.id]))
}

// -------------------- Trainer Seeding --------------------
async function seedTrainers() {
  await prisma.trainer.createMany({
    data: [
      { name: 'Alice Smith' },
      { name: 'Bob Johnson' },
    ],
    skipDuplicates: true,
  })
  const trainers = await prisma.trainer.findMany()
  return Object.fromEntries(trainers.map(t => [t.name, t.id]))
}

// -------------------- Course Seeding --------------------
async function seedCourses(programMap: Record<string, string>, trainerMap: Record<string, string>) {
  await prisma.course.createMany({
    data: [
      { programId: programMap['AI Fundamentals'], startDate: new Date('2024-09-01'), trainerId: trainerMap['Alice Smith'] },
      { programId: programMap['Web Development Bootcamp'], startDate: new Date('2024-10-01'), trainerId: trainerMap['Bob Johnson'] },
      { programId: programMap['Python for Beginners'], startDate: new Date('2024-11-01'), trainerId: trainerMap['Alice Smith'] },
      { programId: programMap['Digital Marketing 101'], startDate: new Date('2024-12-01'), trainerId: trainerMap['Bob Johnson'] },
    ],
    skipDuplicates: true,
  })
  const courses = await prisma.course.findMany()
  return Object.fromEntries(courses.map(course => [course.programId, course.id]))
}

// -------------------- Participant Seeding --------------------
async function seedParticipants() {
  await prisma.participant.createMany({
    data: [
      { name: 'Charlie Brown', email: 'charlie.brown@example.com' },
      { name: 'Dana White', email: 'dana.white@example.com' },
      { name: 'Eve Adams', email: 'eve.adams@example.com' },
      { name: 'Frank Miller', email: 'frank.miller@example.com' },
      { name: 'Grace Lee', email: 'grace.lee@example.com' },
      { name: 'Henry Ford', email: 'henry.ford@example.com' },
      { name: 'Isabel Turner', email: 'isabel.turner@example.com' },
      { name: 'Jack Black', email: 'jack.black@example.com' },
      { name: 'Karen Green', email: 'karen.green@example.com' },
      { name: 'Liam Young', email: 'liam.young@example.com' },
      { name: 'Mona Patel', email: 'mona.patel@example.com' },
      { name: 'Nina Rossi', email: 'nina.rossi@example.com' },
    ],
    skipDuplicates: true,
  })
  const participants = await prisma.participant.findMany()
  return Object.fromEntries(participants.map(p => [p.name, p.id]))
}

// -------------------- Course Registration Seeding --------------------
async function seedRegistrations(
  programMap: Record<string, string>,
  courseMap: Record<string, string>,
  participantMap: Record<string, string>
) {
  await prisma.courseRegistration.createMany({
    data: [
     
      { courseId: courseMap[programMap['AI Fundamentals']], participantId: participantMap['Charlie Brown'], status: 'Registered' },
      { courseId: courseMap[programMap['Web Development Bootcamp']], participantId: participantMap['Dana White'], status: 'Interested' },
      { courseId: courseMap[programMap['Python for Beginners']], participantId: participantMap['Eve Adams'], status: 'Registered' },
      { courseId: courseMap[programMap['Digital Marketing 101']], participantId: participantMap['Frank Miller'], status: 'Started' },
      { courseId: courseMap[programMap['AI Fundamentals']], participantId: participantMap['Grace Lee'], status: 'Interested' },
      { courseId: courseMap[programMap['Web Development Bootcamp']], participantId: participantMap['Henry Ford'], status: 'Registered' },
      { courseId: courseMap[programMap['AI Fundamentals']], participantId: participantMap['Isabel Turner'], status: 'Registered' },
      { courseId: courseMap[programMap['Web Development Bootcamp']], participantId: participantMap['Jack Black'], status: 'Interested' },
      { courseId: courseMap[programMap['Python for Beginners']], participantId: participantMap['Karen Green'], status: 'Registered' },
      { courseId: courseMap[programMap['Digital Marketing 101']], participantId: participantMap['Liam Young'], status: 'Started' },
      { courseId: courseMap[programMap['AI Fundamentals']], participantId: participantMap['Mona Patel'], status: 'Interested' },
      { courseId: courseMap[programMap['Web Development Bootcamp']], participantId: participantMap['Nina Rossi'], status: 'Registered' },
    ],
    skipDuplicates: true,
  })
  const registrations = await prisma.courseRegistration.findMany()
  return Object.fromEntries(registrations.map(r => [r.participantId + '_' + r.courseId, r.id]))
}

// -------------------- Invoice Seeding --------------------
async function seedInvoices(
  programMap: Record<string, string>,
  courseMap: Record<string, string>,
  participantMap: Record<string, string>,
  registrationMap: Record<string, string>
) {
  await prisma.invoice.createMany({
    data: [
      // Invoices for participants
      { amount: 299.99, courseRegistrationId: registrationMap[participantMap['Charlie Brown'] + '_' + courseMap[programMap['AI Fundamentals']]] },
      { amount: 149.99, courseRegistrationId: registrationMap[participantMap['Dana White'] + '_' + courseMap[programMap['Web Development Bootcamp']]] },
      { amount: 199.99, courseRegistrationId: registrationMap[participantMap['Eve Adams'] + '_' + courseMap[programMap['Python for Beginners']]] },
      { amount: 179.99, courseRegistrationId: registrationMap[participantMap['Frank Miller'] + '_' + courseMap[programMap['Digital Marketing 101']]] },
      { amount: 299.99, courseRegistrationId: registrationMap[participantMap['Grace Lee'] + '_' + courseMap[programMap['AI Fundamentals']]] },
      { amount: 399.99, courseRegistrationId: registrationMap[participantMap['Henry Ford'] + '_' + courseMap[programMap['Web Development Bootcamp']]] },
      { amount: 299.99, courseRegistrationId: registrationMap[participantMap['Isabel Turner'] + '_' + courseMap[programMap['AI Fundamentals']]] },
      { amount: 149.99, courseRegistrationId: registrationMap[participantMap['Jack Black'] + '_' + courseMap[programMap['Web Development Bootcamp']]] },
      { amount: 199.99, courseRegistrationId: registrationMap[participantMap['Karen Green'] + '_' + courseMap[programMap['Python for Beginners']]] },
      { amount: 179.99, courseRegistrationId: registrationMap[participantMap['Liam Young'] + '_' + courseMap[programMap['Digital Marketing 101']]] },
      { amount: 299.99, courseRegistrationId: registrationMap[participantMap['Mona Patel'] + '_' + courseMap[programMap['AI Fundamentals']]] },
      { amount: 399.99, courseRegistrationId: registrationMap[participantMap['Nina Rossi'] + '_' + courseMap[programMap['Web Development Bootcamp']]] },
    ],
    skipDuplicates: true,
  })
}
// -------------------- Document Seeding --------------------  emin
// here are we seed documents related to course registrations
async function seedDocuments(
  programMap: Record<string, string>,
  courseMap: Record<string, string>,
  registrationMap: Record<string, string>,
  participantMap: Record<string, string>
) {
  await prisma.document.createMany({
    data: [
      {
        role: 'Syllabus',
        file: 'https://example.com/files/syllabus_ai.pdf',
        courseRegistrationId: registrationMap[participantMap['Charlie Brown'] + '_' + courseMap[programMap['AI Fundamentals']]],
      },
      {
        role: 'Certificate',
        file: 'https://example.com/files/certificate_webdev.pdf',
        courseRegistrationId: registrationMap[participantMap['Dana White'] + '_' + courseMap[programMap['Web Development Bootcamp']]],
      },
      {
        role: 'Syllabus',
        file: 'https://example.com/files/syllabus_python.pdf',
        courseRegistrationId: registrationMap[participantMap['Eve Adams'] + '_' + courseMap[programMap['Python for Beginners']]],
      },
      {
        role: 'Certificate',
        file: 'https://example.com/files/certificate_marketing.pdf',
        courseRegistrationId: registrationMap[participantMap['Frank Miller'] + '_' + courseMap[programMap['Digital Marketing 101']]],
      },
      // more dummy documents can be added here
    ],
    skipDuplicates: true,
  })
}

 // -------------------- Main Seed Function --------------------
async function seedDatabase() {
  // Seed each entity and build lookup maps for relationships
  const areaMap = await seedAreas()
  const programMap = await seedPrograms(areaMap)
  const trainerMap = await seedTrainers()
  const courseMap = await seedCourses(programMap, trainerMap)
  const participantMap = await seedParticipants()
  const registrationMap = await seedRegistrations(programMap, courseMap, participantMap)

  await seedDocuments(programMap, courseMap, registrationMap, participantMap)

  await seedInvoices(programMap, courseMap, participantMap, registrationMap)
}

// -------------------- Run Seeder --------------------
seedDatabase()
  .then(() => console.log('Dummy Data seeded.'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })