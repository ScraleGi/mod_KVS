import Calendar from '@/components/calendar/calendar';
import { db } from '@/lib/db';
import { sanitize } from '@/lib/sanitize';
import { Holiday } from '@/types/models';
import { CalendarEvent } from '@/types/query-models';
import { formatDateToISO } from '@/lib/dateUtils';
import { getAuthorizing } from '@/lib/getAuthorizing';

// ---- Color Palette for Courses ----
const colorPalette = [
  'rgba(34,197,94,0.18)',   // green
  'rgba(59,130,246,0.18)',  // blue
  'rgba(244,63,94,0.18)',   // red
  'rgba(234,179,8,0.18)',   // yellow
  'rgba(168,85,247,0.18)',  // purple
  'rgba(16,185,129,0.18)',  // teal
  'rgba(251,191,36,0.18)',  // amber
];

// Assign a color to a course based on its ID (stable hashing)
function getCourseColor(courseId: string) {
  let hash = 0;
  for (let i = 0; i < courseId.length; i++) {
    hash = courseId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPalette[Math.abs(hash) % colorPalette.length];
}

// Adjusts a date string for Berlin timezone offset (DST aware)
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
  // 1. Fetch all courses with their code, trainers, and course days
  const courses = await db.course.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      code: true,
      program: { select: { name: true } },
      mainTrainer: { select: { name: true } },
      trainers: { select: { name: true } },
      courseDays: {
        where: { deletedAt: null, isCourseDay: true },
        select: {
          id: true,
          startTime: true,
          endTime: true,
        }
      }
    }
  });

  // 2. Fetch all holidays
  const holidays = await db.holiday.findMany();

  // 3. Sanitize data for safety
  const sanitizedCourses = sanitize<typeof courses, typeof courses>(courses);
  const sanitizedHolidays = sanitize<typeof holidays, Holiday[]>(holidays);

  // 4. Build a set of holiday date strings (YYYY-MM-DD)
  const holidayDateSet = new Set(
    sanitizedHolidays.map(h => formatDateToISO(h.date).slice(0, 10))
  );

  // 5. Map course days to calendar events, skipping those that overlap with holidays
  const courseDayEvents: CalendarEvent[] = sanitizedCourses.flatMap(course =>
    (course.courseDays ?? [])
      .filter(day => !holidayDateSet.has(minusBerlinOffset(day.startTime).slice(0, 10)))
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

  // 6. Map holidays to all-day calendar events
  const holidayEvents: CalendarEvent[] = sanitizedHolidays.map(holiday => ({
    id: `holiday-${holiday.id}`,
    title: `${holiday.title} (Feiertag)`,
    start: new Date(holiday.date).toISOString().slice(0, 10), // "YYYY-MM-DD"
    allDay: true,
    mainTrainer: '',
    coTrainers: []
  }));

  // 7. Check user authorization for calendar access
  await getAuthorizing({
    privilige: ['ADMIN', 'PROGRAMMMANAGER', 'TRAINER', 'RECHNUNGSWESEN', 'MARKETING'],
  });

  // 8. Combine all events and render the calendar, pass holidayDateSet for cell highlighting
  return (
    <Calendar
      events={[...courseDayEvents, ...holidayEvents]}
      holidayDates={holidayDateSet}
    />
  );
}