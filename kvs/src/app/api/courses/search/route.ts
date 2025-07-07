import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/../generated/prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  if (!query) {
    return NextResponse.json([], { status: 200 });
  }

  // Case-insensitive Workaround
  const lower = query.charAt(0).toLowerCase() + query.slice(1);
  const upper = query.charAt(0).toUpperCase() + query.slice(1);

  const courses = await prisma.course.findMany({
    where: {
      OR: [
        { program: { name: { startsWith: lower } } },
        { program: { name: { startsWith: upper } } },
      ],
    },
    include: {
      program: true,
    },
    take: 10,
  });

  // Optional: Nur relevante Felder zurückgeben
  const result = courses.map(course => ({
    id: course.id,
    programName: course.program.name,
    startDate: course.startDate,
  }));

  return NextResponse.json(result);
}