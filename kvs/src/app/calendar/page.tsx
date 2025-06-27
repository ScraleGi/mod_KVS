import { PrismaClient } from '../../../generated/prisma/client';
import Calendar from './Calendar';

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

  const events = courses.map(course => ({
    id: course.id,
    title: course.program?.name ?? 'Kurs',
    start: course.startDate.toISOString(),
    mainTrainer: course.mainTrainer?.name ?? '',
    coTrainers: course.trainers?.map(t => t.name) ?? []
  }));

  return <Calendar events={events} />;
}