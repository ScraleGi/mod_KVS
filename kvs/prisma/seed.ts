import { Prisma, RecipientType } from '../generated/prisma'
import { db } from '../src/lib/db'

// -------------------- Area Seeding --------------------
async function seedAreas() {
  const areaData = [
    { code: 'KI', name: 'KI & Maschinelles Lernen', description: 'Programme zu Künstlicher Intelligenz und Machine Learning' },
    { code: 'IT', name: 'IT & Programmierung', description: 'IT, Softwareentwicklung und Programmierkurse' },
    { code: 'CYBER', name: 'Cybersecurity', description: 'IT-Sicherheit und Datenschutz' },
    { code: 'WEB', name: 'Webentwicklung', description: 'Webentwicklung und moderne Webtechnologien' },
    { code: 'DATEN', name: 'Datenwissenschaft', description: 'Data Science, Big Data und Datenanalyse' },
    { code: 'CLOUD', name: 'Cloud Technologien', description: 'Cloud Computing und DevOps' },
    { code: 'BLOCK', name: 'Blockchain & FinTech', description: 'Blockchain, Kryptowährungen und Finanztechnologien' },
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
      // KI & ML
      { code: 'KIGRUND', name: 'Grundlagen der Künstlichen Intelligenz', description: 'Einführung in KI und maschinelles Lernen.', teachingUnits: 120, price: new Prisma.Decimal('499.00'), areaId: areaMap['KI & Maschinelles Lernen'] },
      { code: 'MLADV', name: 'Maschinelles Lernen Advanced', description: 'Fortgeschrittene Methoden des maschinellen Lernens.', teachingUnits: 180, price: new Prisma.Decimal('799.00'), areaId: areaMap['KI & Maschinelles Lernen'] },
      // IT & Programmierung
      { code: 'PYTHON', name: 'Python Programmierung', description: 'Programmieren mit Python für Einsteiger und Fortgeschrittene.', teachingUnits: 140, price: new Prisma.Decimal('399.00'), areaId: areaMap['IT & Programmierung'] },
      { code: 'JAVA', name: 'Java Entwicklung', description: 'Objektorientierte Programmierung mit Java.', teachingUnits: 160, price: new Prisma.Decimal('449.00'), areaId: areaMap['IT & Programmierung'] },
      { code: 'CPLUS', name: 'C++ Intensivkurs', description: 'Effiziente Softwareentwicklung mit C++.', teachingUnits: 120, price: new Prisma.Decimal('499.00'), areaId: areaMap['IT & Programmierung'] },
      // Cybersecurity
      { code: 'CYBGRUND', name: 'Grundlagen der Cybersecurity', description: 'IT-Sicherheit von Grund auf.', teachingUnits: 120, price: new Prisma.Decimal('599.00'), areaId: areaMap['Cybersecurity'] },
      { code: 'ETHHACK', name: 'Ethical Hacking', description: 'Penetration Testing und Schwachstellenanalyse.', teachingUnits: 150, price: new Prisma.Decimal('899.00'), areaId: areaMap['Cybersecurity'] },
      // Webentwicklung
      { code: 'WEBFULL', name: 'Fullstack Webentwicklung', description: 'Frontend und Backend Entwicklung mit modernen Frameworks.', teachingUnits: 200, price: new Prisma.Decimal('999.00'), areaId: areaMap['Webentwicklung'] },
      { code: 'REACT', name: 'React & TypeScript', description: 'Moderne Webentwicklung mit React und TypeScript.', teachingUnits: 120, price: new Prisma.Decimal('499.00'), areaId: areaMap['Webentwicklung'] },
      // Datenwissenschaft
      { code: 'DATENANALYSE', name: 'Datenanalyse mit Python', description: 'Datenaufbereitung, Analyse und Visualisierung.', teachingUnits: 130, price: new Prisma.Decimal('599.00'), areaId: areaMap['Datenwissenschaft'] },
      { code: 'BIGDATA', name: 'Big Data Technologien', description: 'Arbeiten mit großen Datenmengen und Tools wie Hadoop.', teachingUnits: 180, price: new Prisma.Decimal('799.00'), areaId: areaMap['Datenwissenschaft'] },
      // Cloud
      { code: 'CLOUDGRUND', name: 'Cloud Computing Grundlagen', description: 'Einführung in Cloud-Technologien und -Architekturen.', teachingUnits: 120, price: new Prisma.Decimal('499.00'), areaId: areaMap['Cloud Technologien'] },
      { code: 'DEVOPS', name: 'DevOps & CI/CD', description: 'Automatisierung und Deployment in der Cloud.', teachingUnits: 140, price: new Prisma.Decimal('699.00'), areaId: areaMap['Cloud Technologien'] },
      // Blockchain & FinTech
      { code: 'BLOCKCHAIN', name: 'Blockchain Grundlagen', description: 'Technische und wirtschaftliche Grundlagen der Blockchain.', teachingUnits: 110, price: new Prisma.Decimal('599.00'), areaId: areaMap['Blockchain & FinTech'] },
      { code: 'CRYPTO', name: 'Kryptowährungen & Smart Contracts', description: 'Kryptowährungen, Wallets und Smart Contracts.', teachingUnits: 120, price: new Prisma.Decimal('699.00'), areaId: areaMap['Blockchain & FinTech'] },
      // Neue Programme
      { code: 'AIETHIK', name: 'KI und Ethik', description: 'Ethische Fragestellungen rund um KI.', teachingUnits: 100, price: new Prisma.Decimal('399.00'), areaId: areaMap['KI & Maschinelles Lernen'] },
      { code: 'SECOPS', name: 'Security Operations', description: 'Betrieb und Überwachung von IT-Sicherheitsinfrastrukturen.', teachingUnits: 150, price: new Prisma.Decimal('799.00'), areaId: areaMap['Cybersecurity'] },
      { code: 'CLOUDARCH', name: 'Cloud Architektur', description: 'Design und Betrieb von Cloud-Infrastrukturen.', teachingUnits: 160, price: new Prisma.Decimal('899.00'), areaId: areaMap['Cloud Technologien'] },
      { code: 'DATENBANKEN', name: 'Moderne Datenbanken', description: 'SQL, NoSQL und verteilte Datenbanksysteme.', teachingUnits: 120, price: new Prisma.Decimal('499.00'), areaId: areaMap['Datenwissenschaft'] },
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
      // Bestehende Trainer
      { code: 'TR-ANNA', name: 'Anna', surname: 'Müller', salutation: 'Frau', title: 'Dr.', email: 'anna.mueller@example.com', phoneNumber: '+4915112345678', birthday: new Date('1980-03-15'), postalCode: '10115', city: 'Berlin', street: 'Lehrstraße 1', country: 'DE' },
      { code: 'TR-BERND', name: 'Bernd', surname: 'Schmidt', salutation: 'Herr', title: 'Prof.', email: 'bernd.schmidt@example.com', phoneNumber: '+4915223456789', birthday: new Date('1975-07-22'), postalCode: '20095', city: 'Hamburg', street: 'Dozentenweg 2', country: 'DE' },
      { code: 'TR-CLAUDIA', name: 'Claudia', surname: 'Fischer', salutation: 'Frau', title: null, email: 'claudia.fischer@example.com', phoneNumber: '+4915334567890', birthday: new Date('1985-11-05'), postalCode: '50667', city: 'Köln', street: 'Seminarstraße 3', country: 'DE' },
      { code: 'TR-DIETER', name: 'Dieter', surname: 'Weber', salutation: 'Herr', title: null, email: 'dieter.weber@example.com', phoneNumber: '+4915445678901', birthday: new Date('1978-02-28'), postalCode: '80331', city: 'München', street: 'Akademieweg 4', country: 'DE' },
      { code: 'TR-EVA', name: 'Eva', surname: 'Schneider', salutation: 'Frau', title: 'M.Sc.', email: 'eva.schneider@example.com', phoneNumber: '+4915556789012', birthday: new Date('1990-06-12'), postalCode: '70173', city: 'Stuttgart', street: 'Bildungsallee 5', country: 'DE' },
      // Neue Trainer
      { code: 'TR-FELIX', name: 'Felix', surname: 'Zimmermann', salutation: 'Herr', title: null, email: 'felix.zimmermann@example.com', phoneNumber: '+4915667890123', birthday: new Date('1982-09-21'), postalCode: '90402', city: 'Nürnberg', street: 'Trainerweg 6', country: 'DE' },
      { code: 'TR-LISA', name: 'Lisa', surname: 'Becker', salutation: 'Frau', title: null, email: 'lisa.becker@example.com', phoneNumber: '+4915778901234', birthday: new Date('1987-12-11'), postalCode: '04109', city: 'Leipzig', street: 'Lehrerstraße 7', country: 'DE' },
      { code: 'TR-MARKUS', name: 'Markus', surname: 'Keller', salutation: 'Herr', title: null, email: 'markus.keller@example.com', phoneNumber: '+4915889012345', birthday: new Date('1979-04-18'), postalCode: '01067', city: 'Dresden', street: 'Dozentenallee 8', country: 'DE' },
      { code: 'TR-ELENA', name: 'Elena', surname: 'Nowak', salutation: 'Frau', title: null, email: 'elena.nowak@example.com', phoneNumber: '+4915990123456', birthday: new Date('1984-07-23'), postalCode: '50667', city: 'Köln', street: 'Seminarstraße 9', country: 'DE' },
      { code: 'TR-ANDREAS', name: 'Andreas', surname: 'Wolf', salutation: 'Herr', title: null, email: 'andreas.wolf@example.com', phoneNumber: '+4915112345679', birthday: new Date('1981-02-14'), postalCode: '70173', city: 'Stuttgart', street: 'Bildungsallee 10', country: 'DE' },
    ],
    skipDuplicates: true,
  })
  const trainers = await db.trainer.findMany()
  return Object.fromEntries(trainers.map(t => [`${t.name} ${t.surname}`, t.id]))
}

