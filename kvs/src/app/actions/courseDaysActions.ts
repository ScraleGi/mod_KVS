'use server'

import { db } from '@/src/../lib/db'
import { revalidatePath } from 'next/cache'
import { WeekDay } from '../../../generated/prisma'
import { formatDateISO } from '@/lib/utils'
import { redirect } from 'next/navigation'
import type { ActionResult } from '@/components/coursedays/CourseToaster'


// ===================
// Holiday Management
// ===================

// Fetch all global holidays (not deleted), sorted by date
export async function getHolidays() {
  return db.holiday.findMany({ where: { deletedAt: null }, orderBy: { date: 'asc' } })
}

// Create a new global holiday
export async function createHoliday(formData: FormData) {
  await db.holiday.create({
    data: {
      title: formData.get('title') as string,
      date: new Date(formData.get('date') as string),
    },
  })
  revalidatePath('/coursedays')
}

// Update an existing global holiday
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

// Delete a global holiday
export async function deleteHoliday(formData: FormData) {
  await db.holiday.delete({
    where: { id: formData.get('id') as string },
  })
  revalidatePath('/coursedays')
}

// ========================
// Course-specific Holidays
// ========================

// Fetch all holidays for a specific course
export async function getCourseHolidays(courseId: string) {
  return db.courseHoliday.findMany({ where: { courseId, deletedAt: null }, orderBy: { date: 'asc' } })
}

// Create a new course-specific holiday
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
  revalidatePath(`/course/${courseId}`)
  redirect(`/course/${courseId}?holiday_created=1`)
}

export async function updateCourseHoliday(formData: FormData): Promise<ActionResult> {
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
  revalidatePath(`/course/${courseId}`)
  return { message: 'Kursfeiertag erfolgreich bearbeitet!', type: 'success'}
}
export async function deleteCourseHoliday(formData: FormData): Promise<ActionResult> {
  await db.courseHoliday.delete({
    where: { id: formData.get('id') as string },
  })
  revalidatePath(`/course/${formData.get('courseId')}`)
  return { message: 'Kursfeiertag erfolgreich gelöscht!', type: 'success'}
}

// ========================
// Course Special Days
// ========================

// Fetch all special days for a course
export async function getCourseSpecialDays(courseId: string) {
  return db.courseSpecialDays.findMany({ where: { courseId, deletedAt: null }, orderBy: { startTime: 'asc' } })
}

// Helper: Convert local datetime string to ISO string (UTC, with seconds and ms)
function localDateTimeToISO(datetimeLocal: string) {
  return `${datetimeLocal}:00.000Z`
}

// Create a new special day for a course
export async function createCourseSpecialDay(formData: FormData) {
  const title = formData.get('title') as string
  const startTimeRaw = formData.get('startTime') as string
  const endTimeRaw = formData.get('endTime') as string
  const pauseRaw = formData.get('pauseDuration') as string
  const courseId = formData.get('courseId') as string

  const startTime = localDateTimeToISO(startTimeRaw)
  const endTime = localDateTimeToISO(endTimeRaw)
  const pauseDate = new Date(`2000-01-01T${pauseRaw}:00Z`)
  const pauseDuration = pauseDate.toISOString()
  
  // Prevent duplicate special days for the same start time
  const exists = await db.courseSpecialDays.findFirst({
    where: { courseId, startTime }
  })
  if (exists) {
    throw new Error('Ein besonderer Kurstag mit diesem Startzeitpunkt existiert bereits für diesen Kurs.')
  }

  await db.courseSpecialDays.create({
    data: {
      title,
      startTime,
      endTime,
      pauseDuration,
      course: {
        connect: { id: courseId }
      }
    },
  })
  revalidatePath(`/coursedays/${courseId}`)
  redirect(`/course/${courseId}?special_created=1`)
}


export async function updateCourseSpecialDay(formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const startTimeRaw = formData.get('startTime') as string
  const endTimeRaw = formData.get('endTime') as string
  const pauseRaw = formData.get('pauseDuration') as string
  const courseId = formData.get('courseId') as string

  const startTime = localDateTimeToISO(startTimeRaw)
  const endTime = localDateTimeToISO(endTimeRaw)
  const pauseDate = new Date(`2000-01-01T${pauseRaw}:00Z`)
  const pauseDuration = pauseDate.toISOString()

  await db.courseSpecialDays.update({
    where: { id },
    data: {
      title,
      startTime,
      endTime,
      pauseDuration,
    },
  })
  revalidatePath(`/coursedays/${courseId}`)
  return { message: 'Besondere Kurstag erfolgreich bearbeitet!', type: 'success' }
}

