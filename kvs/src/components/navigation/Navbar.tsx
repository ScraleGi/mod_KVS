'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaBars, FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

type NavbarProps = {
    isOpen: boolean
    setOpen: (b: boolean) => void
}

const Navbar = ({ isOpen, setOpen }: NavbarProps) => {
    const [mounted, setMounted] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    return (
        <div className='bg-gray-800 px-4 py-2 flex justify-between items-center'>
            <div className='flex items-center text-lg gap-x-42'>
                <FaBars
                    onClick={() => setOpen(!isOpen)}
                    className='text-white w-6 h-6 my-2 cursor-pointer'
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
                <span className='text-white font-semibold'></span>
            </div>
            
            <div className='flex items-center gap-x-5'>
                <div className='relative w-64'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                        <FaSearch className='text-gray-400' />
                    </span>
                    {mounted && (
                        <input 
                            type='text'
                            value={searchValue}
                            onChange={handleSearch}
                            className='w-full bg-white text-gray-900 rounded px-4 py-1 pl-10 shadow outline-none transition focus:ring-1 focus:ring-gray-300 focus:shadow-lg'
                            placeholder='Suche...'
                            aria-label='Suche Kurse'
                        />
                    )}
                </div>

                <div className='text-white'>
                    <FaBell 
                        className='w-6 h-6 cursor-pointer'
                    />
                </div>

                <div className='relative'>
                    <button className='text-white group'>
                        <FaUserCircle className='w-6 h-6 mt-1 cursor-pointer'/>
                        <div className='z-10 hidden absolute bg-white rounded-lg shadow w-32 group-focus-within:block top-full right-0'>
                            <ul className='py-2 text-sm text-gray-950'>
                                <li><a href=''>Profile</a></li>
                                <li><a href=''>Setting</a></li>
                                <li><a href=''>Logout</a></li>
                            </ul>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;