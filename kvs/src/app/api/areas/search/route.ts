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

  const areas = await prisma.area.findMany({
    where: {
      OR: [
        { name: { startsWith: lower } },
        { name: { startsWith: upper } },
      ],
    },
    take: 10,
  });

  const result = areas.map(area => ({
    id: area.id,
    name: area.name,
  }));

  return NextResponse.json(result);
}