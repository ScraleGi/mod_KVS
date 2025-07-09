'use server';

import Link from 'next/link';
import { PrismaClient } from '@/../generated/prisma/client';

const prisma = new PrismaClient();

type Props = {
  query: string;
  searchType: 'participants' | 'courses' | 'areas';
};

function startsWithInsensitive(str: string, prefix: string) {
  return str.trim().toLocaleLowerCase().startsWith(prefix.trim().toLocaleLowerCase());
}

export default async function SearchResult({ query, searchType }: Props) {
  if (!query) return null;

  const trimmedQuery = query.trim();
  if (!trimmedQuery) return null;

  let results: any[] = [];

  if (searchType === 'participants') {
    results = await prisma.participant.findMany({ take: 100 });
    results = results.filter(p => startsWithInsensitive(p.name, trimmedQuery));
  } else if (searchType === 'courses') {
    results = await prisma.course.findMany({ take: 100 });
    results = results.filter(c => startsWithInsensitive(c.name, trimmedQuery));
  } else if (searchType === 'areas') {
    results = await prisma.area.findMany({ take: 100 });
    results = results.filter(a => startsWithInsensitive(a.name, trimmedQuery));
  }

  results = results.slice(0, 10);

  if (results.length === 0) return null;

  // Für Kurse immer auf /program/[id] verlinken
  if (searchType === 'courses') {
    return (
      <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-60 overflow-auto">
        {results.map((program) => (
          <li key={program.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <Link href={`/program/${program.id}`}>
              {program.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  // Teilnehmer und Areas wie gehabt
  return (
    <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-60 overflow-auto">
      {searchType === 'participants'
        ? results.map((p) => (
            <li key={p.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link href={`/participant/${p.id}`}>
                {p.name} <span className="text-xs text-gray-400">{p.email}</span>
              </Link>
            </li>
          ))
        : results.map((a) => (
            <li key={a.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link href={`/area/${a.id}`}>{a.name}</Link>
            </li>
          ))}
    </ul>
  );
}