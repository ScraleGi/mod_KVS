import { PrismaClient, RecipientType, Prisma } from '../generated/prisma'

const prisma = new PrismaClient()

// -------------------- Area Seeding --------------------
async function seedAreas() {
  const areaData = [
    { name: 'KI Campus', description: 'Artificial Intelligence and Machine Learning programs' },
    { name: 'It & Coding Campus', description: 'IT and software development courses' },
    { name: 'Digital Markeing Academy', description: 'Digital marketing and online business' },
    { name: 'Green Campus', description: 'Sustainability and green technology education' },
    { name: 'Business & Management Academy', description: 'Business, management, and leadership' },
    { name: 'E-Learning Lehrgänge', description: 'Online learning and remote education' },
    { name: 'Digital Studies', description: 'Digital transformation and modern studies' },
  ]
  await prisma.area.createMany({
    data: areaData,
    skipDuplicates: true,
  })
  const areas = await prisma.area.findMany()
  return Object.fromEntries(areas.map(area => [area.name, area.id]))
}

// -------------------- Program Seeding --------------------
async function seedPrograms(areaMap: Record<string, string>) {
  await prisma.program.createMany({
    data: [
      { name: 'AI Fundamentals', description: 'Introduction to Artificial Intelligence.', teachingUnits: 8, price: new Prisma.Decimal('299.99'), areaId: areaMap['KI Campus'] },
      { name: 'Machine Learning Basics', teachingUnits: 10, price: new Prisma.Decimal('349.99'), areaId: areaMap['KI Campus'] },
      { name: 'Web Development Bootcamp', description: 'Full stack web development.', teachingUnits: 12, price: new Prisma.Decimal('399.99'), areaId: areaMap['It & Coding Campus'] },
      { name: 'Python for Beginners', teachingUnits: 6, price: new Prisma.Decimal('149.99'), areaId: areaMap['It & Coding Campus'] },
      { name: 'Digital Marketing 101', description: 'Basics of digital marketing.', teachingUnits: 7, areaId: areaMap['Digital Markeing Academy'] },
      { name: 'Sustainability in Business', description: 'Green business practices.', teachingUnits: 5, areaId: areaMap['Green Campus'] },
      { name: 'Business Strategy', teachingUnits: 9, price: new Prisma.Decimal('299.99'), areaId: areaMap['Business & Management Academy'] },
      { name: 'E-Learning Essentials', description: 'How to create effective e-learning courses.', areaId: areaMap['E-Learning Lehrgänge'] },
      { name: 'Digital Transformation', teachingUnits: 8, price: new Prisma.Decimal('199.99'), areaId: areaMap['Digital Studies'] },
      { name: 'Cloud Computing Basics', teachingUnits: 8, price: new Prisma.Decimal('249.99'), areaId: areaMap['It & Coding Campus'] },
      { name: 'Project Management', teachingUnits: 10, price: new Prisma.Decimal('299.99'), areaId: areaMap['Business & Management Academy'] },
      { name: 'Data Visualization', teachingUnits: 7, price: new Prisma.Decimal('199.99'), areaId: areaMap['Digital Studies'] },
      { name: 'Agile Methodologies', teachingUnits: 6, price: new Prisma.Decimal('179.99'), areaId: areaMap['Business & Management Academy'] },
      { name: 'UI/UX Design', teachingUnits: 8, price: new Prisma.Decimal('259.99'), areaId: areaMap['It & Coding Campus'] },
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
      endDate: new Date('2024-09-15'),
      mainTrainer: 'Alice Smith',
      trainers: ['Bob Johnson', 'Carmen Diaz'],
    },
    {
      program: 'Web Development Bootcamp',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-10-21'),
      mainTrainer: 'Bob Johnson',
      trainers: ['Alice Smith'],
    },
    {
      program: 'Python for Beginners',
      startDate: new Date('2024-11-01'),
      endDate: new Date('2024-11-10'),
      mainTrainer: 'Alice Smith',
      trainers: [],
    },
    {
      program: 'Digital Marketing 101',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-14'),
      mainTrainer: 'Bob Johnson',
      trainers: ['Emily Clark'],
    },
    {
      program: 'Cloud Computing Basics',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-29'),
      mainTrainer: 'Carmen Diaz',
      trainers: ['David Lee'],
    },
    {
      program: 'Project Management',
      startDate: new Date('2025-02-10'),
      endDate: new Date('2025-02-24'),
      mainTrainer: 'David Lee',
      trainers: [],
    },
    {
      program: 'Data Visualization',
      startDate: new Date('2025-03-05'),
      endDate: new Date('2025-03-19'),
      mainTrainer: 'Emily Clark',
      trainers: [],
    },
    {
      program: 'Agile Methodologies',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-10'),
      mainTrainer: 'David Lee',
      trainers: ['Carmen Diaz'],
    },
    {
      program: 'UI/UX Design',
      startDate: new Date('2025-05-10'),
      endDate: new Date('2025-05-24'),
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
        endDate: c.endDate,
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
      { name: 'Olga Schmidt', email: 'olga.schmidt@example.com', phoneNumber: '+491234567802' },
      { name: 'Paul Weber', email: 'paul.weber@example.com', phoneNumber: '+491234567803' },
      { name: 'Quentin Bauer', email: 'quentin.bauer@example.com', phoneNumber: '+491234567804' },
      { name: 'Rita Hoffmann', email: 'rita.hoffmann@example.com', phoneNumber: '+491234567805' },
      { name: 'Stefan König', email: 'stefan.koenig@example.com', phoneNumber: '+491234567806' },
      { name: 'Tina Schulz', email: 'tina.schulz@example.com', phoneNumber: '+491234567807' },
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
      // AI Fundamentals
      {
        courseId: courseMap[programMap['AI Fundamentals']],
        participantId: participantMap['Charlie Brown'],
        registeredAt: new Date('2024-08-15'),
        infoSessionAt: new Date('2024-08-01'),
        generalRemark: 'Attended info session and registered early.',
        subsidyRemark: 'Eligible for 50% subsidy.',
        subsidyAmount: new Prisma.Decimal('149.99'),
        discountRemark: null,
        discountAmount: null,
      },
      {
        courseId: courseMap[programMap['AI Fundamentals']],
        participantId: participantMap['Grace Lee'],
        registeredAt: new Date('2024-08-20'),
        infoSessionAt: new Date('2024-08-01'),
        generalRemark: 'Attended info session.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: null,
        discountAmount: null,
      },
      {
        courseId: courseMap[programMap['AI Fundamentals']],
        participantId: participantMap['Isabel Turner'],
        registeredAt: new Date('2024-08-22'),
        generalRemark: 'Registered late.',
        subsidyRemark: 'Special subsidy.',
        subsidyAmount: new Prisma.Decimal('100.00'),
        discountRemark: null,
        discountAmount: null,
      },
      // Web Development Bootcamp
      {
        courseId: courseMap[programMap['Web Development Bootcamp']],
        participantId: participantMap['Dana White'],
        registeredAt: new Date('2024-09-10'),
        interestedAt: new Date('2024-09-01'),
        generalRemark: 'Expressed interest before registering.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: 'Early bird discount.',
        discountAmount: new Prisma.Decimal('50.00'),
      },
      {
        courseId: courseMap[programMap['Web Development Bootcamp']],
        participantId: participantMap['Henry Ford'],
        registeredAt: new Date('2024-09-15'),
        unregisteredAt: new Date('2024-09-20'),
        generalRemark: 'Unregistered after initial registration.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: null,
        discountAmount: null,
      },
      {
        courseId: courseMap[programMap['Web Development Bootcamp']],
        participantId: participantMap['Jack Black'],
        registeredAt: new Date('2024-09-18'),
        infoSessionAt: new Date('2024-09-05'),
        generalRemark: 'Attended info session.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: null,
        discountAmount: null,
      },
      // Python for Beginners
      {
        courseId: courseMap[programMap['Python for Beginners']],
        participantId: participantMap['Eve Adams'],
        registeredAt: new Date('2024-10-01'),
        infoSessionAt: new Date('2024-09-20'),
        generalRemark: 'Attended info session.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: null,
        discountAmount: null,
      },
      {
        courseId: courseMap[programMap['Python for Beginners']],
        participantId: participantMap['Karen Green'],
        registeredAt: new Date('2024-10-02'),
        generalRemark: 'Very motivated.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: 'Student discount.',
        discountAmount: new Prisma.Decimal('20.00'),
      },
      // Digital Marketing 101
      {
        courseId: courseMap[programMap['Digital Marketing 101']],
        participantId: participantMap['Frank Miller'],
        registeredAt: new Date('2024-11-15'),
        interestedAt: new Date('2024-11-01'),
        generalRemark: 'Very interested in marketing.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: 'Group discount.',
        discountAmount: new Prisma.Decimal('30.00'),
      },
      {
        courseId: courseMap[programMap['Digital Marketing 101']],
        participantId: participantMap['Mona Patel'],
        registeredAt: new Date('2024-11-18'),
        generalRemark: 'Marketing background.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: null,
        discountAmount: null,
      },
      // Cloud Computing Basics
      {
        courseId: courseMap[programMap['Cloud Computing Basics']],
        participantId: participantMap['Liam Young'],
        registeredAt: new Date('2025-01-10'),
        generalRemark: 'Cloud enthusiast.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: null,
        discountAmount: null,
      },
      {
        courseId: courseMap[programMap['Cloud Computing Basics']],
        participantId: participantMap['Olga Schmidt'],
        registeredAt: new Date('2025-01-12'),
        generalRemark: 'Interested in cloud.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: 'Early bird.',
        discountAmount: new Prisma.Decimal('25.00'),
      },
      // Project Management
      {
        courseId: courseMap[programMap['Project Management']],
        participantId: participantMap['Paul Weber'],
        registeredAt: new Date('2025-02-01'),
        generalRemark: 'Project manager.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: null,
        discountAmount: null,
      },
      {
        courseId: courseMap[programMap['Project Management']],
        participantId: participantMap['Quentin Bauer'],
        registeredAt: new Date('2025-02-03'),
        generalRemark: 'Interested in PM.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: 'Referral.',
        discountAmount: new Prisma.Decimal('40.00'),
      },
      // Data Visualization
      {
        courseId: courseMap[programMap['Data Visualization']],
        participantId: participantMap['Rita Hoffmann'],
        registeredAt: new Date('2025-03-01'),
        generalRemark: 'Data analyst.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: null,
        discountAmount: null,
      },
      {
        courseId: courseMap[programMap['Data Visualization']],
        participantId: participantMap['Stefan König'],
        registeredAt: new Date('2025-03-02'),
        generalRemark: 'Visualization expert.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: 'Company discount.',
        discountAmount: new Prisma.Decimal('35.00'),
      },
      // Agile Methodologies
      {
        courseId: courseMap[programMap['Agile Methodologies']],
        participantId: participantMap['Tina Schulz'],
        registeredAt: new Date('2025-04-01'),
        generalRemark: 'Agile coach.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: null,
        discountAmount: null,
      },
      {
        courseId: courseMap[programMap['Agile Methodologies']],
        participantId: participantMap['Nina Rossi'],
        registeredAt: new Date('2025-04-02'),
        generalRemark: 'Scrum master.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: 'Early bird.',
        discountAmount: new Prisma.Decimal('15.00'),
      },
      // UI/UX Design
      {
        courseId: courseMap[programMap['UI/UX Design']],
        participantId: participantMap['Karen Green'],
        registeredAt: new Date('2025-05-01'),
        generalRemark: 'Designer.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: null,
        discountAmount: null,
      },
      {
        courseId: courseMap[programMap['UI/UX Design']],
        participantId: participantMap['Mona Patel'],
        registeredAt: new Date('2025-05-02'),
        generalRemark: 'UX enthusiast.',
        subsidyRemark: null,
        subsidyAmount: null,
        discountRemark: 'Student discount.',
        discountAmount: new Prisma.Decimal('30.00'),
      },
    ],
    skipDuplicates: true,
  })
  const registrations = await prisma.courseRegistration.findMany()
  return Object.fromEntries(registrations.map(r => [r.participantId + '_' + r.courseId, r.id]))
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
    {
      type: RecipientType.PERSON,
      name: 'Grace Lee',
      email: 'grace.lee@example.com',
      address: 'Participant Street 3, 54321 City',
      participantId: participantMap['Grace Lee'],
    },
    {
      type: RecipientType.PERSON,
      name: 'Dana White',
      email: 'dana.white@example.com',
      address: 'Participant Street 4, 54321 City',
      participantId: participantMap['Dana White'],
    },
    {
      type: RecipientType.PERSON,
      name: 'Henry Ford',
      email: 'henry.ford@example.com',
      address: 'Participant Street 5, 54321 City',
      participantId: participantMap['Henry Ford'],
    },
    {
      type: RecipientType.PERSON,
      name: 'Eve Adams',
      email: 'eve.adams@example.com',
      address: 'Participant Street 6, 54321 City',
      participantId: participantMap['Eve Adams'],
    },
    {
      type: RecipientType.PERSON,
      name: 'Karen Green',
      email: 'karen.green@example.com',
      address: 'Participant Street 7, 54321 City',
      participantId: participantMap['Karen Green'],
    },
    {
      type: RecipientType.PERSON,
      name: 'Frank Miller',
      email: 'frank.miller@example.com',
      address: 'Participant Street 8, 54321 City',
      participantId: participantMap['Frank Miller'],
    },
    {
      type: RecipientType.PERSON,
      name: 'Mona Patel',
      email: 'mona.patel@example.com',
      address: 'Participant Street 9, 54321 City',
      participantId: participantMap['Mona Patel'],
    },
    // Add more recipients as needed
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
      {
        amount: 299.99,
        courseRegistrationId: registrationMap[participantMap['Grace Lee'] + '_' + courseMap[programMap['AI Fundamentals']]],
        isCancelled: false,
        dueDate: new Date('2024-09-16'),
        transactionNumber: 'INV-2024-003',
        recipientId: recipientMap['Grace Lee'],
      },
      {
        amount: 399.99,
        courseRegistrationId: registrationMap[participantMap['Henry Ford'] + '_' + courseMap[programMap['Web Development Bootcamp']]],
        isCancelled: false,
        dueDate: new Date('2024-10-22'),
        transactionNumber: 'INV-2024-004',
        recipientId: recipientMap['Henry Ford'],
      },
      {
        amount: 149.99,
        courseRegistrationId: registrationMap[participantMap['Eve Adams'] + '_' + courseMap[programMap['Python for Beginners']]],
        isCancelled: false,
        dueDate: new Date('2024-11-11'),
        transactionNumber: 'INV-2024-005',
        recipientId: recipientMap['Eve Adams'],
      },
      {
        amount: 149.99,
        courseRegistrationId: registrationMap[participantMap['Karen Green'] + '_' + courseMap[programMap['Python for Beginners']]],
        isCancelled: false,
        dueDate: new Date('2024-11-12'),
        transactionNumber: 'INV-2024-006',
        recipientId: recipientMap['Karen Green'],
      },
      {
        amount: 199.99,
        courseRegistrationId: registrationMap[participantMap['Liam Young'] + '_' + courseMap[programMap['Cloud Computing Basics']]],
        isCancelled: false,
        dueDate: new Date('2025-01-30'),
        transactionNumber: 'INV-2025-001',
        recipientId: recipientMap['Liam Young'] || recipientMap['Charlie Brown'],
      },
      {
        amount: 199.99,
        courseRegistrationId: registrationMap[participantMap['Olga Schmidt'] + '_' + courseMap[programMap['Cloud Computing Basics']]],
        isCancelled: false,
        dueDate: new Date('2025-01-31'),
        transactionNumber: 'INV-2025-002',
        recipientId: recipientMap['Olga Schmidt'] || recipientMap['Charlie Brown'],
      },
      {
        amount: 259.99,
        courseRegistrationId: registrationMap[participantMap['Karen Green'] + '_' + courseMap[programMap['UI/UX Design']]],
        isCancelled: false,
        dueDate: new Date('2025-05-25'),
        transactionNumber: 'INV-2025-003',
        recipientId: recipientMap['Karen Green'],
      },
      {
        amount: 259.99,
        courseRegistrationId: registrationMap[participantMap['Mona Patel'] + '_' + courseMap[programMap['UI/UX Design']]],
        isCancelled: false,
        dueDate: new Date('2025-05-26'),
        transactionNumber: 'INV-2025-004',
        recipientId: recipientMap['Mona Patel'],
      },
      // Add more invoices as needed for other participants/courses
    ],
    skipDuplicates: true,
  })
}

