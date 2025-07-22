import { Prisma } from '../generated/prisma'
import { db } from '../src/lib/db'

// -------------------- Area Seeding --------------------
async function seedAreas() {
  const areaData = [
    { code: 'KI', name: 'KI Campus', description: 'Artificial Intelligence and Machine Learning programs' },
    { code: 'IT', name: 'It & Coding Campus', description: 'IT and software development courses' },
    { code: 'DMA', name: 'Digital Markeing Academy', description: 'Digital marketing and online business' },
    { code: 'GREEN', name: 'Green Campus', description: 'Sustainability and green technology education' },
    { code: 'BMA', name: 'Business & Management Academy', description: 'Business, management, and leadership' },
    { code: 'ELEARN', name: 'E-Learning Lehrgänge', description: 'Online learning and remote education' },
    { code: 'DS', name: 'Digital Studies', description: 'Digital transformation and modern studies' },
  ]
  await db.area.createMany({
    data: areaData,
    skipDuplicates: true,
  })
  const areas = await db.area.findMany()
  return Object.fromEntries(areas.map(area => [area.name, area.id]))
}

// -------------------- Program Seeding --------------------
async function seedPrograms(areaMap: Record<string, string>) {
  await db.program.createMany({
    data: [
      { code: 'AIF', name: 'AI Fundamentals', description: 'Introduction to Artificial Intelligence.', teachingUnits: 8, price: new Prisma.Decimal('299.99'), areaId: areaMap['KI Campus'] },
      { code: 'MLB', name: 'Machine Learning Basics', teachingUnits: 10, price: new Prisma.Decimal('349.99'), areaId: areaMap['KI Campus'] },
      { code: 'WEBDEV', name: 'Web Development Bootcamp', description: 'Full stack web development.', teachingUnits: 12, price: new Prisma.Decimal('399.99'), areaId: areaMap['It & Coding Campus'] },
      { code: 'PYB', name: 'Python for Beginners', teachingUnits: 6, price: new Prisma.Decimal('149.99'), areaId: areaMap['It & Coding Campus'] },
      { code: 'DM101', name: 'Digital Marketing 101',price: new Prisma.Decimal('400.00'), description: 'Basics of digital marketing.', teachingUnits: 7, areaId: areaMap['Digital Markeing Academy'] },
      { code: 'SIB', name: 'Sustainability in Business', description: 'Green business practices.', teachingUnits: 5, areaId: areaMap['Green Campus'] },
      { code: 'BS', name: 'Business Strategy', teachingUnits: 9, price: new Prisma.Decimal('299.99'), areaId: areaMap['Business & Management Academy'] },
      { code: 'ELE', name: 'E-Learning Essentials', description: 'How to create effective e-learning courses.', areaId: areaMap['E-Learning Lehrgänge'] },
      { code: 'DT', name: 'Digital Transformation', teachingUnits: 8, price: new Prisma.Decimal('199.99'), areaId: areaMap['Digital Studies'] },
      { code: 'CCB', name: 'Cloud Computing Basics', teachingUnits: 8, price: new Prisma.Decimal('249.99'), areaId: areaMap['It & Coding Campus'] },
      { code: 'PM', name: 'Project Management', teachingUnits: 10, price: new Prisma.Decimal('299.99'), areaId: areaMap['Business & Management Academy'] },
      { code: 'DV', name: 'Data Visualization', teachingUnits: 7, price: new Prisma.Decimal('199.99'), areaId: areaMap['Digital Studies'] },
      { code: 'AGILE', name: 'Agile Methodologies', teachingUnits: 6, price: new Prisma.Decimal('179.99'), areaId: areaMap['Business & Management Academy'] },
      { code: 'UIUX', name: 'UI/UX Design', teachingUnits: 8, price: new Prisma.Decimal('259.99'), areaId: areaMap['It & Coding Campus'] },
    ],
    skipDuplicates: true,
  })
  const programs = await db.program.findMany()
  return Object.fromEntries(programs.map(program => [program.name, program.id]))
}

