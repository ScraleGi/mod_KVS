'use server';

import { PrismaClient } from '@/../generated/prisma/client';

const prisma = new PrismaClient();

export async function searchEntities(query: string, searchType: 'participants' | 'courses' | 'areas') {
  if (!query) return [];

  if (searchType === 'participants') {
    return await prisma.participant.findMany({
      where: { name: { contains: query } },
      take: 10,
    });
  } else if (searchType === 'courses') {
    return await prisma.program.findMany({
      where: { name: { contains: query } },
      take: 10,
    });
  } else if (searchType === 'areas') {
    return await prisma.area.findMany({
      where: { name: { contains: query } },
      take: 10,
    });
  }
  return [];
}