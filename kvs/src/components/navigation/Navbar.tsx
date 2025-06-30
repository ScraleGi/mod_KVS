'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBars, FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

type NavbarProps = {
  isOpen: boolean;
  setOpen: (b: boolean) => void;
  user: string | null;
};

const Navbar = ({ isOpen, setOpen, user }: NavbarProps) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
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
        <div className='relative w-64'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
            <FaSearch className='text-gray-400' />
          </span>
          <input
            type='text'
            value={searchValue}
            onChange={handleSearch}
            className='w-full bg-white text-gray-900 rounded px-4 py-1 pl-10 shadow outline-none transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:shadow-lg'
            placeholder='Suche...'
            aria-label='Suche Kurse'
          />
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
