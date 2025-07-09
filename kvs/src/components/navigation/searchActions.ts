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
    return await prisma.course.findMany({
       where: {
        deletedAt: null,
        program: {
          // Filter auf das verknüpfte Programm
          deletedAt: null,
          name: { contains: query }
        }
      },
      include: {
        program: true, // Nur Daten laden, kein Filter!
      },
      take: 100
    });
  } else if (searchType === 'areas') {
    return await prisma.area.findMany({
      where: { name: { contains: query } },
      take: 10,
    });
  }
  return [];
}