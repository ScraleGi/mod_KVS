import { db } from '@/lib/db'
import { $Enums } from '../../../generated/prisma'

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

function getTitleForHoliday(date: Date, globalHolidays: 
    {
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        title: string;
        date: Date;
    }[]): string | null {
    for (const holiday of globalHolidays) {
        if (date.getFullYear() === holiday.date.getFullYear() &&
            date.getMonth() === holiday.date.getMonth() &&
            date.getDate() === holiday.date.getDate()) {
            return holiday.title
        }
    }
    return null
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
    const weekDay = testDay.getDay()
    for (let i = 0; i < courseRythms.length; i++) {
        const rhythm = courseRythms[i];
        if (rhythm.weekDay.toString() === weekDayNames[weekDay]) {
            return rhythm;
        }
    }
    return null
}

// Helper to create ISO string in UTC
function toISODate(year: number, month: number, day: number, hour: number, minute: number) {
    return new Date(Date.UTC(year, month, day, hour, minute)).toISOString()
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

    // Take over special days into courseDays
    for (const specialDay of course.courseSpecialDays) {
        await db.courseDays.create({
            data: {
                courseId: courseId,
                startTime: specialDay.startTime,
                endTime: specialDay.endTime,
                pauseDuration: specialDay.pauseDuration,
                title: specialDay.title || null,
                isCourseDay: true, // Mark as special course day
            },
        })
    }

    course.courseSpecialDays.forEach(specialDay => {
        remainingCourseHours -= calculateCourseDuration(specialDay.startTime, specialDay.endTime, specialDay.pauseDuration)
    })

    // eslint-disable-next-line prefer-const
    let testDay = new Date(course.startDate)
    const courseSpecialDays = course.courseSpecialDays.map(day => new Date(day.startTime))
    const holidays = globalHolidays.map(holiday => new Date(holiday.date))
    const courseHolidays = course.courseHolidays.map(holiday => new Date(holiday.date))

    while (remainingCourseHours > 0 && course.courseRythms.length > 0) {
        if (isCourseAllowedOnDay(testDay, courseSpecialDays)) {
            const courseDay = getCourseDayFromRhythm(testDay, course.courseRythms)
            if (courseDay) {

                if (!isCourseAllowedOnDay(testDay, holidays)) {
                    await db.courseDays.create({
                        data: {
                            courseId: courseId,
                            startTime: toISODate(testDay.getFullYear(), testDay.getMonth(), testDay.getDate(), 0, 0),
                            endTime: toISODate(testDay.getFullYear(), testDay.getMonth(), testDay.getDate(), 0, 0),
                            pauseDuration: toISODate(2000, 1, 1, 0, 0),
                            title: getTitleForHoliday(testDay, globalHolidays) || '',
                            isCourseDay: false, // Mark as holiday
                        }
                    })
                } else if (!isCourseAllowedOnDay(testDay, courseHolidays)) {
                    console.log(`Adding course day on ${testDay.toISOString()}`)
                    await db.courseDays.create({
                        data: {
                            courseId: courseId,
                            startTime: toISODate(testDay.getFullYear(), testDay.getMonth(), testDay.getDate(), 0, 0),
                            endTime: toISODate(testDay.getFullYear(), testDay.getMonth(), testDay.getDate(), 0, 0),
                            pauseDuration: toISODate(2000, 1, 1, 0, 0),
                            title: getTitleForHoliday(testDay, course.courseHolidays) || '',
                            isCourseDay: false, // Mark as holiday
                        }
                    })
                } else {
                    // Create course day in UTC
                    const startHour = courseDay.startTime.getUTCHours()
                    const startMinute = courseDay.startTime.getUTCMinutes()
                    const endHour = courseDay.endTime.getUTCHours()
                    const endMinute = courseDay.endTime.getUTCMinutes()
                    const pauseHour = courseDay.pauseDuration.getUTCHours()
                    const pauseMinute = courseDay.pauseDuration.getUTCMinutes()

                    const courseDayStartISO = toISODate(testDay.getFullYear(), testDay.getMonth(), testDay.getDate(), startHour, startMinute)
                    const courseDayEndISO = toISODate(testDay.getFullYear(), testDay.getMonth(), testDay.getDate(), endHour, endMinute)
                    const courseDayPauseISO = toISODate(2000, 1, 1, pauseHour, pauseMinute)

                    await db.courseDays.create({
                        data: {
                            courseId: courseId,
                            startTime: courseDayStartISO,
                            endTime: courseDayEndISO,
                            pauseDuration: courseDayPauseISO,
                            title: 'Kurstag',
                            isCourseDay: true, // Mark as regular course day
                        }
                    })

                    remainingCourseHours -= calculateCourseDuration(
                        new Date(courseDayStartISO),
                        new Date(courseDayEndISO),
                        new Date(courseDayPauseISO)
                    )
                    console.log(`Added course day: ${courseDayStartISO} REMAINS: ${remainingCourseHours} hours`)
                }
            }
        }
        testDay.setDate(testDay.getDate() + 1)
    
    }
      // Update course endDate to last generated course day
      const lastCourseDay = await db.courseDays.findFirst({
          where: { courseId, deletedAt: null },
          orderBy: { endTime: 'desc' },
      })

      if (lastCourseDay) {
          await db.course.update({
              where: { id: courseId },
              data: { endDate: lastCourseDay.endTime },
          })
      }

      return
}