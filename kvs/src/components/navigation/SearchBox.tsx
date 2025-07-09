'use client';

import React, { useState, useTransition } from 'react';
import dynamic from 'next/dynamic';

const SearchResult = dynamic(() => import('./SearchResult'), { ssr: false });

type Props = {
  searchType: 'participants' | 'courses' | 'areas';
};

export default function SearchBox({ searchType }: Props) {
  const [searchValue, setSearchValue] = useState('');
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  // Debounce: Warte kurz, bevor gesucht wird
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchValue(value);
    startTransition(() => setQuery(value));
  }

  return (
    <div className="relative w-80 group">
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        className="w-full bg-white text-gray-900 rounded px-4 py-1 shadow outline-none h-9"
        placeholder={
          searchType === 'participants'
            ? 'Suche Teilnehmer...'
            : searchType === 'courses'
            ? 'Suche Kurs...'
            : 'Suche Area...'
        }
        aria-label="Suche"
      />
      {query && <SearchResult query={query} searchType={searchType} />}
    </div>
  );
}