// -------------------- Trainer Seeding --------------------
async function seedTrainers() {
  await db.trainer.createMany({
    data: [
      {
        code: 'TR-ANNA',
        name: 'Anna',
        surname: 'Müller',
        salutation: 'Frau',
        title: 'Dr.',
        email: 'anna.mueller@example.com',
        phoneNumber: '+4915112345678',
        birthday: new Date('1980-03-15'),
        postalCode: '10115',
        city: 'Berlin',
        street: 'Lehrstraße 1',
        country: 'DE',
      },
      {
        code: 'TR-BERND',
        name: 'Bernd',
        surname: 'Schmidt',
        salutation: 'Herr',
        title: 'Prof.',
        email: 'bernd.schmidt@example.com',
        phoneNumber: '+4915223456789',
        birthday: new Date('1975-07-22'),
        postalCode: '20095',
        city: 'Hamburg',
        street: 'Dozentenweg 2',
        country: 'DE',
      },
      {
        code: 'TR-CLAUDIA',
        name: 'Claudia',
        surname: 'Fischer',
        salutation: 'Frau',
        title: null,
        email: 'claudia.fischer@example.com',
        phoneNumber: '+4915334567890',
        birthday: new Date('1985-11-05'),
        postalCode: '50667',
        city: 'Köln',
        street: 'Seminarstraße 3',
        country: 'DE',
      },
      {
        code: 'TR-DIETER',
        name: 'Dieter',
        surname: 'Weber',
        salutation: 'Herr',
        title: null,
        email: 'dieter.weber@example.com',
        phoneNumber: '+4915445678901',
        birthday: new Date('1978-02-28'),
        postalCode: '80331',
        city: 'München',
        street: 'Akademieweg 4',
        country: 'DE',
      },
      {
        code: 'TR-EVA',
        name: 'Eva',
        surname: 'Schneider',
        salutation: 'Frau',
        title: 'M.Sc.',
        email: 'eva.schneider@example.com',
        phoneNumber: '+4915556789012',
        birthday: new Date('1990-06-12'),
        postalCode: '70173',
        city: 'Stuttgart',
        street: 'Bildungsallee 5',
        country: 'DE',
      },
    ],
    skipDuplicates: true,
  })
  const trainers = await db.trainer.findMany()
  return Object.fromEntries(trainers.map(t => [`${t.name} ${t.surname}`, t.id]))
}

// -------------------- Course Seeding --------------------
async function seedCourses(programMap: Record<string, string>, trainerMap: Record<string, string>) {
  const courseData = [
    {
      code: 'AIF-2024-09',
      program: 'AI Fundamentals',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-15'),
      mainTrainer: 'Anna Müller',
      trainers: ['Bernd Schmidt', 'Claudia Fischer'],
    },
    {
      code: 'WEBDEV-2024-10',
      program: 'Web Development Bootcamp',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-10-21'),
      mainTrainer: 'Bernd Schmidt',
      trainers: ['Anna Müller'],
    },
    {
      code: 'PYB-2024-11',
      program: 'Python for Beginners',
      startDate: new Date('2024-11-01'),
      endDate: new Date('2024-11-10'),
      mainTrainer: 'Anna Müller',
      trainers: [],
    },
    {
      code: 'DM101-2024-12',
      program: 'Digital Marketing 101',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-14'),
      mainTrainer: 'Bernd Schmidt',
      trainers: ['Eva Schneider'],
    },
    {
      code: 'CCB-2025-01',
      program: 'Cloud Computing Basics',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-29'),
      mainTrainer: 'Claudia Fischer',
      trainers: ['Dieter Weber'],
    },
    {
      code: 'PM-2025-02',
      program: 'Project Management',
      startDate: new Date('2025-02-10'),
      endDate: new Date('2025-02-24'),
      mainTrainer: 'Dieter Weber',
      trainers: [],
    },
    {
      code: 'DV-2025-03',
      program: 'Data Visualization',
      startDate: new Date('2025-03-05'),
      endDate: new Date('2025-03-19'),
      mainTrainer: 'Eva Schneider',
      trainers: [],
    },
    {
      code: 'AGILE-2025-04',
      program: 'Agile Methodologies',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-10'),
      mainTrainer: 'Dieter Weber',
      trainers: ['Claudia Fischer'],
    },
    {
      code: 'UIUX-2025-05',
      program: 'UI/UX Design',
      startDate: new Date('2025-05-10'),
      endDate: new Date('2025-05-24'),
      mainTrainer: 'Claudia Fischer',
      trainers: ['Anna Müller'],
    },
  ]

  const createdCourses = []
  for (const c of courseData) {
    const course = await db.course.create({
      data: {
        code: c.code,
        programId: programMap[c.program],
        startDate: c.startDate,
        endDate: c.endDate,
        mainTrainerId: trainerMap[c.mainTrainer],
        trainers: {
          connect: c.trainers.map(fullName => ({ id: trainerMap[fullName] })),
        },
      },
    })
    createdCourses.push({ ...c, id: course.id, programId: programMap[c.program] })
  }
  return Object.fromEntries(createdCourses.map(course => [course.programId, course.id]))
}

