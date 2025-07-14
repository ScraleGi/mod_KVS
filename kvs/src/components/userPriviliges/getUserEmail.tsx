'use client';
import { useUser } from "@/context/UserEmailContext";
import NewAreaPage from '@/app/area/new/page'; // Adjust the path as necessary

export default function NewAreaPageClient() {
  const userEmail = useUser();
  if (!userEmail) return null; // oder Loader

  return <NewAreaPage email={userEmail} />;
}