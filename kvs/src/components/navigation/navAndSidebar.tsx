'use client';
import { useState } from 'react';

import Navbar from '@/components/navigation/Navbar';
import Sidebar from '@/components/navigation/Sidebar';
import { ToasterProvider } from "@/components/ui/toaster";

// Layout with Navbar, Sidebar, and main content area
export default function NavAndSidebar({
  user,
  userRoles,
  children
}: {
  user: string,
  userRoles: { role: string }[],
  children: React.ReactNode
}) {
  const [isOpen, setOpen] = useState(true);

  return (
    <ToasterProvider>
      {user == null ? (
        // Show empty layout if user is not loaded
        <div className="min-h-screen flex flex-col" />
      ) : (
        <div className="h-screen flex flex-col">
          <Navbar isOpen={isOpen} setOpen={setOpen} user={user} />
          <div className="h-[calc(100%-6rem)] flex grow">
            <Sidebar isOpen={isOpen} roles={userRoles} />
            <main className="flex-1 transition-all duration-200 overflow-x-auto">
              {children}
            </main>
          </div>
        </div>
      )}
    </ToasterProvider>
  );
}