// -------------------- Participant Seeding --------------------
async function seedParticipants() {
  await db.participant.createMany({
    data: [
      {
        code: 'P-0001',
        name: 'Charlie',
        surname: 'Brown',
        salutation: 'Herr',
        title: 'B.Sc.',
        email: 'charlie.brown@example.com',
        phoneNumber: '+491234567890',
        birthday: new Date('1990-01-01'),
        postalCode: '10115',
        city: 'Berlin',
        street: 'Musterstraße 1',
        country: 'DE',
      },
      {
        code: 'P-0002',
        name: 'Dana',
        surname: 'White',
        salutation: 'Frau',
        title: 'Mag.',
        email: 'dana.white@example.com',
        phoneNumber: '+491234567891',
        birthday: new Date('1988-02-02'),
        postalCode: '20095',
        city: 'Hamburg',
        street: 'Beispielweg 2',
        country: 'DE',
      },
      {
        code: 'P-0003',
        name: 'Eve',
        surname: 'Adams',
        salutation: 'Frau',
        title: 'Dr.',
        email: 'eve.adams@example.com',
        phoneNumber: '+491234567892',
        birthday: new Date('1992-03-03'),
        postalCode: '50667',
        city: 'Köln',
        street: 'Teststraße 3',
        country: 'DE',
      },
      {
        code: 'P-0004',
        name: 'Frank',
        surname: 'Miller',
        salutation: 'Herr',
        title: null,
        email: 'frank.miller@example.com',
        phoneNumber: '+491234567893',
        birthday: new Date('1985-04-04'),
        postalCode: '60311',
        city: 'Frankfurt',
        street: 'Hauptstraße 4',
        country: 'DE',
      },
      {
        code: 'P-0005',
        name: 'Grace',
        surname: 'Lee',
        salutation: 'Frau',
        title: null,
        email: 'grace.lee@example.com',
        phoneNumber: '+491234567894',
        birthday: new Date('1991-05-05'),
        postalCode: '70173',
        city: 'Stuttgart',
        street: 'Nebenstraße 5',
        country: 'DE',
      },
      {
        code: 'P-0006',
        name: 'Henry',
        surname: 'Ford',
        salutation: 'Herr',
        title: null,
        email: 'henry.ford@example.com',
        phoneNumber: '+491234567895',
        birthday: new Date('1980-06-06'),
        postalCode: '80331',
        city: 'München',
        street: 'Ringstraße 6',
        country: 'DE',
      },
      {
        code: 'P-0007',
        name: 'Isabel',
        surname: 'Turner',
        salutation: 'Frau',
        title: null,
        email: 'isabel.turner@example.com',
        phoneNumber: '+491234567896',
        birthday: new Date('1993-07-07'),
        postalCode: '90402',
        city: 'Nürnberg',
        street: 'Allee 7',
        country: 'DE',
      },
      {
        code: 'P-0008',
        name: 'Jack',
        surname: 'Black',
        salutation: 'Herr',
        title: null,
        email: 'jack.black@example.com',
        phoneNumber: '+491234567897',
        birthday: new Date('1987-08-08'),
        postalCode: '01067',
        city: 'Dresden',
        street: 'Parkweg 8',
        country: 'DE',
      },
      {
        code: 'P-0009',
        name: 'Karen',
        surname: 'Green',
        salutation: 'Frau',
        title: null,
        email: 'karen.green@example.com',
        phoneNumber: '+491234567898',
        birthday: new Date('1994-09-09'),
        postalCode: '04109',
        city: 'Leipzig',
        street: 'Gartenstraße 9',
        country: 'DE',
      },
      {
        code: 'P-0010',
        name: 'Liam',
        surname: 'Young',
        salutation: 'Herr',
        title: null,
        email: 'liam.young@example.com',
        phoneNumber: '+491234567899',
        birthday: new Date('1986-10-10'),
        postalCode: '28195',
        city: 'Bremen',
        street: 'Wiesenweg 10',
        country: 'DE',
      },
      {
        code: 'P-0011',
        name: 'Mona',
        surname: 'Patel',
        salutation: 'Frau',
        title: null,
        email: 'mona.patel@example.com',
        phoneNumber: '+491234567800',
        birthday: new Date('1995-11-11'),
        postalCode: '39104',
        city: 'Magdeburg',
        street: 'Blumenstraße 11',
        country: 'DE',
      },
      {
        code: 'P-0012',
        name: 'Nina',
        surname: 'Rossi',
        salutation: 'Frau',
        title: null,
        email: 'nina.rossi@example.com',
        phoneNumber: '+491234567801',
        birthday: new Date('1990-12-12'),
        postalCode: '99084',
        city: 'Erfurt',
        street: 'Waldweg 12',
        country: 'DE',
      },
      {
        code: 'P-0013',
        name: 'Olga',
        surname: 'Schmidt',
        salutation: 'Frau',
        title: null,
        email: 'olga.schmidt@example.com',
        phoneNumber: '+491234567802',
        birthday: new Date('1989-01-13'),
        postalCode: '14467',
        city: 'Potsdam',
        street: 'Seeweg 13',
        country: 'DE',
      },
      {
        code: 'P-0014',
        name: 'Paul',
        surname: 'Weber',
        salutation: 'Herr',
        title: null,
        email: 'paul.weber@example.com',
        phoneNumber: '+491234567803',
        birthday: new Date('1982-02-14'),
        postalCode: '18055',
        city: 'Rostock',
        street: 'Bergstraße 14',
        country: 'DE',
      },
      {
        code: 'P-0015',
        name: 'Quentin',
        surname: 'Bauer',
        salutation: 'Herr',
        title: null,
        email: 'quentin.bauer@example.com',
        phoneNumber: '+491234567804',
        birthday: new Date('1983-03-15'),
        postalCode: '17489',
        city: 'Greifswald',
        street: 'Talweg 15',
        country: 'DE',
      },
      {
        code: 'P-0016',
        name: 'Rita',
        surname: 'Hoffmann',
        salutation: 'Frau',
        title: null,
        email: 'rita.hoffmann@example.com',
        phoneNumber: '+491234567805',
        birthday: new Date('1984-04-16'),
        postalCode: '37073',
        city: 'Göttingen',
        street: 'Feldweg 16',
        country: 'DE',
      },
      {
        code: 'P-0017',
        name: 'Stefan',
        surname: 'König',
        salutation: 'Herr',
        title: null,
        email: 'stefan.koenig@example.com',
        phoneNumber: '+491234567806',
        birthday: new Date('1985-05-17'),
        postalCode: '34117',
        city: 'Kassel',
        street: 'Bachstraße 17',
        country: 'DE',
      },
      {
        code: 'P-0018',
        name: 'Tina',
        surname: 'Schulz',
        salutation: 'Frau',
        title: null,
        email: 'tina.schulz@example.com',
        phoneNumber: '+491234567807',
        birthday: new Date('1986-06-18'),
        postalCode: '44135',
        city: 'Dortmund',
        street: 'Heideweg 18',
        country: 'DE',
      },
    ],
    skipDuplicates: true,
  })
  const participants = await db.participant.findMany()
  return Object.fromEntries(participants.map(p => [p.name + ' ' + p.surname, p.id]))
}

