import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/../generated/prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  if (!query) {
    return NextResponse.json([], { status: 200 });
  }

  // Case-insensitive Workaround: Suche nach Groß- und Kleinschreibung
  const lower = query.charAt(0).toLowerCase() + query.slice(1);
  const upper = query.charAt(0).toUpperCase() + query.slice(1);

  const participants = await prisma.participant.findMany({
    where: {
      OR: [
        { name: { startsWith: lower } },
        { name: { startsWith: upper } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
    },
    take: 10,
  });

  return NextResponse.json(participants);
}