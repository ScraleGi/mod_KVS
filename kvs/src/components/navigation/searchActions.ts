'use server';

import { PrismaClient } from '@/../generated/prisma/client';
import { db } from '@/lib/db'; // Assuming you have a db module to handle Prisma client

const prisma = new PrismaClient();

export type SearchResult = {
  id: string;
 createdAt: Date;
    course: {
        code: string;
        program: {
            name: string;
        };
    };
    participant: {
        name: string;
        surname: string;
    };
};

export async function searchEntities2(query: string): Promise<SearchResult[]> {
  if (!query) return [];

  const searchCriteria = query
  let searchName = 'XXXXXXXXXXXXXXXXXXX'
  let searchSurname = 'XXXXXXXXXXXXXXXXXXX'

    const tokens = searchCriteria.split(' ')
    if (tokens.length > 1) {
        searchName = tokens[0]
        searchSurname = tokens[1]
    }

    const courseRegistrations = await db.courseRegistration.findMany({
        where: { 
            deletedAt: null, 
            participant: { 
                deletedAt: null,
                OR: [
                    { name: { contains: searchCriteria } },
                    { surname: { contains: searchCriteria } },
                    {
                        AND: [
                            { name: { contains: searchName } },
                            { surname: { contains: searchSurname } }
                        ]
                    },
                ]
            },
            course: { 
                deletedAt: null,
                program: { deletedAt: null }
            },
        },
        select: {
            id: true,
            createdAt: true,
            participant: {
                select: {
                    name: true,
                    surname: true,
                }
            },
            course: {
                select: {
                    code: true,
                    program: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
    })

    // console.log('Course Registrations:', courseRegistrations)
    return courseRegistrations
}

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