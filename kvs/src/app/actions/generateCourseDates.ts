import { db } from '@/lib/db'
import { $Enums } from '../../../generated/prisma'
import { redirect } from 'next/navigation'

function calculateCourseDuration(start: Date, end: Date, pause: Date): number {
    const msPerMinute = 1000 * 60
    const msPerHour = msPerMinute * 60

    pause = new Date(pause.getTime() - 60 * 60 * 1000) // Adjust pause to be in the same timezone as start and end
    const pauseMs = pause.getHours() * msPerHour + pause.getMinutes() * msPerMinute
    const durationMs = end.getTime() - start.getTime() - pauseMs
    const durationHours = durationMs / msPerHour

    return durationHours
}



function isCourseAllowedOnDay(date: Date, checkDays: Date[]): boolean {
    for (const checkDate of checkDays) {
        if (date.getFullYear() === checkDate.getFullYear() &&
            date.getMonth() === checkDate.getMonth() &&
            date.getDate() === checkDate.getDate()) {
            return false // Course is not allowed on this day
        } 
    }
    return true
}


const weekDayNames = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
]
function getCourseDayFromRhythm(testDay: Date, courseRythms: { courseId: string; id: string; createdAt: Date; deletedAt: Date | null; weekDay: $Enums.WeekDay; startTime: Date; endTime: Date; pauseDuration: Date }[]) {
    const weekDay = testDay.getDay() // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    for (let i = 0; i < courseRythms.length; i++) {
        const rhythm = courseRythms[i];
        if (rhythm.weekDay.toString() === weekDayNames[weekDay]) {
            return rhythm;
        }
    }

    return null // No matching rhythm found for the day 
}


export default async function generateCourseDates(formData: FormData) {
  'use server'
    const courseId = formData.get('courseId') as string
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        courseRythms: true,
        courseHolidays: true,
        courseSpecialDays: true,
        program: {
          select: {
            teachingUnits: true,
          },
        },
      },
    })
    if (!course) {
        return
    }   

    if (course.courseRythms.length === 0 && course?.courseSpecialDays.length === 0) {
        console.error('No course rhythms or special days found for this course.')
        return
    }

    await db.courseDays.deleteMany({
      where: {
        courseId: courseId,
      },
    })
    const globalHolidays = await db.holiday.findMany()

    let remainingCourseHours = course.program.teachingUnits ?? 0

    // Take over special days into courseDays (serial, not parallel)
    for (const specialDay of course.courseSpecialDays) {
      await db.courseDays.create({
        data: {
          courseId: courseId,
          startTime: specialDay.startTime,
          endTime: specialDay.endTime,
          pauseDuration: specialDay.pauseDuration,
          title: specialDay.title || null,
        },
      })
    }

    for (const specialDay of course.courseSpecialDays) {
      remainingCourseHours -= calculateCourseDuration(specialDay.startTime, specialDay.endTime, specialDay.pauseDuration)
    }

    let testDay = new Date(course.startDate)
    const courseSpecialDays = course.courseSpecialDays.map(day => new Date(day.startTime))
    const holidays = globalHolidays.map(holiday => new Date(holiday.date))
    const courseHolidays = course.courseHolidays.map(holiday => new Date(holiday.date))
    while (remainingCourseHours > 0 && course.courseRythms.length > 0) {
      if (isCourseAllowedOnDay(testDay, courseSpecialDays) &&
          isCourseAllowedOnDay(testDay, holidays) && 
          isCourseAllowedOnDay(testDay, courseHolidays)){

          const courseDay = getCourseDayFromRhythm(testDay, course.courseRythms)
          if (courseDay) {
              const courseDayStart = new Date(testDay.getFullYear(), testDay.getMonth(), testDay.getDate(), courseDay.startTime.getHours(), courseDay.startTime.getMinutes())
              const courseDayEnd = new Date(testDay.getFullYear(), testDay.getMonth(), testDay.getDate(), courseDay.endTime.getHours(), courseDay.endTime.getMinutes())
              const courseDayPause = new Date(2000, 1, 1, courseDay.pauseDuration.getHours(), courseDay.pauseDuration.getMinutes())

              await db.courseDays.create({
              data: {
                  courseId: courseId,
                  startTime: courseDayStart,
                  endTime: courseDayEnd,
                  pauseDuration: courseDayPause,
                  title: 'Kurstag',
              }})

              remainingCourseHours -= calculateCourseDuration(courseDayStart, courseDayEnd, courseDayPause)
              console.log(`Added course day: ${courseDayStart.toISOString()} REMAINS: ${remainingCourseHours} hours`)
          }
      }
      testDay.setDate(testDay.getDate() + 1) // Move to the next day
    }
    redirect(`/course/${courseId}`) 
}