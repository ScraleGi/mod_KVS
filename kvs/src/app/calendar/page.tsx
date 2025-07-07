import Calendar from '@/components/calendar/calendar';
import { db } from '@/lib/db';
import { sanitize } from '@/lib/sanitize';
import { Holiday } from '@/types/models';
import { CourseWithCalendarRelations, CalendarEvent } from '@/types/query-models';
import { formatDateToISO } from '@/lib/dateUtils';

export default async function CalendarPage() {
  // Fetch courses and their related data
  const courses = await db.course.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      startDate: true,
      program: { select: { name: true } },
      mainTrainer: { select: { name: true } },
      trainers: { select: { name: true } }
    }
  });

  // Fetch holidays
  const holidays = await db.holiday.findMany();
  
  // Sanitize data to handle any Decimal values
  const sanitizedCourses = sanitize<typeof courses, CourseWithCalendarRelations[]>(courses);
  const sanitizedHolidays = sanitize<typeof holidays, Holiday[]>(holidays);

  // Convert courses to calendar events
  const courseEvents: CalendarEvent[] = sanitizedCourses.map(course => ({
    id: course.id,
    title: course.program?.name ?? 'Kurs',
    start: formatDateToISO(course.startDate),
    allDay: true,
    mainTrainer: course.mainTrainer?.name ?? '',
    coTrainers: course.trainers?.map(t => t.name) ?? []
  }));

  // Convert holidays to calendar events
  const holidayEvents: CalendarEvent[] = sanitizedHolidays.map(holiday => ({
    id: `holiday-${holiday.id}`,
    title: `${holiday.title} (Feiertag)`,
    start: formatDateToISO(holiday.date),
    allDay: true,
    mainTrainer: '',
    coTrainers: []
  }));

  // Combine all events and render the calendar
  return <Calendar events={[...courseEvents, ...holidayEvents]} />;
}