'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBars, FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

type NavbarProps = {
  isOpen: boolean;
  setOpen: (b: boolean) => void;
  user: string | null;
};

const Navbar = ({ isOpen, setOpen, user }: NavbarProps) => {
  const [searchType, setSearchType] = useState<'participants' | 'courses' | 'areas'>('participants');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.length === 0) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const endpoint =
      searchType === 'participants'
        ? '/api/participants/search'
        : searchType === 'courses'
        ? '/api/courses/search'
        : '/api/areas/search';

    const res = await fetch(`${endpoint}?query=${encodeURIComponent(value)}`);
    const data = await res.json();
    setResults(data);
    setShowDropdown(true);
  };

  return (
    <div className='bg-gray-800 px-4 py-2 flex justify-between items-center'>
      <div className='flex items-center text-lg space-x-15'>
        <FaBars
          onClick={() => setOpen(!isOpen)}
          className='text-white w-6 h-6 my-2 cursor-pointer transition-transform duration-150 hover:scale-110 focus:scale-110'
          tabIndex={0}
        />
        <div className="my-2 mb-4 mr-8 flex items-center gap-x-4">
          <Image
            src='/img/DCV_Signet_neg_tuerkis_WEB.svg'
            alt='Logo'
            width={40}
            height={40}
            priority
          />
          <h1 className="text-2xl text-white font-bold">Digital Campus Vorarlberg</h1>
        </div>
      </div>

      <div className='flex items-center gap-x-5'>
        {/* Suchfeld mit Dropdown im Input, beide wachsen gemeinsam */}
        <div className="relative w-80 group">
          <div className="flex items-center w-full transition-all duration-200 group-focus-within:scale-105 group-hover:scale-105">
            <select
              value={searchType}
              onChange={e => setSearchType(e.target.value as 'participants' | 'courses' | 'areas')}
              className='bg-gray-100 border-r border-gray-300 text-gray-900 rounded-l px-2 py-1 text-xs h-9 focus:outline-none transition-all duration-200'
              style={{ minWidth: '100px', maxWidth: '120px' }}
            >
              <option value="participants">Teilnehmer</option>
              <option value="courses">Kurse</option>
              <option value="areas">Areas</option>
            </select>
            <div className="relative flex-1">
              <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                <FaSearch className='text-gray-400' />
              </span>
              <input
                type='text'
                value={searchValue}
                onChange={handleSearch}
                className='w-full bg-white text-gray-900 rounded-r px-4 py-1 pl-10 shadow outline-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:shadow-lg h-9'
                placeholder={
                  searchType === 'participants'
                    ? 'Suche Teilnehmer...'
                    : searchType === 'courses'
                    ? 'Suche Kurs...'
                    : 'Suche Area...'
                }
                aria-label='Suche'
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                style={{ marginTop: '0px' }}
              />
              {showDropdown && results.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-60 overflow-auto">
                  {searchType === 'participants'
                    ? results.map((p: any) => (
                        <li key={p.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          {p.name} <span className="text-xs text-gray-400">{p.email}</span>
                        </li>
                      ))
                    : searchType === 'courses'
                    ? results.map((c: any) => (
                        <li key={c.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          {c.programName} <span className="text-xs text-gray-400">{new Date(c.startDate).toLocaleDateString()}</span>
                        </li>
                      ))
                    : results.map((a: any) => (
                        <li key={a.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          {a.name}
                        </li>
                      ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className='text-white'>
          <FaBell
            className='w-6 h-6 cursor-pointer transition-transform duration-150 hover:scale-110 focus:scale-110'
            tabIndex={0}
          />
        </div>

        <div className='text-white'>{user}</div>

        <div className='relative'>
          <button className='text-white group focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-white'>
            <FaUserCircle className='w-6 h-6 mt-1 cursor-pointer transition-transform duration-150 group-hover:scale-110 group-focus:scale-110' />
            <div className='z-10 hidden absolute bg-white rounded-lg shadow w-32 group-focus-within:block top-full right-0'>
              <ul className='py-2 text-sm text-gray-950'>
                <li>
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                </li>
                <li>
                  <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">Setting</Link>
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;