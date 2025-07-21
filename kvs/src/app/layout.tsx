import { Geist, Geist_Mono } from "next/font/google";
import NavAndSidebar from "@/components/navigation/navAndSidebar";
import { auth0 } from "@/lib/auth0";
import "./globals.css";
import '../styles/components.css';
import { redirect } from "next/navigation";
import { getRolesByEmail } from "@/lib/getRoles";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = undefined

  const session = await auth0.getSession();
  if (session && session.user) {
    user = session.user.email; // Nur die E-Mail speichern
  } else {
    redirect('/auth/login');
  }
  if (user === undefined) {
    redirect('/auth/login');
  }
  const roles = await getRolesByEmail(user);



  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} overflow-y-hidden`}>
        <NavAndSidebar user={user} userRoles={roles}>
          {children}
        </NavAndSidebar>
      </body>
    </html>
  );
}