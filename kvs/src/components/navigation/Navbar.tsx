'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBars, FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import { searchEntities, SearchResult } from '../../app/actions/searchActions';

type NavbarProps = {
  isOpen: boolean;
  setOpen: (b: boolean) => void;
  user: string | null;
};

const Navbar = ({ isOpen, setOpen, user }: NavbarProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Handles live search input and dropdown display
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.length === 0) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const data = await searchEntities(value);

    setResults(data);
    setShowDropdown(true);
  };

  return (
    <div className='bg-gray-800 px-4 py-2 flex justify-between items-center'>
      {/* Left: Sidebar toggle and logo */}
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

      {/* Center/Right: Search, user, profile, notifications */}
      <div className='flex items-center gap-x-5'>
        {/* Search input with dropdown results */}
        <div className="relative w-80 group">
          <div className="relative flex items-center w-full z-100">
            <div className="relative flex-1">
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 ml-10'>
                <FaSearch className='text-gray-400' />
              </span>
              <input
                type='text'
                value={searchValue}
                onChange={handleSearch}
                className='w-68 ml-10 transition-all duration-200 bg-white text-gray-900 rounded-xl px-3 py-1 pl-10 h-10 outline-none'
                placeholder='Suche Kursteilnehmer...'
                aria-label='Suche'
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                style={{ marginTop: '0px' }}
              />

              {/* Dropdown with search results */}
              {showDropdown && results.length > 0 && (
                <ul className="absolute bg-white border w-full mt-1 rounded shadow overflow-auto z-50">
                  {results.map((searchResult: SearchResult) => (
                    <li key={searchResult.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <Link href={`/courseregistration/${searchResult.id}`} onClick={() => setShowDropdown(false)}>
                        {searchResult.participant.name} {searchResult.participant.surname}
                        <br />
                        <span className="text-sm text-gray-400">
                          {searchResult.course.code} - {searchResult.course.program.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Display logged-in user */}
        <div className='text-white italic skew-x-1'>{user}</div>

        {/* User profile dropdown */}
        <div className='relative'>
          <button className='text-white group focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-white'>
            <FaUserCircle className='w-6 h-6 mt-1 cursor-pointer transition-transform duration-150 group-hover:scale-110 group-focus:scale-110' />
            <div className='z-10 hidden absolute bg-white rounded-lg shadow w-32 group-focus-within:block top-full right-0'>
              <ul className='py-2 text-sm text-gray-950'>
                <li>
                  <Link href="/profile" className='block px-4 py-2 hover:bg-gray-100'>Profil</Link>
                </li>
                <li>
                  <Link href="/settings" className='block px-4 py-2 hover:bg-gray-100'>Einstellungen</Link>
                </li>
                <li>
                  <Link href="/auth/logout" className="block px-4 py-2 text-red-500 hover:bg-gray-100 hover:text-red-600">
                    Abmelden
                  </Link>
                </li>
              </ul>
            </div>
          </button>
        </div>

        {/* Notifications bell */}
        <div className='text-white'>
          <FaBell
            className='w-6 h-6 cursor-pointer transition-transform duration-150 hover:scale-110 focus:scale-110'
            tabIndex={0}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;