// -------------------- Participant Seeding --------------------
// 50 Teilnehmer, ca. 15% nicht-deutsch
async function seedParticipants() {
  const participantsData = [
    // Deutsche Namen
    { code: 'P-0001', name: 'Max', surname: 'Mustermann', salutation: 'Herr', title: null, email: 'max.mustermann@example.com', phoneNumber: '+491700000001', birthday: new Date('1990-01-01'), postalCode: '10115', city: 'Berlin', street: 'Musterstraße 1', country: 'DE' },
    { code: 'P-0002', name: 'Julia', surname: 'Schulz', salutation: 'Frau', title: null, email: 'julia.schulz@example.com', phoneNumber: '+491700000002', birthday: new Date('1991-02-02'), postalCode: '20095', city: 'Hamburg', street: 'Beispielweg 2', country: 'DE' },
    { code: 'P-0003', name: 'Lukas', surname: 'Meyer', salutation: 'Herr', title: null, email: 'lukas.meyer@example.com', phoneNumber: '+491700000003', birthday: new Date('1992-03-03'), postalCode: '50667', city: 'Köln', street: 'Teststraße 3', country: 'DE' },
    { code: 'P-0004', name: 'Sophie', surname: 'Bauer', salutation: 'Frau', title: null, email: 'sophie.bauer@example.com', phoneNumber: '+491700000004', birthday: new Date('1993-04-04'), postalCode: '60311', city: 'Frankfurt', street: 'Hauptstraße 4', country: 'DE' },
    { code: 'P-0005', name: 'Leon', surname: 'Hoffmann', salutation: 'Herr', title: null, email: 'leon.hoffmann@example.com', phoneNumber: '+491700000005', birthday: new Date('1994-05-05'), postalCode: '70173', city: 'Stuttgart', street: 'Nebenstraße 5', country: 'DE' },
    { code: 'P-0006', name: 'Mia', surname: 'Schneider', salutation: 'Frau', title: null, email: 'mia.schneider@example.com', phoneNumber: '+491700000006', birthday: new Date('1995-06-06'), postalCode: '80331', city: 'München', street: 'Ringstraße 6', country: 'DE' },
    { code: 'P-0007', name: 'Tim', surname: 'Fischer', salutation: 'Herr', title: null, email: 'tim.fischer@example.com', phoneNumber: '+491700000007', birthday: new Date('1996-07-07'), postalCode: '90402', city: 'Nürnberg', street: 'Allee 7', country: 'DE' },
    { code: 'P-0008', name: 'Hannah', surname: 'Koch', salutation: 'Frau', title: null, email: 'hannah.koch@example.com', phoneNumber: '+491700000008', birthday: new Date('1997-08-08'), postalCode: '01067', city: 'Dresden', street: 'Parkweg 8', country: 'DE' },
    { code: 'P-0009', name: 'Paul', surname: 'Richter', salutation: 'Herr', title: null, email: 'paul.richter@example.com', phoneNumber: '+491700000009', birthday: new Date('1998-09-09'), postalCode: '04109', city: 'Leipzig', street: 'Gartenstraße 9', country: 'DE' },
    { code: 'P-0010', name: 'Laura', surname: 'Klein', salutation: 'Frau', title: null, email: 'laura.klein@example.com', phoneNumber: '+491700000010', birthday: new Date('1999-10-10'), postalCode: '28195', city: 'Bremen', street: 'Wiesenweg 10', country: 'DE' },
    { code: 'P-0011', name: 'Jonas', surname: 'Wolf', salutation: 'Herr', title: null, email: 'jonas.wolf@example.com', phoneNumber: '+491700000011', birthday: new Date('1990-11-11'), postalCode: '39104', city: 'Magdeburg', street: 'Blumenstraße 11', country: 'DE' },
    { code: 'P-0012', name: 'Marie', surname: 'Neumann', salutation: 'Frau', title: null, email: 'marie.neumann@example.com', phoneNumber: '+491700000012', birthday: new Date('1991-12-12'), postalCode: '99084', city: 'Erfurt', street: 'Waldweg 12', country: 'DE' },
    { code: 'P-0013', name: 'Finn', surname: 'Schwarz', salutation: 'Herr', title: null, email: 'finn.schwarz@example.com', phoneNumber: '+491700000013', birthday: new Date('1992-01-13'), postalCode: '14467', city: 'Potsdam', street: 'Seeweg 13', country: 'DE' },
    { code: 'P-0014', name: 'Lena', surname: 'Zimmermann', salutation: 'Frau', title: null, email: 'lena.zimmermann@example.com', phoneNumber: '+491700000014', birthday: new Date('1993-02-14'), postalCode: '18055', city: 'Rostock', street: 'Bergstraße 14', country: 'DE' },
    { code: 'P-0015', name: 'Moritz', surname: 'Krüger', salutation: 'Herr', title: null, email: 'moritz.krueger@example.com', phoneNumber: '+491700000015', birthday: new Date('1994-03-15'), postalCode: '17489', city: 'Greifswald', street: 'Talweg 15', country: 'DE' },
    { code: 'P-0016', name: 'Clara', surname: 'Hartmann', salutation: 'Frau', title: null, email: 'clara.hartmann@example.com', phoneNumber: '+491700000016', birthday: new Date('1995-04-16'), postalCode: '37073', city: 'Göttingen', street: 'Feldweg 16', country: 'DE' },
    { code: 'P-0017', name: 'Jan', surname: 'Werner', salutation: 'Herr', title: null, email: 'jan.werner@example.com', phoneNumber: '+491700000017', birthday: new Date('1996-05-17'), postalCode: '34117', city: 'Kassel', street: 'Bachstraße 17', country: 'DE' },
    { code: 'P-0018', name: 'Marlene', surname: 'Schmitt', salutation: 'Frau', title: null, email: 'marlene.schmitt@example.com', phoneNumber: '+491700000018', birthday: new Date('1997-06-18'), postalCode: '44135', city: 'Dortmund', street: 'Heideweg 18', country: 'DE' },
    { code: 'P-0019', name: 'Sebastian', surname: 'Scholz', salutation: 'Herr', title: null, email: 'sebastian.scholz@example.com', phoneNumber: '+491700000019', birthday: new Date('1998-07-19'), postalCode: '80331', city: 'München', street: 'Ringstraße 19', country: 'DE' },
    { code: 'P-0020', name: 'Nina', surname: 'Frank', salutation: 'Frau', title: null, email: 'nina.frank@example.com', phoneNumber: '+491700000020', birthday: new Date('1999-08-20'), postalCode: '70173', city: 'Stuttgart', street: 'Nebenstraße 20', country: 'DE' },
    { code: 'P-0021', name: 'Philipp', surname: 'Krause', salutation: 'Herr', title: null, email: 'philipp.krause@example.com', phoneNumber: '+491700000021', birthday: new Date('1990-09-21'), postalCode: '50667', city: 'Köln', street: 'Teststraße 21', country: 'DE' },
    { code: 'P-0022', name: 'Katharina', surname: 'Lang', salutation: 'Frau', title: null, email: 'katharina.lang@example.com', phoneNumber: '+491700000022', birthday: new Date('1991-10-22'), postalCode: '20095', city: 'Hamburg', street: 'Beispielweg 22', country: 'DE' },
    { code: 'P-0023', name: 'Simon', surname: 'Peters', salutation: 'Herr', title: null, email: 'simon.peters@example.com', phoneNumber: '+491700000023', birthday: new Date('1992-11-23'), postalCode: '10115', city: 'Berlin', street: 'Musterstraße 23', country: 'DE' },
    { code: 'P-0024', name: 'Theresa', surname: 'Jung', salutation: 'Frau', title: null, email: 'theresa.jung@example.com', phoneNumber: '+491700000024', birthday: new Date('1993-12-24'), postalCode: '60311', city: 'Frankfurt', street: 'Hauptstraße 24', country: 'DE' },
    { code: 'P-0025', name: 'David', surname: 'Brandt', salutation: 'Herr', title: null, email: 'david.brandt@example.com', phoneNumber: '+491700000025', birthday: new Date('1994-01-25'), postalCode: '90402', city: 'Nürnberg', street: 'Allee 25', country: 'DE' },
    { code: 'P-0026', name: 'Carolin', surname: 'Seidel', salutation: 'Frau', title: null, email: 'carolin.seidel@example.com', phoneNumber: '+491700000026', birthday: new Date('1995-02-26'), postalCode: '01067', city: 'Dresden', street: 'Parkweg 26', country: 'DE' },
    { code: 'P-0027', name: 'Benjamin', surname: 'Graf', salutation: 'Herr', title: null, email: 'benjamin.graf@example.com', phoneNumber: '+491700000027', birthday: new Date('1996-03-27'), postalCode: '04109', city: 'Leipzig', street: 'Gartenstraße 27', country: 'DE' },
    { code: 'P-0028', name: 'Helena', surname: 'Arnold', salutation: 'Frau', title: null, email: 'helena.arnold@example.com', phoneNumber: '+491700000028', birthday: new Date('1997-04-28'), postalCode: '28195', city: 'Bremen', street: 'Wiesenweg 28', country: 'DE' },
    { code: 'P-0029', name: 'Tobias', surname: 'Lorenz', salutation: 'Herr', title: null, email: 'tobias.lorenz@example.com', phoneNumber: '+491700000029', birthday: new Date('1998-05-29'), postalCode: '39104', city: 'Magdeburg', street: 'Blumenstraße 29', country: 'DE' },
    { code: 'P-0030', name: 'Vanessa', surname: 'Simon', salutation: 'Frau', title: null, email: 'vanessa.simon@example.com', phoneNumber: '+491700000030', birthday: new Date('1999-06-30'), postalCode: '99084', city: 'Erfurt', street: 'Waldweg 30', country: 'DE' },
    // Internationale Teilnehmer (15%)
    { code: 'P-0031', name: 'Mateusz', surname: 'Kowalski', salutation: 'Herr', title: null, email: 'mateusz.kowalski@example.com', phoneNumber: '+481234567801', birthday: new Date('1990-07-01'), postalCode: '00-001', city: 'Warschau', street: 'Polska 1', country: 'PL' },
    { code: 'P-0032', name: 'Sofia', surname: 'Rossi', salutation: 'Frau', title: null, email: 'sofia.rossi@example.com', phoneNumber: '+393331234567', birthday: new Date('1991-08-02'), postalCode: '00100', city: 'Rom', street: 'Via Italia 2', country: 'IT' },
    { code: 'P-0033', name: 'Ahmed', surname: 'Hassan', salutation: 'Herr', title: null, email: 'ahmed.hassan@example.com', phoneNumber: '+201234567890', birthday: new Date('1992-09-03'), postalCode: '11311', city: 'Kairo', street: 'Nile Street 3', country: 'EG' },
    { code: 'P-0034', name: 'Maria', surname: 'García', salutation: 'Frau', title: null, email: 'maria.garcia@example.com', phoneNumber: '+34912345678', birthday: new Date('1993-10-04'), postalCode: '28001', city: 'Madrid', street: 'Calle Mayor 4', country: 'ES' },
    { code: 'P-0035', name: 'Ivan', surname: 'Petrov', salutation: 'Herr', title: null, email: 'ivan.petrov@example.com', phoneNumber: '+74951234567', birthday: new Date('1994-11-05'), postalCode: '101000', city: 'Moskau', street: 'Tverskaya 5', country: 'RU' },
    { code: 'P-0036', name: 'Chloe', surname: 'Dubois', salutation: 'Frau', title: null, email: 'chloe.dubois@example.com', phoneNumber: '+33123456789', birthday: new Date('1995-12-06'), postalCode: '75001', city: 'Paris', street: 'Rue de Rivoli 6', country: 'FR' },
    { code: 'P-0037', name: 'Yuki', surname: 'Tanaka', salutation: 'Frau', title: null, email: 'yuki.tanaka@example.com', phoneNumber: '+81312345678', birthday: new Date('1996-01-07'), postalCode: '100-0001', city: 'Tokio', street: 'Chiyoda 7', country: 'JP' },
    { code: 'P-0038', name: 'Lucas', surname: 'Silva', salutation: 'Herr', title: null, email: 'lucas.silva@example.com', phoneNumber: '+5511999999999', birthday: new Date('1997-02-08'), postalCode: '01000-000', city: 'São Paulo', street: 'Rua Brasil 8', country: 'BR' },
    { code: 'P-0039', name: 'Fatima', surname: 'Al-Farsi', salutation: 'Frau', title: null, email: 'fatima.alfarsi@example.com', phoneNumber: '+971501234567', birthday: new Date('1998-03-09'), postalCode: '00000', city: 'Dubai', street: 'Sheikh Zayed 9', country: 'AE' },
    // Noch mehr deutsche Teilnehmer
    { code: 'P-0040', name: 'Jens', surname: 'Voigt', salutation: 'Herr', title: null, email: 'jens.voigt@example.com', phoneNumber: '+491700000040', birthday: new Date('1990-04-10'), postalCode: '80331', city: 'München', street: 'Ringstraße 40', country: 'DE' },
    { code: 'P-0041', name: 'Melanie', surname: 'Kuhn', salutation: 'Frau', title: null, email: 'melanie.kuhn@example.com', phoneNumber: '+491700000041', birthday: new Date('1991-05-11'), postalCode: '70173', city: 'Stuttgart', street: 'Nebenstraße 41', country: 'DE' },
    { code: 'P-0042', name: 'Patrick', surname: 'Schuster', salutation: 'Herr', title: null, email: 'patrick.schuster@example.com', phoneNumber: '+491700000042', birthday: new Date('1992-06-12'), postalCode: '50667', city: 'Köln', street: 'Teststraße 42', country: 'DE' },
    { code: 'P-0043', name: 'Sandra', surname: 'Krämer', salutation: 'Frau', title: null, email: 'sandra.kraemer@example.com', phoneNumber: '+491700000043', birthday: new Date('1993-07-13'), postalCode: '20095', city: 'Hamburg', street: 'Beispielweg 43', country: 'DE' },
    { code: 'P-0044', name: 'Dennis', surname: 'Bergmann', salutation: 'Herr', title: null, email: 'dennis.bergmann@example.com', phoneNumber: '+491700000044', birthday: new Date('1994-08-14'), postalCode: '10115', city: 'Berlin', street: 'Musterstraße 44', country: 'DE' },
    { code: 'P-0045', name: 'Vanessa', surname: 'Scholz', salutation: 'Frau', title: null, email: 'vanessa.scholz@example.com', phoneNumber: '+491700000045', birthday: new Date('1995-09-15'), postalCode: '60311', city: 'Frankfurt', street: 'Hauptstraße 45', country: 'DE' },
    { code: 'P-0046', name: 'Timo', surname: 'Böhm', salutation: 'Herr', title: null, email: 'timo.boehm@example.com', phoneNumber: '+491700000046', birthday: new Date('1996-10-16'), postalCode: '90402', city: 'Nürnberg', street: 'Allee 46', country: 'DE' },
    { code: 'P-0047', name: 'Sina', surname: 'Kaiser', salutation: 'Frau', title: null, email: 'sina.kaiser@example.com', phoneNumber: '+491700000047', birthday: new Date('1997-11-17'), postalCode: '01067', city: 'Dresden', street: 'Parkweg 47', country: 'DE' },
    { code: 'P-0048', name: 'Fabian', surname: 'Arnold', salutation: 'Herr', title: null, email: 'fabian.arnold@example.com', phoneNumber: '+491700000048', birthday: new Date('1998-12-18'), postalCode: '04109', city: 'Leipzig', street: 'Gartenstraße 48', country: 'DE' },
    { code: 'P-0049', name: 'Miriam', surname: 'Schuster', salutation: 'Frau', title: null, email: 'miriam.schuster@example.com', phoneNumber: '+491700000049', birthday: new Date('1999-01-19'), postalCode: '28195', city: 'Bremen', street: 'Wiesenweg 49', country: 'DE' },
    { code: 'P-0050', name: 'Erik', surname: 'Keller', salutation: 'Herr', title: null, email: 'erik.keller@example.com', phoneNumber: '+491700000050', birthday: new Date('1990-02-20'), postalCode: '39104', city: 'Magdeburg', street: 'Blumenstraße 50', country: 'DE' },
  ];
  await db.participant.createMany({
    data: participantsData,
    skipDuplicates: true,
  })
  const participants = await db.participant.findMany()
  return Object.fromEntries(participants.map(p => [p.name + ' ' + p.surname, p.id]))
}

