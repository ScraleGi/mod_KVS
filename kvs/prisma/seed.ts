// npx prisma migrate reset   -> to reset the database
// npx prisma db seed         -> to seed the database with dummy data

import { PrismaClient, RecipientType } from '../generated/prisma'

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
      { name: 'Cloud Computing Basics', teachingUnits: 8, price: 249.99, areaId: areaMap['It & Coding Campus'] },
      { name: 'Project Management', teachingUnits: 10, price: 299.99, areaId: areaMap['Business & Management Academy'] },
      { name: 'Data Visualization', teachingUnits: 7, price: 199.99, areaId: areaMap['Digital Studies'] },
      { name: 'Agile Methodologies', teachingUnits: 6, price: 179.99, areaId: areaMap['Business & Management Academy'] },
      { name: 'UI/UX Design', teachingUnits: 8, price: 259.99, areaId: areaMap['It & Coding Campus'] },
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
      { name: 'Alice Smith', email: 'alice.smith@example.com', phoneNumber: '+49111111111' },
      { name: 'Bob Johnson', email: 'bob.johnson@example.com', phoneNumber: '+49222222222' },
      { name: 'Carmen Diaz', email: 'carmen.diaz@example.com', phoneNumber: '+49333333333' },
      { name: 'David Lee', email: 'david.lee@example.com', phoneNumber: '+49444444444' },
      { name: 'Emily Clark', email: 'emily.clark@example.com', phoneNumber: '+49555555555' },
    ],
    skipDuplicates: true,
  })
  const trainers = await prisma.trainer.findMany()
  return Object.fromEntries(trainers.map(t => [t.name, t.id]))
}

// -------------------- Course Seeding --------------------
async function seedCourses(programMap: Record<string, string>, trainerMap: Record<string, string>) {
  const courseData = [
    {
      program: 'AI Fundamentals',
      startDate: new Date('2024-09-01'),
      mainTrainer: 'Alice Smith',
      trainers: ['Bob Johnson', 'Carmen Diaz'],
    },
    {
      program: 'Web Development Bootcamp',
      startDate: new Date('2024-10-01'),
      mainTrainer: 'Bob Johnson',
      trainers: ['Alice Smith'],
    },
    {
      program: 'Python for Beginners',
      startDate: new Date('2024-11-01'),
      mainTrainer: 'Alice Smith',
      trainers: [],
    },
    {
      program: 'Digital Marketing 101',
      startDate: new Date('2024-12-01'),
      mainTrainer: 'Bob Johnson',
      trainers: ['Emily Clark'],
    },
    {
      program: 'Cloud Computing Basics',
      startDate: new Date('2025-01-15'),
      mainTrainer: 'Carmen Diaz',
      trainers: ['David Lee'],
    },
    {
      program: 'Project Management',
      startDate: new Date('2025-02-10'),
      mainTrainer: 'David Lee',
      trainers: [],
    },
    {
      program: 'Data Visualization',
      startDate: new Date('2025-03-05'),
      mainTrainer: 'Emily Clark',
      trainers: [],
    },
    {
      program: 'Agile Methodologies',
      startDate: new Date('2025-04-01'),
      mainTrainer: 'David Lee',
      trainers: ['Carmen Diaz'],
    },
    {
      program: 'UI/UX Design',
      startDate: new Date('2025-05-10'),
      mainTrainer: 'Carmen Diaz',
      trainers: ['Alice Smith'],
    },
  ]

  const createdCourses = []
  for (const c of courseData) {
    const course = await prisma.course.create({
      data: {
        programId: programMap[c.program],
        startDate: c.startDate,
        mainTrainerId: trainerMap[c.mainTrainer],
        trainers: {
          connect: c.trainers.map(name => ({ id: trainerMap[name] })),
        },
      },
    })
    createdCourses.push({ ...c, id: course.id, programId: programMap[c.program] })
  }
  return Object.fromEntries(createdCourses.map(course => [course.programId, course.id]))
}

