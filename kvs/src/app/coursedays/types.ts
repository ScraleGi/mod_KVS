export type Holiday = {
  id: string
  title: string
  date: string // ISO string
  createdAt: string
  deletedAt: string | null
}

export type CourseHoliday = {
  id: string
  title: string
  date: string
  createdAt: string
  deletedAt: string | null
  courseId: string
}

export type CourseSpecialDays = {
  id: string
  title: string
  startTime: string
  endTime: string
  pauseDuration: string
  createdAt: string
  deletedAt: string | null
  courseId: string
}

export type CourseRythm = {
  id: string
  title: string
  weekDay: string
  startTime: string
  endTime: string
  pauseDuration: string
  createdAt: string
  deletedAt: string | null
  courseId: string
}