// -------------------- Course Seeding --------------------
async function seedCourses(programMap: Record<string, string>, trainerMap: Record<string, string>) {
  // Für jedes Programm 1-2 Kurse, mit deutschen Namen
  const courseData = [
    // KI & ML
    { code: 'KI-2025-01', program: 'Grundlagen der Künstlichen Intelligenz', startDate: new Date('2025-01-10'), endDate: new Date('2025-03-10'), mainTrainer: 'Anna Müller', trainers: ['Bernd Schmidt', 'Felix Zimmermann'] },
    { code: 'ML-2025-02', program: 'Maschinelles Lernen Advanced', startDate: new Date('2025-02-15'), endDate: new Date('2025-05-15'), mainTrainer: 'Bernd Schmidt', trainers: ['Anna Müller', 'Lisa Becker'] },
    // IT & Programmierung
    { code: 'PY-2025-03', program: 'Python Programmierung', startDate: new Date('2025-03-01'), endDate: new Date('2025-05-01'), mainTrainer: 'Claudia Fischer', trainers: ['Markus Keller'] },
    { code: 'JAVA-2025-04', program: 'Java Entwicklung', startDate: new Date('2025-04-10'), endDate: new Date('2025-07-10'), mainTrainer: 'Dieter Weber', trainers: ['Claudia Fischer'] },
    { code: 'CPLUS-2025-05', program: 'C++ Intensivkurs', startDate: new Date('2025-05-15'), endDate: new Date('2025-07-15'), mainTrainer: 'Felix Zimmermann', trainers: ['Andreas Wolf'] },
    // Cybersecurity
    { code: 'CYBER-2025-06', program: 'Grundlagen der Cybersecurity', startDate: new Date('2025-06-01'), endDate: new Date('2025-08-01'), mainTrainer: 'Lisa Becker', trainers: ['Bernd Schmidt'] },
    { code: 'ETHHACK-2025-07', program: 'Ethical Hacking', startDate: new Date('2025-07-10'), endDate: new Date('2025-09-10'), mainTrainer: 'Markus Keller', trainers: ['Felix Zimmermann'] },
    // Webentwicklung
    { code: 'WEBFULL-2025-08', program: 'Fullstack Webentwicklung', startDate: new Date('2025-08-15'), endDate: new Date('2025-11-15'), mainTrainer: 'Elena Nowak', trainers: ['Claudia Fischer', 'Eva Schneider'] },
    { code: 'REACT-2025-09', program: 'React & TypeScript', startDate: new Date('2025-09-01'), endDate: new Date('2025-11-01'), mainTrainer: 'Eva Schneider', trainers: ['Elena Nowak'] },
    // Datenwissenschaft
    { code: 'DATEN-2025-10', program: 'Datenanalyse mit Python', startDate: new Date('2025-10-10'), endDate: new Date('2025-12-10'), mainTrainer: 'Andreas Wolf', trainers: ['Lisa Becker'] },
    { code: 'BIGDATA-2025-11', program: 'Big Data Technologien', startDate: new Date('2025-11-15'), endDate: new Date('2026-02-15'), mainTrainer: 'Felix Zimmermann', trainers: ['Markus Keller'] },
    // Cloud
    { code: 'CLOUD-2025-12', program: 'Cloud Computing Grundlagen', startDate: new Date('2025-12-01'), endDate: new Date('2026-02-01'), mainTrainer: 'Bernd Schmidt', trainers: ['Andreas Wolf'] },
    { code: 'DEVOPS-2026-01', program: 'DevOps & CI/CD', startDate: new Date('2026-01-10'), endDate: new Date('2026-03-10'), mainTrainer: 'Dieter Weber', trainers: ['Felix Zimmermann'] },
    // Blockchain & FinTech
    { code: 'BLOCK-2026-02', program: 'Blockchain Grundlagen', startDate: new Date('2026-02-15'), endDate: new Date('2026-04-15'), mainTrainer: 'Elena Nowak', trainers: ['Eva Schneider'] },
    { code: 'CRYPTO-2026-03', program: 'Kryptowährungen & Smart Contracts', startDate: new Date('2026-03-01'), endDate: new Date('2026-05-01'), mainTrainer: 'Andreas Wolf', trainers: ['Markus Keller'] },
    // Neue Programme
    { code: 'AIETHIK-2026-04', program: 'KI und Ethik', startDate: new Date('2026-04-10'), endDate: new Date('2026-06-10'), mainTrainer: 'Anna Müller', trainers: ['Lisa Becker'] },
    { code: 'SECOPS-2026-05', program: 'Security Operations', startDate: new Date('2026-05-15'), endDate: new Date('2026-07-15'), mainTrainer: 'Felix Zimmermann', trainers: ['Bernd Schmidt'] },
    { code: 'CLOUDARCH-2026-06', program: 'Cloud Architektur', startDate: new Date('2026-06-01'), endDate: new Date('2026-08-01'), mainTrainer: 'Markus Keller', trainers: ['Andreas Wolf'] },
    { code: 'DATENBANKEN-2026-07', program: 'Moderne Datenbanken', startDate: new Date('2026-07-10'), endDate: new Date('2026-09-10'), mainTrainer: 'Eva Schneider', trainers: ['Elena Nowak'] },
  ];
  const createdCourses = [];
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
    });
    createdCourses.push({ ...c, id: course.id, programId: programMap[c.program] });
  }
  return Object.fromEntries(createdCourses.map(course => [course.programId, course.id]));
}

