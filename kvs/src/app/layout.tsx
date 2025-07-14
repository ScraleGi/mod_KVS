'use client';
import { UserContext } from "@/context/UserEmailContext";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState, createContext } from 'react';
import { useRouter } from 'next/navigation'
import { ToasterProvider } from "@/components/ui/toaster";
import Sidebar from '@/components/navigation/Sidebar';
import Navbar from '@/components/navigation/Navbar';
import "./globals.css";
import '../styles/components.css';
import { create } from "domain";

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
  const [isOpen, setOpen] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/session');
        const data = await res.json();
        if (data.user) {
          setUser(data.user.email);
        } else {
          setUser(null);
          router.push('/auth/login')
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setUser(null);
        router.push('/auth/login')
      }
    };
    checkAuth();
  }, [router]);

  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UserContext.Provider value={user}>
          <ToasterProvider>
            {user == null ? (
              <div className="min-h-screen flex flex-col">
                {/* Hier könntest du einen Loader anzeigen */}
              </div>
            ) : (
              <div className="min-h-screen flex flex-col">
                <Navbar isOpen={isOpen} setOpen={setOpen} user={user} />
                <div className="flex grow">
                  <Sidebar isOpen={isOpen} />
                  <main className="flex-1 transition-all duration-200">{children}</main>
                </div>
              </div>
            )}
          </ToasterProvider>
        </UserContext.Provider>
      </body>
    </html>
  );
}