// -------------------- Participant Seeding --------------------
async function seedParticipants() {
  await prisma.participant.createMany({
    data: [
      { name: 'Charlie Brown', email: 'charlie.brown@example.com', phoneNumber: '+491234567890' },
      { name: 'Dana White', email: 'dana.white@example.com', phoneNumber: '+491234567891' },
      { name: 'Eve Adams', email: 'eve.adams@example.com', phoneNumber: '+491234567892' },
      { name: 'Frank Miller', email: 'frank.miller@example.com', phoneNumber: '+491234567893' },
      { name: 'Grace Lee', email: 'grace.lee@example.com', phoneNumber: '+491234567894' },
      { name: 'Henry Ford', email: 'henry.ford@example.com', phoneNumber: '+491234567895' },
      { name: 'Isabel Turner', email: 'isabel.turner@example.com', phoneNumber: '+491234567896' },
      { name: 'Jack Black', email: 'jack.black@example.com', phoneNumber: '+491234567897' },
      { name: 'Karen Green', email: 'karen.green@example.com', phoneNumber: '+491234567898' },
      { name: 'Liam Young', email: 'liam.young@example.com', phoneNumber: '+491234567899' },
      { name: 'Mona Patel', email: 'mona.patel@example.com', phoneNumber: '+491234567800' },
      { name: 'Nina Rossi', email: 'nina.rossi@example.com', phoneNumber: '+491234567801' },
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
      { courseId: courseMap[programMap['Cloud Computing Basics']], participantId: participantMap['Charlie Brown'], status: 'Registered' },
      { courseId: courseMap[programMap['Cloud Computing Basics']], participantId: participantMap['Dana White'], status: 'Registered' },
      { courseId: courseMap[programMap['Project Management']], participantId: participantMap['Eve Adams'], status: 'Registered' },
      { courseId: courseMap[programMap['Project Management']], participantId: participantMap['Frank Miller'], status: 'Registered' },
      { courseId: courseMap[programMap['Data Visualization']], participantId: participantMap['Grace Lee'], status: 'Registered' },
      { courseId: courseMap[programMap['Agile Methodologies']], participantId: participantMap['Henry Ford'], status: 'Registered' },
      { courseId: courseMap[programMap['UI/UX Design']], participantId: participantMap['Isabel Turner'], status: 'Registered' },
      { courseId: courseMap[programMap['UI/UX Design']], participantId: participantMap['Jack Black'], status: 'Registered' },
      { courseId: courseMap[programMap['Data Visualization']], participantId: participantMap['Karen Green'], status: 'Registered' },
      { courseId: courseMap[programMap['Agile Methodologies']], participantId: participantMap['Liam Young'], status: 'Registered' },
      { courseId: courseMap[programMap['Cloud Computing Basics']], participantId: participantMap['Mona Patel'], status: 'Registered' },
      { courseId: courseMap[programMap['Project Management']], participantId: participantMap['Nina Rossi'], status: 'Registered' },
    ],
    skipDuplicates: true,
  })
  const registrations = await prisma.courseRegistration.findMany()
  return Object.fromEntries(registrations.map(r => [r.participantId + '_' + r.courseId, r.id]))
}

// -------------------- Coupon Seeding --------------------
async function seedCoupons() {
  await prisma.coupon.createMany({
    data: [
      { code: 'SUMMER25', description: '25% off summer promotion', percent: 25, expiresAt: new Date('2025-09-01') },
      { code: 'WELCOME10', description: '10€ off for new users', amount: 10, expiresAt: new Date('2025-12-31') },
    ],
    skipDuplicates: true,
  })
  const coupons = await prisma.coupon.findMany()
  return Object.fromEntries(coupons.map(c => [c.code, c.id]))
}

// -------------------- InvoiceRecipient Seeding --------------------
async function seedInvoiceRecipients(participantMap: Record<string, string>) {
  const recipients = [
    {
      type: RecipientType.COMPANY,
      name: "Joe's Firma",
      email: 'info@joesfirma.com',
      address: 'Business Street 1, 12345 City',
      participantId: null,
    },
    {
      type: RecipientType.PERSON,
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      address: 'Participant Street 2, 54321 City',
      participantId: participantMap['Charlie Brown'],
    },
  ]
  await prisma.invoiceRecipient.createMany({
    data: recipients,
    skipDuplicates: true,
  })
  const allRecipients = await prisma.invoiceRecipient.findMany()
  return Object.fromEntries(allRecipients.map(r => [r.name, r.id]))
}

// -------------------- Invoice Seeding --------------------
async function seedInvoices(
  programMap: Record<string, string>,
  courseMap: Record<string, string>,
  participantMap: Record<string, string>,
  registrationMap: Record<string, string>,
  recipientMap: Record<string, string>
) {
  await prisma.invoice.createMany({
    data: [
      {
        amount: 299.99,
        courseRegistrationId: registrationMap[participantMap['Charlie Brown'] + '_' + courseMap[programMap['AI Fundamentals']]],
        isCancelled: false,
        dueDate: new Date('2024-09-15'),
        transactionNumber: 'INV-2024-001',
        recipientId: recipientMap['Charlie Brown'],
      },
      {
        amount: 149.99,
        courseRegistrationId: registrationMap[participantMap['Dana White'] + '_' + courseMap[programMap['Web Development Bootcamp']]],
        isCancelled: false,
        dueDate: new Date('2024-10-15'),
        transactionNumber: 'INV-2024-002',
        recipientId: recipientMap["Joe's Firma"],
      },
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
  const areaMap = await seedAreas()
  const programMap = await seedPrograms(areaMap)
  const trainerMap = await seedTrainers()
  const courseMap = await seedCourses(programMap, trainerMap)
  const participantMap = await seedParticipants()
  const registrationMap = await seedRegistrations(programMap, courseMap, participantMap)

  await seedDocuments(programMap, courseMap, registrationMap, participantMap)

  const couponMap = await seedCoupons() // <--- assign to variable!
  const recipientMap = await seedInvoiceRecipients(participantMap)
  await seedInvoices(programMap, courseMap, participantMap, registrationMap, recipientMap)

  // --- Assign coupons/discounts to some registrations ---
  // Charlie Brown gets SUMMER25 coupon and 50€ discount for AI Fundamentals
const cbRegId = registrationMap[participantMap['Charlie Brown'] + '_' + courseMap[programMap['AI Fundamentals']]]
if (cbRegId) {
  await prisma.courseRegistration.update({
    where: { id: cbRegId },
    data: {
      couponId: couponMap['SUMMER25'],
      discount: 50,
    },
  })
}

  // Dana White gets WELCOME10 coupon for Web Development Bootcamp
  const dwRegId = registrationMap[participantMap['Dana White'] + '_' + courseMap[programMap['Web Development Bootcamp']]]
  if (dwRegId) {
    await prisma.courseRegistration.update({
      where: { id: dwRegId },
      data: {
        couponId: couponMap['WELCOME10'],
      },
    })
  }
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