// -------------------- Course Registration Seeding --------------------
async function seedRegistrations(
  programMap: Record<string, string>,
  courseMap: Record<string, string>,
  participantMap: Record<string, string>
) {
  // Verschiedene deutsche Bemerkungen
  const remarks = [
    'Früh registriert.',
    'Spät registriert.',
    'Hat an einer Infoveranstaltung teilgenommen.',
    'Sehr interessiert.',
    'Hat Rückfragen gestellt.',
    'Hat bereits Vorkenntnisse.',
    'Benötigt weitere Informationen.',
    'Abgemeldet nach Registrierung.',
    'Hat Empfehlung erhalten.',
    'Hat sich telefonisch gemeldet.',
    'Hat per E-Mail nachgefragt.',
    'Hat bereits an ähnlichem Kurs teilgenommen.',
    'Möchte individuelle Beratung.',
    'Hat Teilnahme bestätigt.',
    'Wartet auf Rückmeldung.',
    'Hat sich für mehrere Kurse interessiert.',
    'Hat technische Fragen gestellt.',
    'Hat positive Rückmeldung gegeben.',
    'Hat sich kurzfristig angemeldet.',
    'Hat Kurs weiterempfohlen.',
  ];

  function isValidDate(d: Date) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  const registrations: any[] = [];
  const courseIds = Object.values(courseMap);
  const participantNames = Object.keys(participantMap);

  let regCounter = 0;
  for (const courseId of courseIds) {
    // 5-8 zufällige Teilnehmer pro Kurs
    const shuffled = participantNames
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 4) + 5);

    for (const name of shuffled) {
      const rand = Math.random();
      let reg: any = {
        courseId,
        participantId: participantMap[name],
        generalRemark: remarks[Math.floor(Math.random() * remarks.length)],
      };

      // 10% unregistered, 55% infoSession, 25% interested, Rest normal
      if (rand < 0.10) {
        reg.registeredAt = new Date(`2025-0${(regCounter % 9) + 1}-0${(regCounter % 20) + 1}`);
        reg.unregisteredAt = new Date(`2025-0${(regCounter % 9) + 1}-0${(regCounter % 20) + 5}`);
        reg.generalRemark = 'Abgemeldet nach Registrierung.';
      } else if (rand < 0.65) {
        reg.registeredAt = new Date(`2025-0${(regCounter % 9) + 1}-0${(regCounter % 20) + 1}`);
        reg.infoSessionAt = new Date(`2025-0${(regCounter % 9) + 1}-0${(regCounter % 20)}`);
        reg.generalRemark = remarks[Math.floor(Math.random() * remarks.length)];
      } else if (rand < 0.90) {
        reg.interestedAt = new Date(`2025-0${(regCounter % 9) + 1}-0${(regCounter % 20)}`);
        reg.generalRemark = 'Interessiert an diesem Kurs.';
      } // else: bleibt wie oben zufällig

      // Remove invalid dates
      if (reg.registeredAt && !isValidDate(reg.registeredAt)) delete reg.registeredAt;
      if (reg.unregisteredAt && !isValidDate(reg.unregisteredAt)) delete reg.unregisteredAt;
      if (reg.infoSessionAt && !isValidDate(reg.infoSessionAt)) delete reg.infoSessionAt;
      if (reg.interestedAt && !isValidDate(reg.interestedAt)) delete reg.interestedAt;

      registrations.push(reg);
      regCounter++;
    }
  }

  await db.courseRegistration.createMany({
    data: registrations,
    skipDuplicates: true,
  });
  const allRegs = await db.courseRegistration.findMany();
  return Object.fromEntries(allRegs.map(r => [r.participantId + '_' + r.courseId, r.id]));
}
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
  { title: 'Semesterferien', start: new Date(Date.UTC(2025, 1, 10)), end: new Date(Date.UTC(2025, 1, 15)) },
  { title: 'Josefstag (schulfrei, kein gesetzlicher Feiertag)', start: new Date(Date.UTC(2025, 2, 19)), end: new Date(Date.UTC(2025, 2, 19)) },
  { title: 'Osterferien', start: new Date(Date.UTC(2025, 3, 12)), end: new Date(Date.UTC(2025, 3, 21)) },
  { title: 'Pfingstferien', start: new Date(Date.UTC(2025, 5, 7)), end: new Date(Date.UTC(2025, 5, 9)) },
  //{ title: 'Sommerferien', start: new Date(Date.UTC(2025, 6, 5)), end: new Date(Date.UTC(2025, 8, 7)) },
  // Schuljahr 2025/26 (ab Herbst)
  { title: 'Herbstferien', start: new Date(Date.UTC(2025, 9, 27)), end: new Date(Date.UTC(2025, 9, 31)) },
  { title: 'Weihnachtsferien', start: new Date(Date.UTC(2025, 11, 24)), end: new Date(Date.UTC(2026, 0, 6)) },
];

