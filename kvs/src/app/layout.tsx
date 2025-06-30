'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/navigation/Sidebar';
import Navbar from '@/components/navigation/Navbar';
import "./globals.css";
import '../styles/components.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
// State für Sidebar-Öffnen/Schließen
const [isOpen, setOpen] = useState(true);
const [user, setUser] = useState(null);
const router = useRouter()

  // Abrufen der Session über eine eigene API-Route
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/session');
        const data = await res.json();
        console.log('dat', data)
        if (data.user){
          setUser(data.user.email);
        } else {
          setUser(null);
          router.push('/auth/login')
        }
      } catch (error) {
        setUser(null);
        router.push('/auth/login')
      }
    };
    checkAuth();
  }, []);

  if (user == null){
    return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable}`}>
      </body>
    </html>      
    )
  }


  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable}`}>
        <Navbar isOpen={isOpen} setOpen={setOpen} user={user}/>
        <div className="flex grow">
          <Sidebar isOpen={isOpen} />
          <main className="flex-1 transition-all duration-200">{children}</main>
        </div>
      </body>
    </html>
  );
}



// 1: ABOUT SEITE 
// 2. parameter [slug] 
// 3. Db connection (mySQL2)
