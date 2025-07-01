import { PrismaClient } from '../../../generated/prisma/client';
import Calendar from '../../components/calendar/calendar';

const prisma = new PrismaClient();

export default async function CalendarPage() {
  const courses = await prisma.course.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      startDate: true,
      program: { select: { name: true } },
      mainTrainer: { select: { name: true } },
      trainers: { select: { name: true } }
    }
  });

  const holidays = await prisma.holiday.findMany();
  //Coures-Events 
  const CourseEvents = courses.map(course => ({
    id: course.id,
    title: course.program?.name ?? 'Kurs',
    start: course.startDate.toISOString(),
    allDay: true,
    mainTrainer: course.mainTrainer?.name ?? '',
    coTrainers: course.trainers?.map(t => t.name) ?? []
  }));
  //Holiday-Events
  const holidayEvents = holidays.map(holiday => ({
    id: `holiday-${holiday.id}`,
    title: holiday.title + '(Feiertag)',
    start: holiday.date.toISOString(),
    allDay: true,
    mainTrainer: '',
    coTrainers:[]
  }));

  return <Calendar events={[...CourseEvents, ...holidayEvents]} />;
}