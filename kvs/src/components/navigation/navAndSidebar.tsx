'use client';
import { useState } from 'react';

import Navbar from '@/components/navigation/Navbar';
import Sidebar from '@/components/navigation/Sidebar';
import { ToasterProvider } from "@/components/ui/toaster";


export default function NavAndSidebar({ user, userRoles, children }: { user: string, userRoles: { role: string }[], children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(true);

  return (
    <ToasterProvider>
      {user == null ? (
        <div className="min-h-screen flex flex-col">
          {/* Hier könntest du einen Loader anzeigen */}
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
          <Navbar isOpen={isOpen} setOpen={setOpen} user={user} />
          <div className="flex grow">
            <Sidebar isOpen={isOpen} roles={userRoles} />
            <main className="flex-1 transition-all duration-200">{children}</main>
          </div>
        </div>
      )}
    </ToasterProvider>
  );
}