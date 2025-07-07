//---------------------------------------------------
// ENUMS AND BASE MODELS
//---------------------------------------------------

/**
 * Types of invoice recipients
 */
export enum RecipientType {
  PERSON = 'PERSON',
  COMPANY = 'COMPANY'
}

/**
 * Base model with common fields for most entities
 */
export interface BaseModel {
  id: string
  createdAt: Date
  updatedAt?: Date
  deletedAt: Date | null   // null if active
}

//---------------------------------------------------
// CORE EDUCATION MODELS
//---------------------------------------------------

/**
 * Educational area/department
 */
export interface Area extends BaseModel {
  code: string
  name: string
  description: string | null
  programs?: Program[]
}

/**
 * Educational program
 */
export interface Program extends BaseModel {
  code: string
  name: string
  description: string | null
  teachingUnits: number | null
  price: string | null     // String after sanitize from Decimal
  areaId: string
  area?: Area
  courses?: Course[]
}

/**
 * Course instance
 */
export interface Course extends BaseModel {
  code: string
  programId: string
  program?: Program
  startDate: Date
  endDate: Date
  mainTrainerId: string
  mainTrainer?: Trainer
  trainers?: Trainer[]
  registrations?: CourseRegistration[]
}

//---------------------------------------------------
// PEOPLE MODELS
//---------------------------------------------------

/**
 * Trainer/Instructor
 */
export interface Trainer extends BaseModel {
  code: string
  name: string
  surname: string
  salutation: string       // Title of address (Mr., Ms., Dr., etc.)
  title: string | null     // Academic or professional title
  email: string
  phoneNumber: string
  birthday: Date
  postalCode: string
  city: string
  street: string
  country: string
  mainCourses?: Course[]   // Courses where this trainer is the main instructor
  courses?: Course[]       // All courses this trainer is involved with
}

/**
 * Participant/Student
 */
export interface Participant extends BaseModel {
  code: string
  name: string
  surname: string
  salutation: string       // Title of address (Mr., Ms., Dr., etc.)
  title: string | null     // Academic or professional title
  email: string
  phoneNumber: string
  birthday: Date
  postalCode: string
  city: string
  street: string
  country: string
  registrations?: CourseRegistration[]
  invoiceRecipients?: InvoiceRecipient[]
}

//---------------------------------------------------
// REGISTRATION AND FINANCIAL MODELS
//---------------------------------------------------

/**
 * Course Registration
 */
export interface CourseRegistration extends BaseModel {
  courseId: string
  course?: Course
  participantId: string
  participant?: Participant
  
  // Registration timeline
  infoSessionAt: Date | null
  registeredAt: Date | null
  unregisteredAt: Date | null
  interestedAt: Date | null
  
  // Financial details
  generalRemark: string | null
  subsidyRemark: string | null
  subsidyAmount: string | null   // String after sanitize from Decimal
  discountRemark: string | null
  discountAmount: string | null  // String after sanitize from Decimal
  
  invoices?: Invoice[]
  generatedDocuments?: Document[]
}

/**
 * Invoice
 */
export interface Invoice {
  id: string
  invoiceNumber: string
  amount: string           // String after sanitize from Decimal
  courseRegistrationId: string
  courseRegistration?: CourseRegistration
  isCancelled: boolean
  dueDate: Date
  transactionNumber: string | null
  recipientId: string
  recipient?: InvoiceRecipient
}

/**
 * Invoice Recipient
 */
export interface InvoiceRecipient extends BaseModel {
  type: RecipientType      // PERSON or COMPANY
  
  // Person details (when type is PERSON)
  recipientName: string | null
  recipientSurname: string | null
  
  // Company details (when type is COMPANY)
  companyName: string | null
  
  recipientEmail: string
  postalCode: string
  recipientCity: string
  recipientStreet: string
  recipientCountry: string
  participantId: string | null
  participant?: Participant
  invoices?: Invoice[]
}

//---------------------------------------------------
// RESOURCE MODELS
//---------------------------------------------------

/**
 * Document
 */
export interface Document extends BaseModel {
  role: string             // Purpose/type of document
  file: string             // File path or identifier
  courseRegistrationId: string
  courseRegistration?: CourseRegistration
}

/**
 * Room
 */
export interface Room extends BaseModel {
  name: string
  capacity: number | null
  location: string | null
  reservations?: RoomReservation[]
}

/**
 * Room Reservation
 */
export interface RoomReservation extends BaseModel {
  name: string             // Purpose or event name
  startTime: Date
  duration: number         // Length in minutes
  endTime: Date
  roomId: string
  room?: Room
}

//---------------------------------------------------
// OTHER MODELS
//---------------------------------------------------

/**
 * Holiday
 */
export interface Holiday {
  id: string
  title: string            // Holiday name
  date: Date
}