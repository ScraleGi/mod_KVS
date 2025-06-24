'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { useState } from 'react';
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

  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable}`}>
        <Navbar isOpen={isOpen} setOpen={setOpen} />
        <div className="flex grow">
          <Sidebar isOpen={isOpen} />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}



// 1: ABOUT SEITE 
// 2. parameter [slug] 
// 3. Db connection (mySQL2)