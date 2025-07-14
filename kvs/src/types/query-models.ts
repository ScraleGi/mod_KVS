import { Course, Trainer, RecipientType } from './models'

//---------------------------------------------------
// COMMON BASE TYPES
//---------------------------------------------------

/**
 * Type for decimal values after sanitization
 * Used for any currency or numerical values that come from Prisma Decimal fields
 */
export type SerializedDecimal = unknown;

/**
 * Base type for person information
 * Core fields required to identify a person in the system
 */
export interface PersonBase {
  id: string;
  name: string;
  surname: string;
  title?: string | null;
}

/**
 * Base type for contact information
 * Reusable fields for any entity with contact details
 */
export interface ContactInfo {
  email?: string;
  phoneNumber?: string | null;
}

/**
 * Base type for address information
 * Standard address fields used across multiple entities
 */
export interface AddressInfo {
  street?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
}

//---------------------------------------------------
// UNSANITIZED QUERY RESULT TYPES
//---------------------------------------------------

/**
 * Course with related data for list views
 * Contains minimal relation data needed for displaying in lists
 */
export interface CourseWithBasicRelations extends Omit<Course, 'program' | 'mainTrainer' | 'trainers' | 'registrations'> {
  program: {
    name: string;
    area: {
      name: string;
    } | null;
  } | null;
  mainTrainer: PersonBase | null;
  trainers: PersonBase[];
  registrations: { id: string }[]; // Only need ID for counting
}

/**
 * Course with detailed registration data for detail views
 * Contains full relation data needed for detailed course pages
 */
export interface CourseWithDetailedRelations extends Omit<Course, 'program' | 'mainTrainer' | 'trainers' | 'registrations'> {
  program: {
    name: string;
    area: {
      name: string;
    } | null;
  } | null;
  mainTrainer: PersonBase | null;
  trainers: PersonBase[];
  registrations: {
    id: string;
    participant: {
      name: string;
      surname: string;
    } | null;
    invoices: {
      id: string;
      invoiceNumber: string;
      dueDate: Date | null;
    }[];
    generatedDocuments: {
      id: string;
      file: string;
      role: string;
      createdAt: Date;
    }[];
  }[];
}

/**
 * Course with relations needed for editing forms
 * Contains the exact fields required by edit forms
 */
export interface CourseWithEditRelations extends Omit<Course, 'program' | 'mainTrainer' | 'trainers'> {
  program: {
    id: string;
    name: string;
  } | null;
  mainTrainer: Trainer | null;
  trainers: Trainer[];
}

/**
 * Deleted course information with program
 * Used in deleted courses views
 */
export interface DeletedCourseWithProgram {
  id: string;
  startDate: Date;
  deletedAt: Date | null;
  program: {
    name: string;
  } | null;
}

/**
 * Course with relations for calendar view
 * Contains minimal data needed for calendar display
 */
export interface CourseWithCalendarRelations {
  id: string;
  startDate: Date | string;
  program: { name: string } | null;
  mainTrainer: { name: string } | null;
  trainers: { name: string }[];
}

// Add under "SANITIZED TYPES FOR UI RENDERING" section:

/**
 * Calendar event for UI rendering
 * Compatible with FullCalendar component
 */
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  allDay: boolean;
  mainTrainer: string;
  coTrainers: string[];
  display?: string;
  color?: string;
}

//---------------------------------------------------
// SANITIZED TYPES FOR UI RENDERING
//---------------------------------------------------

/**
 * Sanitized Participant data for UI
 * Safe to use in components after decimal/date serialization
 */
export interface SanitizedParticipant extends PersonBase, ContactInfo, AddressInfo {
  salutation?: string;
  birthday?: string | Date | null;
}

/**
 * Sanitized Course data for UI
 * Contains essential course information for display components
 */
export interface SanitizedCourse {
  id: string;
  code?: string | null;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  program?: {
    id: string;
    name: string;
  } | null;
  mainTrainer?: PersonBase | null;
}

/**
 * Sanitized Invoice Recipient data for UI
 * Handles both person and company recipient types
 */
