import Calendar from '@/components/calendar/calendar';
import { db } from '@/lib/db';
import { sanitize } from '@/lib/sanitize';
import { Holiday } from '@/types/models';
import { CalendarEvent } from '@/types/query-models';
import { formatDateToISO } from '@/lib/dateUtils';
import { getAuthorizing } from '@/lib/getAuthorizing';

// Color palette for overlapping courses
const colorPalette = [
  'rgba(34,197,94,0.18)',   // green
  'rgba(59,130,246,0.18)',  // blue
  'rgba(244,63,94,0.18)',   // red
  'rgba(234,179,8,0.18)',   // yellow
  'rgba(168,85,247,0.18)',  // purple
  'rgba(16,185,129,0.18)',  // teal
  'rgba(251,191,36,0.18)',  // amber
];
function getCourseColor(courseId: string) {
  let hash = 0;
  for (let i = 0; i < courseId.length; i++) {
    hash = courseId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPalette[Math.abs(hash) % colorPalette.length];
}

// Helper: check if a date range overlaps any holiday
function isCourseDayOnHoliday(start: string, end: string, holidayDateSet: Set<string>) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  for (
    let d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    d <= endDate;
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = d.toISOString().slice(0, 10);
    if (holidayDateSet.has(dateStr)) return true;
  }
  return false;
}

// Helper: subtract 2 hours in summer (CEST), 1 hour in winter (CET) for Berlin timezone
function minusBerlinOffset(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
  const year = d.getFullYear();

  // DST starts last Sunday in March
  const march = new Date(Date.UTC(year, 2, 31));
  const startDST = new Date(Date.UTC(year, 2, 31 - march.getUTCDay()));
  // DST ends last Sunday in October
  const october = new Date(Date.UTC(year, 9, 31));
  const endDST = new Date(Date.UTC(year, 9, 31 - october.getUTCDay(), 1)); // 1:00 UTC is DST end

  const utcTime = Date.UTC(
    d.getFullYear(), d.getMonth(), d.getDate(),
    d.getHours(), d.getMinutes(), d.getSeconds()
  );

  if (utcTime >= startDST.getTime() && utcTime < endDST.getTime()) {
    // Summer time (CEST): subtract 2 hours
    d.setHours(d.getHours() - 2);
  } else {
    // Winter time (CET): subtract 1 hour
    d.setHours(d.getHours() - 1);
  }
  return d.toISOString();
}

export default async function CalendarPage() {
  // Fetch all courses with code, name, and related course days
  const courses = await db.course.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      code: true,
      program: { select: { name: true } },
      mainTrainer: { select: { name: true } },
      trainers: { select: { name: true } },
      courseDays: {
        where: { deletedAt: null },
        select: {
          id: true,
          startTime: true,
          endTime: true,
        }
      }
    }
  });

  // Fetch holidays
  const holidays = await db.holiday.findMany();

  // Sanitize data
  const sanitizedCourses = sanitize<typeof courses, typeof courses>(courses);
  const sanitizedHolidays = sanitize<typeof holidays, Holiday[]>(holidays);

  // Build a set of holiday date strings (YYYY-MM-DD)
  const holidayDateSet = new Set(
    sanitizedHolidays.map(h => formatDateToISO(h.date).slice(0, 10))
  );

  // Map course days to timed calendar events (not allDay), but skip if on any holiday
  const courseDayEvents: CalendarEvent[] = sanitizedCourses.flatMap(course =>
    (course.courseDays ?? [])
      .filter(day => !isCourseDayOnHoliday(
        minusBerlinOffset(day.startTime),
        minusBerlinOffset(day.endTime),
        holidayDateSet
      ))
      .map(day => ({
        id: `courseDay-${day.id}`,
        title: course.code ?? '',
        start: minusBerlinOffset(day.startTime),
        end: minusBerlinOffset(day.endTime),
        allDay: false,
        mainTrainer: course.mainTrainer?.name ?? '',
        coTrainers: course.trainers?.map(t => t.name) ?? [],
        color: getCourseColor(course.id),
        extendedProps: { courseId: course.id },
      }))
  );

  // Map holidays to all-day events (no hour shift for holidays)
  const holidayEvents: CalendarEvent[] = sanitizedHolidays.map(holiday => ({
    id: `holiday-${holiday.id}`,
    title: `${holiday.title} (Feiertag)`,
    start: formatDateToISO(holiday.date),
    allDay: true,
    mainTrainer: '',
    coTrainers: []
  }));

  // Check user authorization
  await getAuthorizing({
    privilige: ['ADMIN', 'PROGRAMMMANAGER', 'TRAINER', 'RECHNUNGSWESEN', 'MARKETING'],
  });

  // Combine all events and render the calendar
  return (
    <Calendar
      events={[...courseDayEvents, ...holidayEvents]}
    />
  );
}