// -------------------- Course Registration Seeding --------------------
async function seedRegistrations(
  programMap: Record<string, string>,
  courseMap: Record<string, string>,
  participantMap: Record<string, string>
) {
  await db.courseRegistration.createMany({
    data: [
      // AI Fundamentals
      {
        courseId: courseMap[programMap['AI Fundamentals']],
        participantId: participantMap['Charlie Brown'],
        registeredAt: new Date('2024-08-15'),
        infoSessionAt: new Date('2024-08-01'),
        generalRemark: 'Attended info session and registered early.',
      },
      {
        courseId: courseMap[programMap['AI Fundamentals']],
        participantId: participantMap['Grace Lee'],
        registeredAt: new Date('2024-08-20'),
        infoSessionAt: new Date('2024-08-01'),
        generalRemark: 'Attended info session.',
      },
      {
        courseId: courseMap[programMap['AI Fundamentals']],
        participantId: participantMap['Isabel Turner'],
        registeredAt: new Date('2024-08-22'),
        generalRemark: 'Registered late.',
      },
      // Web Development Bootcamp
      {
        courseId: courseMap[programMap['Web Development Bootcamp']],
        participantId: participantMap['Dana White'],
        registeredAt: new Date('2024-09-10'),
        interestedAt: new Date('2024-09-01'),
        generalRemark: 'Expressed interest before registering.',
      },
      {
        courseId: courseMap[programMap['Web Development Bootcamp']],
        participantId: participantMap['Henry Ford'],
        registeredAt: new Date('2024-09-15'),
        unregisteredAt: new Date('2024-09-20'),
        generalRemark: 'Unregistered after initial registration.',
      },
      {
        courseId: courseMap[programMap['Web Development Bootcamp']],
        participantId: participantMap['Jack Black'],
        registeredAt: new Date('2024-09-18'),
        infoSessionAt: new Date('2024-09-05'),
        generalRemark: 'Attended info session.',
      },
      // Python for Beginners
      {
        courseId: courseMap[programMap['Python for Beginners']],
        participantId: participantMap['Eve Adams'],
        registeredAt: new Date('2024-10-01'),
        infoSessionAt: new Date('2024-09-20'),
        generalRemark: 'Attended info session.',
      },
      {
        courseId: courseMap[programMap['Python for Beginners']],
        participantId: participantMap['Karen Green'],
        registeredAt: new Date('2024-10-02'),
        generalRemark: 'Very motivated.',
      },
      // Digital Marketing 101
      {
        courseId: courseMap[programMap['Digital Marketing 101']],
        participantId: participantMap['Frank Miller'],
        registeredAt: new Date('2024-11-15'),
        interestedAt: new Date('2024-11-01'),
        generalRemark: 'Very interested in marketing.',
      },
      {
        courseId: courseMap[programMap['Digital Marketing 101']],
        participantId: participantMap['Mona Patel'],
        registeredAt: new Date('2024-11-18'),
        generalRemark: 'Marketing background.',
      },
      // Cloud Computing Basics
      {
        courseId: courseMap[programMap['Cloud Computing Basics']],
        participantId: participantMap['Liam Young'],
        registeredAt: new Date('2025-01-10'),
        generalRemark: 'Cloud enthusiast.',
      },
      {
        courseId: courseMap[programMap['Cloud Computing Basics']],
        participantId: participantMap['Olga Schmidt'],
        registeredAt: new Date('2025-01-12'),
        generalRemark: 'Interested in cloud.',
      },
      // Project Management
      {
        courseId: courseMap[programMap['Project Management']],
        participantId: participantMap['Paul Weber'],
        registeredAt: new Date('2025-02-01'),
        generalRemark: 'Project manager.',
      },
      {
        courseId: courseMap[programMap['Project Management']],
        participantId: participantMap['Quentin Bauer'],
        registeredAt: new Date('2025-02-03'),
        generalRemark: 'Interested in PM.',
      },
      // Data Visualization
      {
        courseId: courseMap[programMap['Data Visualization']],
        participantId: participantMap['Rita Hoffmann'],
        registeredAt: new Date('2025-03-01'),
        generalRemark: 'Data analyst.',
      },
      {
        courseId: courseMap[programMap['Data Visualization']],
        participantId: participantMap['Stefan König'],
        registeredAt: new Date('2025-03-02'),
        generalRemark: 'Visualization expert.',
      },
      // Agile Methodologies
      {
        courseId: courseMap[programMap['Agile Methodologies']],
        participantId: participantMap['Tina Schulz'],
        registeredAt: new Date('2025-04-01'),
        generalRemark: 'Agile coach.',
      },
      {
        courseId: courseMap[programMap['Agile Methodologies']],
        participantId: participantMap['Nina Rossi'],
        registeredAt: new Date('2025-04-02'),
        generalRemark: 'Scrum master.',
      },
      // UI/UX Design
      {
        courseId: courseMap[programMap['UI/UX Design']],
        participantId: participantMap['Karen Green'],
        registeredAt: new Date('2025-05-01'),
        generalRemark: 'Designer.',
      },
      {
        courseId: courseMap[programMap['UI/UX Design']],
        participantId: participantMap['Mona Patel'],
        registeredAt: new Date('2025-05-02'),
        generalRemark: 'UX enthusiast.',
      },
    ],
    skipDuplicates: true,
  })
  const registrations = await db.courseRegistration.findMany()
  return Object.fromEntries(registrations.map(r => [r.participantId + '_' + r.courseId, r.id]))
}

