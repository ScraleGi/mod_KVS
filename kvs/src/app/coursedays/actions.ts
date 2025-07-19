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
function localDateTimeToISO(datetimeLocal: string) {
  return `${datetimeLocal}:00.000Z`
}

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
}

export async function updateCourseSpecialDay(formData: FormData) {
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
}
export async function deleteCourseSpecialDay(formData: FormData) {
  await db.courseSpecialDays.update({
    where: { id: formData.get('id') as string },
    data: { deletedAt: new Date() },
  })
  revalidatePath(`/coursedays/${formData.get('courseId')}`)
}

// --- CourseRythm ---
function timeToISO(time: string, baseDate = '1970-01-01') {
  // Converts "09:00" to "1970-01-01T09:00:00.000Z"
  return new Date(`${baseDate}T${time}:00Z`).toISOString()
}

export async function getCourseRythms(courseId: string) {
  return db.courseRythm.findMany({ where: { courseId, deletedAt: null }, orderBy: { weekDay: 'asc' } })
}
export async function createCourseRythm(formData: FormData) {
  const weekDay = formData.get('weekDay') as WeekDay
  const startTimeRaw = formData.get('startTime') as string
  const endTimeRaw = formData.get('endTime') as string
  const pauseRaw = formData.get('pauseDuration') as string
  const courseId = formData.get('courseId') as string

  const existingCourseRythm = await db.courseRythm.findFirst({
    where: { courseId, weekDay }
  })
  if (!existingCourseRythm) {
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
}

export async function updateCourseRythm(formData: FormData) {
  const id = formData.get('id') as string
  const weekDay = formData.get('weekDay') as WeekDay
  const startTimeRaw = formData.get('startTime') as string
  const endTimeRaw = formData.get('endTime') as string
  const pauseRaw = formData.get('pauseDuration') as string
  const courseId = formData.get('courseId') as string

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
}
export async function deleteCourseRythm(formData: FormData) {
  await db.courseRythm.update({
    where: { id: formData.get('id') as string },
    data: { deletedAt: new Date() },
  })
  console.log('Deleted course rythm:', formData.get('id'))
  //revalidatePath(`/coursedays/${formData.get('courseId')}`)
  //redirect(`/coursedays/${formData.get('courseId')}`)
}