// -------------------- Document Seeding --------------------
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
        file: 'https://example.com/files/certificate_ai.pdf',
        courseRegistrationId: registrationMap[participantMap['Grace Lee'] + '_' + courseMap[programMap['AI Fundamentals']]],
      },
      {
        role: 'Syllabus',
        file: 'https://example.com/files/syllabus_webdev.pdf',
        courseRegistrationId: registrationMap[participantMap['Dana White'] + '_' + courseMap[programMap['Web Development Bootcamp']]],
      },
      {
        role: 'Certificate',
        file: 'https://example.com/files/certificate_webdev.pdf',
        courseRegistrationId: registrationMap[participantMap['Henry Ford'] + '_' + courseMap[programMap['Web Development Bootcamp']]],
      },
      {
        role: 'Syllabus',
        file: 'https://example.com/files/syllabus_python.pdf',
        courseRegistrationId: registrationMap[participantMap['Eve Adams'] + '_' + courseMap[programMap['Python for Beginners']]],
      },
      {
        role: 'Certificate',
        file: 'https://example.com/files/certificate_python.pdf',
        courseRegistrationId: registrationMap[participantMap['Karen Green'] + '_' + courseMap[programMap['Python for Beginners']]],
      },
      {
        role: 'Syllabus',
        file: 'https://example.com/files/syllabus_marketing.pdf',
        courseRegistrationId: registrationMap[participantMap['Frank Miller'] + '_' + courseMap[programMap['Digital Marketing 101']]],
      },
      {
        role: 'Certificate',
        file: 'https://example.com/files/certificate_marketing.pdf',
        courseRegistrationId: registrationMap[participantMap['Mona Patel'] + '_' + courseMap[programMap['Digital Marketing 101']]],
      },
      {
        role: 'Syllabus',
        file: 'https://example.com/files/syllabus_cloud.pdf',
        courseRegistrationId: registrationMap[participantMap['Liam Young'] + '_' + courseMap[programMap['Cloud Computing Basics']]],
      },
      {
        role: 'Certificate',
        file: 'https://example.com/files/certificate_cloud.pdf',
        courseRegistrationId: registrationMap[participantMap['Olga Schmidt'] + '_' + courseMap[programMap['Cloud Computing Basics']]],
      },
      {
        role: 'Syllabus',
        file: 'https://example.com/files/syllabus_pm.pdf',
        courseRegistrationId: registrationMap[participantMap['Paul Weber'] + '_' + courseMap[programMap['Project Management']]],
      },
      {
        role: 'Certificate',
        file: 'https://example.com/files/certificate_pm.pdf',
        courseRegistrationId: registrationMap[participantMap['Quentin Bauer'] + '_' + courseMap[programMap['Project Management']]],
      },
      {
        role: 'Syllabus',
        file: 'https://example.com/files/syllabus_dataviz.pdf',
        courseRegistrationId: registrationMap[participantMap['Rita Hoffmann'] + '_' + courseMap[programMap['Data Visualization']]],
      },
      {
        role: 'Certificate',
        file: 'https://example.com/files/certificate_dataviz.pdf',
        courseRegistrationId: registrationMap[participantMap['Stefan König'] + '_' + courseMap[programMap['Data Visualization']]],
      },
      {
        role: 'Syllabus',
        file: 'https://example.com/files/syllabus_agile.pdf',
        courseRegistrationId: registrationMap[participantMap['Tina Schulz'] + '_' + courseMap[programMap['Agile Methodologies']]],
      },
      {
        role: 'Certificate',
        file: 'https://example.com/files/certificate_agile.pdf',
        courseRegistrationId: registrationMap[participantMap['Nina Rossi'] + '_' + courseMap[programMap['Agile Methodologies']]],
      },
      {
        role: 'Syllabus',
        file: 'https://example.com/files/syllabus_uiux.pdf',
        courseRegistrationId: registrationMap[participantMap['Karen Green'] + '_' + courseMap[programMap['UI/UX Design']]],
      },
      {
        role: 'Certificate',
        file: 'https://example.com/files/certificate_uiux.pdf',
        courseRegistrationId: registrationMap[participantMap['Mona Patel'] + '_' + courseMap[programMap['UI/UX Design']]],
      },
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
  const recipientMap = await seedInvoiceRecipients(participantMap)
  await seedInvoices(programMap, courseMap, participantMap, registrationMap, recipientMap)
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