// -------------------- InvoiceRecipient Seeding --------------------
async function seedInvoiceRecipients(participantMap: Record<string, string>) {
  const recipients = [
  // Company recipient (no salutation)
 {
      type: RecipientType.COMPANY,
      companyName: "Joe's Firma",
      recipientEmail: 'info@joesfirma.com',
      postalCode: '12345',
      recipientCity: 'City',
      recipientStreet: 'Business Street 1',
      recipientCountry: 'DE',
    },
    // Person recipients
    {
      type: RecipientType.PERSON,
      recipientSalutation: "Herr",
      recipientName: 'Charlie',
      recipientSurname: 'Brown',
      recipientEmail: 'charlie.brown@example.com',
      postalCode: '10115',
      recipientCity: 'Berlin',
      recipientStreet: 'Musterstraße 1',
      recipientCountry: 'DE',
    },
    {
      type: RecipientType.PERSON,
      recipientSalutation: "Frau",
      recipientName: 'Grace',
      recipientSurname: 'Lee',
      recipientEmail: 'grace.lee@example.com',
      postalCode: '70173',
      recipientCity: 'Stuttgart',
      recipientStreet: 'Nebenstraße 5',
      recipientCountry: 'DE',
    },
    {
      type: RecipientType.PERSON,
      recipientSalutation: "Frau",
      recipientName: 'Dana',
      recipientSurname: 'White',
      recipientEmail: 'dana.white@example.com',
      postalCode: '20095',
      recipientCity: 'Hamburg',
      recipientStreet: 'Beispielweg 2',
      recipientCountry: 'DE',
    },
    {
      type: RecipientType.PERSON,
      recipientSalutation: "Herr",
      recipientName: 'Henry',
      recipientSurname: 'Ford',
      recipientEmail: 'henry.ford@example.com',
      postalCode: '80331',
      recipientCity: 'München',
      recipientStreet: 'Ringstraße 6',
      recipientCountry: 'DE',
    },
    {
      type: RecipientType.PERSON,
      recipientSalutation: "Frau",
      recipientName: 'Eve',
      recipientSurname: 'Adams',
      recipientEmail: 'eve.adams@example.com',
      postalCode: '50667',
      recipientCity: 'Köln',
      recipientStreet: 'Teststraße 3',
      recipientCountry: 'DE',
    },
    {
      type: RecipientType.PERSON,
      recipientSalutation: "Frau",
      recipientName: 'Karen',
      recipientSurname: 'Green',
      recipientEmail: 'karen.green@example.com',
      postalCode: '04109',
      recipientCity: 'Leipzig',
      recipientStreet: 'Gartenstraße 9',
      recipientCountry: 'DE',
    },
    {
      type: RecipientType.PERSON,
      recipientSalutation: "Herr",
      recipientName: 'Frank',
      recipientSurname: 'Miller',
      recipientEmail: 'frank.miller@example.com',
      postalCode: '60311',
      recipientCity: 'Frankfurt',
      recipientStreet: 'Hauptstraße 4',
      recipientCountry: 'DE',
    },
    {
      type: RecipientType.PERSON,
      recipientSalutation: "Frau",
      recipientName: 'Mona',
      recipientSurname: 'Patel',
      recipientEmail: 'mona.patel@example.com',
      postalCode: '39104',
      recipientCity: 'Magdeburg',
      recipientStreet: 'Blumenstraße 11',
      recipientCountry: 'DE',
    },
  ]
  // Create invoice recipients
  await db.invoiceRecipient.createMany({
    data: recipients,
    skipDuplicates: true,
  })
  const allRecipients = await db.invoiceRecipient.findMany()
  return Object.fromEntries(
    allRecipients.map(r =>
      [r.type === RecipientType.COMPANY ? r.companyName : `${r.recipientName} ${r.recipientSurname}`, r.id]
    )
  )
}