export async function deleteCourseSpecialDay(formData: FormData): Promise<ActionResult> {
  await db.courseSpecialDays.delete({
    where: { id: formData.get('id') as string },
  })
  revalidatePath(`/coursedays/${formData.get('courseId')}`)
  return { message: 'Besondere Kurstag erfolgreich gelöscht!', type: 'success' }
}

// ========================
// Course Rhythm (Weekly Schedule)
// ========================

// Helper: Convert "09:00" to ISO string for a base date (default 1970-01-01)
function timeToISO(time: string, baseDate = '1970-01-01') {
  // Converts "09:00" to "1970-01-01T09:00:00.000Z"
  return new Date(`${baseDate}T${time}:00Z`).toISOString()
}

// Fetch all rhythms for a course (sorted by weekday)
export async function getCourseRythms(courseId: string) {
  return db.courseRythm.findMany({ where: { courseId, deletedAt: null }, orderBy: { weekDay: 'asc' } })
}

// Create or update a rhythm for a course and weekday
export async function createCourseRythm(formData: FormData) {
  const weekDay = formData.get('weekDay') as WeekDay
  const startTimeRaw = formData.get('startTime') as string
  const endTimeRaw = formData.get('endTime') as string
  const pauseRaw = formData.get('pauseDuration') as string
  const courseId = formData.get('courseId') as string

  // Check if a rhythm for this weekday already exists
  const existingCourseRythm = await db.courseRythm.findFirst({
    where: { courseId, weekDay }
  })
  if (!existingCourseRythm) {
    // Create new rhythm
    const startTime = timeToISO(startTimeRaw)
    const endTime = timeToISO(endTimeRaw)
    const pauseDuration = timeToISO(pauseRaw)

    await db.courseRythm.create({
      data: {
        weekDay,
        startTime,
        endTime,
        pauseDuration,
        courseId,
      },
    })
  } else {
    // Update existing rhythm (restore if soft-deleted)
    await db.courseRythm.update({
      where: { id: existingCourseRythm.id },
      data: {
        startTime: timeToISO(startTimeRaw),
        endTime: timeToISO(endTimeRaw),
        pauseDuration: timeToISO(pauseRaw),
        deletedAt: null, // Restore if it was soft-deleted
      },
    })
  }
  revalidatePath(`/coursedays/${courseId}`)
  redirect(`/course/${courseId}?rhythmus_created=1`)
}


export async function updateCourseRythm(formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  const weekDay = formData.get('weekDay') as WeekDay
  const startTimeRaw = formData.get('startTime') as string
  const endTimeRaw = formData.get('endTime') as string
  const pauseRaw = formData.get('pauseDuration') as string
  const courseId = formData.get('courseId') as string

  // Prevent duplicate rhythms for the same weekday
  const current = await db.courseRythm.findUnique({ where: { id } })
  if (current && current.weekDay !== weekDay) {
    const exists = await db.courseRythm.findFirst({
      where: { courseId, weekDay, deletedAt: null, NOT: { id } }
    })
    if (exists) {
      throw new Error('Für diesen Wochentag existiert bereits ein Kursrhythmus für diesen Kurs.')
    }
  }

  const startTime = timeToISO(startTimeRaw)
  const endTime = timeToISO(endTimeRaw)
  const pauseDuration = timeToISO(pauseRaw)

  await db.courseRythm.update({
    where: { id },
    data: {
      weekDay,
      startTime,
      endTime,
      pauseDuration,
    },
  })
  revalidatePath(`/coursedays/${courseId}`)
  return { message: 'Kurs-Rhythmus erfolgreich bearbeitet!', type: 'success'}
}
export async function deleteCourseRythm(formData: FormData): Promise<ActionResult> {
  await db.courseRythm.delete({
    where: { id: formData.get('id') as string },
  })
  console.log('Deleted course rythm:', formData.get('id'))
  revalidatePath(`/coursedays/${formData.get('courseId')}`)
  return { message: 'Kurs-Rhythmus erfolgreich gelöscht!', type: 'success'}
  //redirect(`/coursedays/${formData.get('courseId')}`)

}