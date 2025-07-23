// Used in HolidayTable.tsx for displaying and managing global holidays
export type Holiday = {
  id: string
  title: string
  date: string // ISO string
  createdAt: string
  deletedAt: string | null
}

// Used in CourseHolidayTable.tsx and CourseTablesClient.tsx for course-specific holidays
export type CourseHoliday = {
  id: string
  title: string
  date: string
  createdAt: string
  deletedAt: string | null
  courseId: string
}

// Used in CourseSpecialDaysTable.tsx and CourseTablesClient.tsx for special course days
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

// Used in CourseRythmTable.tsx and CourseTablesClient.tsx for recurring course rhythm entries
export type CourseRythm = {
  id: string
  weekDay: string
  startTime: string
  endTime: string
  pauseDuration: string
  createdAt: string
  deletedAt: string | null
  courseId: string
}