// -------------------- Invoice Seeding --------------------
/*
async function seedInvoices(
  programMap: Record<string, string>,
  courseMap: Record<string, string>,
  participantMap: Record<string, string>,
  registrationMap: Record<string, string>,
  recipientMap: Record<string, string>
) {
  await db.invoice.createMany({
    data: [
      {
        invoiceNumber: '2024-001',
        amount: new Prisma.Decimal('299.99'),
        courseRegistrationId: registrationMap[participantMap['Charlie Brown'] + '_' + courseMap[programMap['AI Fundamentals']]],
        isCancelled: false,
        dueDate: new Date('2024-09-15'),
        transactionNumber: 'INV-2024-001', // Paid
        recipientId: recipientMap['Charlie Brown'],
      },
      {
        invoiceNumber: '2024-002',
        amount: new Prisma.Decimal('149.99'),
        courseRegistrationId: registrationMap[participantMap['Dana White'] + '_' + courseMap[programMap['Web Development Bootcamp']]],
        isCancelled: false,
        dueDate: new Date('2024-10-15'),
        transactionNumber: null, // Not paid yet
        recipientId: recipientMap["Joe's Firma"],
      },
      {
        invoiceNumber: '2024-003',
        amount: new Prisma.Decimal('299.99'),
        courseRegistrationId: registrationMap[participantMap['Grace Lee'] + '_' + courseMap[programMap['AI Fundamentals']]],
        isCancelled: false,
        dueDate: new Date('2024-09-16'),
        transactionNumber: 'INV-2024-003', // Paid
        recipientId: recipientMap['Grace Lee'],
      },
      {
        invoiceNumber: '2024-004',
        amount: new Prisma.Decimal('399.99'),
        courseRegistrationId: registrationMap[participantMap['Henry Ford'] + '_' + courseMap[programMap['Web Development Bootcamp']]],
        isCancelled: false,
        dueDate: new Date('2024-10-22'),
        transactionNumber: null, // Not paid yet
        recipientId: recipientMap['Henry Ford'],
      },
      {
        invoiceNumber: '2024-005',
        amount: new Prisma.Decimal('149.99'),
        courseRegistrationId: registrationMap[participantMap['Eve Adams'] + '_' + courseMap[programMap['Python for Beginners']]],
        isCancelled: false,
        dueDate: new Date('2024-11-11'),
        transactionNumber: 'INV-2024-005', // Paid
        recipientId: recipientMap['Eve Adams'],
      },
      {
        invoiceNumber: '2024-006',
        amount: new Prisma.Decimal('149.99'),
        courseRegistrationId: registrationMap[participantMap['Karen Green'] + '_' + courseMap[programMap['Python for Beginners']]],
        isCancelled: false,
        dueDate: new Date('2024-11-12'),
        transactionNumber: null, // Not paid yet
        recipientId: recipientMap['Karen Green'],
      },
      // Add more invoices as needed for other participants/courses
    ],
    skipDuplicates: true,
  })
}
*/

