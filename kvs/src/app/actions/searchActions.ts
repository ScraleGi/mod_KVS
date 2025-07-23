'use server';

import { db } from '@/lib/db';

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

/**
 * Search for course registrations by participant name or surname.
 * If the query contains two words, treat as name + surname for AND search.
 * Returns up to 5 most recent matches.
 */
export async function searchEntities(query: string): Promise<SearchResult[]> {
  if (!query) return [];

  const searchCriteria = query;
  let searchName = 'XXXXXXXXXXXXXXXXXXX';
  let searchSurname = 'XXXXXXXXXXXXXXXXXXX';

  // If query contains two tokens, use as name and surname for AND search
  const tokens = searchCriteria.split(' ');
  if (tokens.length > 1) {
    searchName = tokens[0];
    searchSurname = tokens[1];
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
  });

  return courseRegistrations;
}