export interface SanitizedInvoiceRecipient {
  id: string;
  type: RecipientType;
  recipientName?: string | null;
  recipientSurname?: string | null;
  companyName?: string | null;
  recipientEmail?: string | null;
  recipientStreet?: string | null;
  postalCode?: string | null;
  recipientCity?: string | null;
  recipientCountry?: string | null;
}

/**
 * Sanitized Invoice data for UI
 * Base invoice properties for list views
 */
export interface SanitizedInvoice {
  id: string;
  amount?: SerializedDecimal;
  isCancelled: boolean;
  transactionNumber?: string | null;
  recipient?: SanitizedInvoiceRecipient | null;
  invoiceNumber?: string; //
}

/**
 * Sanitized Invoice data with complete relations for detail views
 * Extended invoice information including all related entities
 */
export interface SanitizedInvoiceWithRelations extends SanitizedInvoice {
  invoiceNumber: string;
  dueDate: Date | string;
  courseRegistration?: {
    id: string;
    participant?: {
      id: string;
      salutation: string;
      title?: string | null;
      name: string;
      surname: string;
    } | null;
    course?: {
      id: string;
      code?: string | null;
      program?: {
        name: string;
      } | null;
    } | null;
  } | null;
}

/**
 * Sanitized Document data for UI
 * Represents files attached to other entities
 */
export interface SanitizedDocument {
  id: string;
  file: string;
  role: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date | null;
}

/**
 * Sanitized CourseRegistration data for UI detail views
 * Comprehensive registration data including financial information
 */
export interface SanitizedRegistration {
  // Base properties from CourseRegistration
  id: string;
  courseId: string;
  participantId: string;
  
  // Timeline properties
  infoSessionAt?: Date | string | null;
  registeredAt?: Date | string | null;
  unregisteredAt?: Date | string | null;
  interestedAt?: Date | string | null;
  
  // Financial properties
  subsidyAmount?: SerializedDecimal;
  discountAmount?: SerializedDecimal;
  subsidyAmountDisplay?: string;
  discountAmountDisplay?: string;
  
  // Remarks
  subsidyRemark?: string | null;
  discountRemark?: string | null;
  generalRemark?: string | null;
  
  // Related entities
  participant: SanitizedParticipant;
  course?: SanitizedCourse;
  invoices: SanitizedInvoice[];
}

/**
 * Sanitized Program data for UI
 * Educational program with area and related courses
 */
export interface SanitizedProgram {
  // Basic properties
  id: string;
  code: string;
  name: string;
  description: string | null;
  teachingUnits: number | null;
  price: string | null;  // String after sanitization of Decimal
  areaId: string;
  
  // Timestamps
  createdAt: string | Date;
  updatedAt?: string | Date;
  deletedAt: string | Date | null;
  
  // Relations
  area?: {
    id?: string;
    name: string;
  } | null;
  course?: {
    id: string;
    code?: string;
  }[];
}

//---------------------------------------------------
// FORM COMPONENT TYPES
//---------------------------------------------------

/**
 * Program selection option for forms
 */
export interface ProgramOption {
  id: string;
  name: string;
}

/**
 * Trainer with essential data for form display
 */
export interface TrainerOption extends PersonBase {
  id: string;
  name: string;
  surname: string;
}

/**
 * Props for the course creation form
 */
export interface CreateCourseFormProps {
  id?: string;
  course?: Partial<CourseWithEditRelations>;
  trainers: TrainerOption[];
  programs: ProgramOption[];
  onSubmit: (formData: FormData) => void;
}

/**
 * Props for the course editing form
 */
export interface EditCourseFormProps {
  id: string;
  course: Omit<CourseWithEditRelations, 'startDate' | 'endDate'> & {
    startDate: Date | string;
    endDate: Date | string;
  };
  trainers: TrainerOption[];
  onSubmit: (formData: FormData) => void;
}

/**
 * Interface for invoice updates
 */
export interface InvoiceUpdateData {
  transactionNumber: string | null;
  isCancelled: boolean;
  dueDate?: Date;
}