/*
// -------------------- Document Seeding --------------------
async function seedDocuments(
  programMap: Record<string, string>,
  courseMap: Record<string, string>,
  registrationMap: Record<string, string>,
  participantMap: Record<string, string>
) {
  await db.document.createMany({
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
      // ...add more documents as needed...
    ],
    skipDuplicates: true,
  })
}
*/

//-------------------- Seed (public) Holiday ---------------------------------

const fixedHolidays = [
  { title: 'Neujahr', month: 1, day: 1 },
  { title: 'Heilige drei Könige', month: 1, day: 6 },
  { title: 'Staatsfeiertag', month: 5, day: 1 },
  { title: 'Maria Himmelfahrt', month: 8, day: 15 },
  { title: 'Nationalfeiertag', month: 10, day: 26 },
  { title: 'Allerheiligen', month: 11, day: 1 },
  { title: 'Maria Empfängnis', month: 12, day: 8 },
  { title: 'Weihnachtstag', month: 12, day: 25 },
  { title: 'Stefanitag', month: 12, day: 26 },
];

// Schulferien für Vorarlberg 2025/26
const schoolHolidays = [
  // Kalenderjahr 2025 (bis Sommer)
  { title: 'Semesterferien', start: new Date('2025-02-10'), end: new Date('2025-02-15') },
  { title: 'Josefstag (schulfrei, kein gesetzlicher Feiertag)', start: new Date('2025-03-19'), end: new Date('2025-03-19') },
  { title: 'Osterferien', start: new Date('2025-04-12'), end: new Date('2025-04-21') },
  { title: 'Pfingstferien', start: new Date('2025-06-07'), end: new Date('2025-06-09') },
  { title: 'Sommerferien', start: new Date('2025-07-05'), end: new Date('2025-09-07') },
  // Schuljahr 2025/26 (ab Herbst)
  { title: 'Herbstferien', start: new Date('2025-10-27'), end: new Date('2025-10-31') },
  { title: 'Weihnachtsferien', start: new Date('2025-12-24'), end: new Date('2026-01-06') },
];