// Calculate Easter Sunday (returns a UTC date)
function calculateEaster(year: number): Date {
  const f = Math.floor,
    G = year % 19,
    C = f(year / 100),
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J,
    month = 3 + f((L + 40) / 44),
    day = L + 28 - 31 * f(month / 4);

  // Always return UTC date
  return new Date(Date.UTC(year, month - 1, day));
}

// Add days to a UTC date, return new UTC date
function addDays(date: Date, days: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));
}

async function seedHoliday() {
  const years = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];
  const holidays: { title: string; date: Date }[] = [];

  for (const year of years) {
    // Fixe Feiertage (always UTC midnight)
    fixedHolidays.forEach(({ title, month, day }) => {
      holidays.push({ title, date: new Date(Date.UTC(year, month - 1, day)) });
    });

    // Bewegliche Feiertage (always UTC midnight)
    const easter = calculateEaster(year);
    holidays.push({ title: 'Karfreitag', date: addDays(easter, -2) });
    holidays.push({ title: 'Ostermontag', date: addDays(easter, 1) });
    holidays.push({ title: 'Christi Himmelfahrt', date: addDays(easter, 39) });
    holidays.push({ title: 'Pfingstmontag', date: addDays(easter, 50) });
    holidays.push({ title: 'Fronleichnam', date: addDays(easter, 60) });
  }

  // Schulferien als eigene Holiday-Einträge (nur für 2025/26, always UTC midnight)
  for (const ferien of schoolHolidays) {
    let current = new Date(ferien.start);
    const end = new Date(ferien.end);
    while (current <= end) {
      holidays.push({ title: ferien.title, date: new Date(current) });
      // Move to next UTC day
      current = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate() + 1));
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
  const areaMap = await seedAreas();
  const programMap = await seedPrograms(areaMap);
  const trainerMap = await seedTrainers();
  const courseMap = await seedCourses(programMap, trainerMap);
  const participantMap = await seedParticipants();
  await seedRegistrations(programMap, courseMap, participantMap);
  await seedHoliday();
  await seedRoles();
  await seedUsers();
  await assignRolesToUsers();
}

seedDatabase()
  .then(() => console.log('Dummy Data seeded.'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });