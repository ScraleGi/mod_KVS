'use server'
import { db } from '@/src/../lib/db'
import { revalidatePath } from 'next/cache'
import { WeekDay } from '../../../generated/prisma'
import {
  formatDateISO,
} from '@/lib/utils'

// --- Holiday ---
export async function getHolidays() {
  return db.holiday.findMany({ where: { deletedAt: null }, orderBy: { date: 'asc' } })
}
export async function createHoliday(formData: FormData) {
  await db.holiday.create({
    data: {
      title: formData.get('title') as string,
      date: new Date(formData.get('date') as string),
    },
  })
  revalidatePath('/coursedays')
}
export async function updateHoliday(formData: FormData) {
  await db.holiday.update({
    where: { id: formData.get('id') as string },
    data: {
      title: formData.get('title') as string,
      date: new Date(formData.get('date') as string),
    },
  })
  revalidatePath('/coursedays')
}
export async function deleteHoliday(formData: FormData) {
  await db.holiday.update({
    where: { id: formData.get('id') as string },
    data: { deletedAt: new Date() },
  })
  revalidatePath('/coursedays')
}

// --- CourseHoliday ---
export async function getCourseHolidays(courseId: string) {
  return db.courseHoliday.findMany({ where: { courseId, deletedAt: null }, orderBy: { date: 'asc' } })
}
export async function createCourseHoliday(formData: FormData) {
  const title = formData.get('title') as string
  const date = formData.get('date') as string
  const courseId = formData.get('courseId') as string

  // Convert to ISO-8601 DateTime string for Prisma
  const isoDateTime = new Date(formatDateISO(date)).toISOString()

  await db.courseHoliday.create({
    data: {
      title,
      date: isoDateTime,
      courseId,
    },
  })
  revalidatePath(`/coursedays/${courseId}`)
}
export async function updateCourseHoliday(formData: FormData) {
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const date = formData.get('date') as string
  const courseId = formData.get('courseId') as string

  // Convert to ISO-8601 DateTime string for Prisma
  const isoDateTime = new Date(formatDateISO(date)).toISOString()

  await db.courseHoliday.update({
    where: { id },
    data: {
      title,
      date: isoDateTime,
    },
  })
  revalidatePath(`/coursedays/${courseId}`)
}
export async function deleteCourseHoliday(formData: FormData) {
  await db.courseHoliday.update({
    where: { id: formData.get('id') as string },
    data: { deletedAt: new Date() },
  })
  revalidatePath(`/coursedays/${formData.get('courseId')}`)
}

// --- CourseSpecialDays ---
export async function getCourseSpecialDays(courseId: string) {
  return db.courseSpecialDays.findMany({ where: { courseId, deletedAt: null }, orderBy: { startTime: 'asc' } })
}
export async function createCourseSpecialDay(formData: FormData) {
  // Get values from form
  const startTimeRaw = formData.get('startTime') as string // e.g. "2025-09-23T08:30"
  const endTimeRaw = formData.get('endTime') as string     // e.g. "2025-09-23T12:00"
  const pauseRaw = formData.get('pauseDuration') as string // e.g. "00:30"
  const courseId = formData.get('courseId') as string

  // Convert to ISO-8601 DateTime
  const startTime = new Date(startTimeRaw).toISOString()
  const endTime = new Date(endTimeRaw).toISOString()
  // Convert pauseRaw ("HH:mm") to CEST time zone
  const pauseDate = new Date(`2000-01-01T${pauseRaw}:00+00:00`)
  const pauseDuration = pauseDate.toISOString()
 

  // Avoid unique constraint error
  const exists = await db.courseSpecialDays.findFirst({
    where: { courseId, startTime }
  })
  if (exists) {
    throw new Error('Ein besonderer Kurstag mit diesem Startzeitpunkt existiert bereits für diesen Kurs.')
  }

  await db.courseSpecialDays.create({
    data: {
      title: '', // If title is optional
      startTime,
      endTime,
      pauseDuration,
      course: {
        connect: { id: courseId }
      }
    },
  })
  revalidatePath(`/coursedays/${courseId}`)
}
export async function updateCourseSpecialDay(formData: FormData) {
  await db.courseSpecialDays.update({
    where: { id: formData.get('id') as string },
    data: {
      title: formData.get('title') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      pauseDuration: formData.get('pauseDuration') as string,
    },
  })
  revalidatePath(`/coursedays/${formData.get('courseId')}`)
}
export async function deleteCourseSpecialDay(formData: FormData) {
  await db.courseSpecialDays.update({
    where: { id: formData.get('id') as string },
    data: { deletedAt: new Date() },
  })
  revalidatePath(`/coursedays/${formData.get('courseId')}`)
}

// --- CourseRythm ---
export async function getCourseRythms(courseId: string) {
  return db.courseRythm.findMany({ where: { courseId, deletedAt: null }, orderBy: { weekDay: 'asc' } })
}
export async function createCourseRythm(formData: FormData) {
  await db.courseRythm.create({
    data: {
      title: formData.get('title') as string,
      weekDay: formData.get('weekDay') as WeekDay, 
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      pauseDuration: formData.get('pauseDuration') as string,
      courseId: formData.get('courseId') as string,
    },
  })
  revalidatePath(`/coursedays/${formData.get('courseId')}`)
}
export async function updateCourseRythm(formData: FormData) {
  await db.courseRythm.update({
    where: { id: formData.get('id') as string },
    data: {
      title: formData.get('title') as string,
      weekDay: formData.get('weekDay') as WeekDay, 
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      pauseDuration: formData.get('pauseDuration') as string,
    },
  })
  revalidatePath(`/coursedays/${formData.get('courseId')}`)
}
export async function deleteCourseRythm(formData: FormData) {
  await db.courseRythm.update({
    where: { id: formData.get('id') as string },
    data: { deletedAt: new Date() },
  })
  revalidatePath(`/coursedays/${formData.get('courseId')}`)
}