function calculateEaster(year: number): Date {
  // Gaußsche Osterformel
  const f = Math.floor,
    G = year % 19,
    C = f(year / 100),
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J,
    month = 3 + f((L + 40) / 44),
    day = L + 28 - 31 * f(month / 4);

  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

async function seedHoliday() {
  const years = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];
  const holidays: { title: string; date: Date }[] = [];

  for (const year of years) {
    // Fixe Feiertage
    fixedHolidays.forEach(({ title, month, day }) => {
      holidays.push({ title, date: new Date(year, month - 1, day) });
    });

    // Bewegliche Feiertage
    const easter = calculateEaster(year);
    holidays.push({ title: 'Karfreitag', date: addDays(easter, -2) });
    holidays.push({ title: 'Ostermontag', date: addDays(easter, 1) });
    holidays.push({ title: 'Christi Himmelfahrt', date: addDays(easter, 39) });
    holidays.push({ title: 'Pfingstmontag', date: addDays(easter, 50) });

    // Fronleichnam (60 Tage nach Ostersonntag)
    holidays.push({ title: 'Fronleichnam', date: addDays(easter, 60) });
  }

  // Schulferien als eigene Holiday-Einträge (nur für 2025/26)
  for (const ferien of schoolHolidays) {
    let current = new Date(ferien.start);
    while (current <= ferien.end) {
      holidays.push({ title: ferien.title, date: new Date(current) });
      current.setDate(current.getDate() + 1);
    }
  }

  await db.holiday.createMany({
    data: holidays,
    skipDuplicates: true,
  });

  console.log(`✅ Feiertage und Schulferien für ${years.length} Jahre gespeichert.`);
}

// -------------------- Role and User Seeding --------------------

async function seedRoles() {
  const roles = [
    { name: 'ADMIN' },
    { name: 'RECHNUNGSWESEN' },
    { name: 'PROGRAMMMANAGER' },
    { name: 'MARKETING' },
  ];
  await db.role.createMany({ data: roles, skipDuplicates: true });
}

async function seedUsers() {
  const users = [
    { email: 'leonie@dc.at' },
    { email: 'daniela@dc.at' },
    { email: 'gyula@dc.at' },
    { email: 'oliver@dc.at' },
    { email: 'carlos@dc.at' },
    { email: 'goerkem@dc.at' },
    { email: 'mehmet@dc.at' },
  ];
  await db.user.createMany({ data: users, skipDuplicates: true });
  // IDs für Zuordnung holen
  const allUsers = await db.user.findMany();
  return Object.fromEntries(allUsers.map(u => [u.email, u.id]));
}

async function assignRolesToUsers() {
  // Alle User holen
  const allUsers = await db.user.findMany();
  // Die ADMIN-Rolle holen
  const adminRole = await db.role.findUnique({ where: { name: 'ADMIN' } });
  if (!adminRole) throw new Error('ADMIN role not found!');

  // Für jeden User die ADMIN-Rolle zuweisen
  for (const user of allUsers) {
    await db.user.update({
      where: { id: user.id },
      data: {
        roles: {
          connect: { id: adminRole.id }
        }
      }
    });
  }
  console.log('✅ ADMIN-Rolle allen Usern zugewiesen.');
}


// -------------------- Main Seed Function --------------------

async function seedDatabase() {
  const areaMap = await seedAreas()
  const programMap = await seedPrograms(areaMap)
  const trainerMap = await seedTrainers()
  const courseMap = await seedCourses(programMap, trainerMap)
  const participantMap = await seedParticipants()
  await seedRegistrations(programMap, courseMap, participantMap)
  await seedHoliday()
  await seedRoles(); async function seedDatabase() {
    const areaMap = await seedAreas()
    const programMap = await seedPrograms(areaMap)
    const trainerMap = await seedTrainers()
    const courseMap = await seedCourses(programMap, trainerMap)
    const participantMap = await seedParticipants()
    await seedRegistrations(programMap, courseMap, participantMap)

    await seedHoliday()
    await seedRoles();
    await seedUsers();
    await assignRolesToUsers(); // <--- Hier!
  }
  await seedUsers();
  await assignRolesToUsers();
}
seedDatabase()
  .then(() => console.log('Dummy Data seeded.'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })