// Enum definitions
export enum RecipientType {
  PERSON = 'PERSON',
  COMPANY = 'COMPANY'
}

// Base interfaces
export interface BaseModel {
  id: string
  createdAt: Date
  updatedAt?: Date
  deletedAt: Date | null
}

// Area
export interface Area extends BaseModel {
  code: string
  name: string
  description: string | null
  programs?: Program[]
}

// Program
export interface Program extends BaseModel {
  code: string
  name: string
  description: string | null
  teachingUnits: number | null
  price: string | null  // Will be string after sanitize
  areaId: string
  area?: Area
  courses?: Course[]
}

// Course
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

// CourseRegistration
export interface CourseRegistration extends BaseModel {
  courseId: string
  course?: Course
  participantId: string
  participant?: Participant
  infoSessionAt: Date | null
  registeredAt: Date | null
  unregisteredAt: Date | null
  interestedAt: Date | null
  generalRemark: string | null
  subsidyRemark: string | null
  subsidyAmount: string | null  // Will be string after sanitize
  discountRemark: string | null
  discountAmount: string | null  // Will be string after sanitize
  invoices?: Invoice[]
  generatedDocuments?: Document[]
}

// Trainer
export interface Trainer extends BaseModel {
  code: string
  name: string
  surname: string
  salutation: string
  title: string | null
  email: string
  phoneNumber: string
  birthday: Date
  postalCode: string
  city: string
  street: string
  country: string
  mainCourses?: Course[]
  courses?: Course[]
}

// Participant
export interface Participant extends BaseModel {
  code: string
  name: string
  surname: string
  salutation: string
  title: string | null
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

// Invoice
export interface Invoice {
  id: string
  invoiceNumber: string
  amount: string  // Will be string after sanitize
  courseRegistrationId: string
  courseRegistration?: CourseRegistration
  isCancelled: boolean
  dueDate: Date
  transactionNumber: string | null
  recipientId: string
  recipient?: InvoiceRecipient
}

// InvoiceRecipient
export interface InvoiceRecipient extends BaseModel {
  type: RecipientType
  recipientName: string | null
  recipientSurname: string | null
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

// Document
export interface Document extends BaseModel {
  role: string
  file: string
  courseRegistrationId: string
  courseRegistration?: CourseRegistration
}

// Room
export interface Room extends BaseModel {
  name: string
  capacity: number | null
  location: string | null
  reservations?: RoomReservation[]
}

// RoomReservation
export interface RoomReservation extends BaseModel {
  name: string
  startTime: Date
  duration: number
  endTime: Date
  roomId: string
  room?: Room
}

// Holiday
export interface Holiday {
  id: string
  title: string
  date: Date
}

// Utility functions for working with model data
export function formatFullName(person: { name: string, surname: string, title?: string | null }): string {
  return [person.title, person.name, person.surname]
    .filter(Boolean)
    .join(' ')
}

export function formatDate(date: Date | string | null): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]  // YYYY-MM-DD
}

export function formatCurrency(amount: string | null): string {
  if (!amount) return '€0.00'
  return `€${parseFloat(amount).toFixed(2)}`
}