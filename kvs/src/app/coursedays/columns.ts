import { Holiday, CourseHoliday, CourseSpecialDays, CourseRythm } from './types'

export const holidayColumns = [
  { key: 'title', label: 'Titel' },
  { key: 'date', label: 'Datum' },
]

export const courseHolidayColumns = [
  { key: 'title', label: 'Titel' },
  { key: 'date', label: 'Datum' },
]

export const courseSpecialDaysColumns = [
  { key: 'title', label: 'Titel' },
  { key: 'startTime', label: 'Startzeit' },
  { key: 'endTime', label: 'Endzeit' },
  { key: 'pauseDuration', label: 'Pause' },
]

export const courseRythmColumns = [
  { key: 'title', label: 'Titel' },
  { key: 'weekDay', label: 'Wochentag' },
  { key: 'startTime', label: 'Startzeit' },
  { key: 'endTime', label: 'Endzeit' },
  { key: 'pauseDuration', label: 'Pause' },
]