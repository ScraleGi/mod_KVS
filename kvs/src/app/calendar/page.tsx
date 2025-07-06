import Calendar from '@/components/calendar/calendar';
import { db } from '@/lib/db';
import { sanitize } from '@/lib/sanitize';
import { Course, Holiday } from '@/types/models';

// Define interface for the course query result shape
interface CourseWithRelations {
  id: string;
  startDate: Date;
  program: { name: string } | null;
  mainTrainer: { name: string } | null;
  trainers: { name: string }[];
}

// Define interface for calendar events
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  allDay: boolean;
  mainTrainer: string;
  coTrainers: string[];
}

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
  const sanitizedCourses = sanitize<typeof courses, CourseWithRelations[]>(courses);
  const sanitizedHolidays = sanitize<typeof holidays, Holiday[]>(holidays);

  // Convert courses to calendar events
  const courseEvents: CalendarEvent[] = sanitizedCourses.map(course => ({
    id: course.id,
    title: course.program?.name ?? 'Kurs',
    start: course.startDate.toISOString(),
    allDay: true,
    mainTrainer: course.mainTrainer?.name ?? '',
    coTrainers: course.trainers?.map(t => t.name) ?? []
  }));

  // Convert holidays to calendar events
  const holidayEvents: CalendarEvent[] = sanitizedHolidays.map(holiday => ({
    id: `holiday-${holiday.id}`,
    title: `${holiday.title} (Feiertag)`,
    start: holiday.date.toISOString(),
    allDay: true,
    mainTrainer: '',
    coTrainers: []
  }));

  // Combine all events and render the calendar
  return <Calendar events={[...courseEvents, ...holidayEvents]} />;
}