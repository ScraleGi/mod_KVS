'use server'
import { db } from '@/src/../lib/db'
import { revalidatePath } from 'next/cache'
import { WeekDay } from '../../../generated/prisma'

// --- Holiday ---
export async function getHolidays() {
  return db.holiday.findMany({ where: { deletedAt: null }, orderBy: { date: 'asc' } })
}
export async function createHoliday(formData: FormData) {
  await db.holiday.create({
    data: {
      title: formData.get('title') as string,
      date: new Date(formData.get('date') as string), // <-- convert to Date
    },
  })
  revalidatePath('/coursedays')
}
export async function updateHoliday(formData: FormData) {
  await db.holiday.update({
    where: { id: formData.get('id') as string },
    data: {
      title: formData.get('title') as string,
      date: new Date(formData.get('date') as string), // <-- convert to Date
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
  await db.courseHoliday.create({
    data: {
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      courseId: formData.get('courseId') as string,
    },
  })
  revalidatePath(`/coursedays/${formData.get('courseId')}`)
}
export async function updateCourseHoliday(formData: FormData) {
  await db.courseHoliday.update({
    where: { id: formData.get('id') as string },
    data: {
      title: formData.get('title') as string,
      date: formData.get('date') as string,
    },
  })
  revalidatePath(`/coursedays/${formData.get('courseId')}`)
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
  await db.courseSpecialDays.create({
    data: {
      title: formData.get('title') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      pauseDuration: formData.get('pauseDuration') as string,
      courseId: formData.get('courseId') as string,
    },
  })
  revalidatePath(`/coursedays/${formData.get('courseId')}`)
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