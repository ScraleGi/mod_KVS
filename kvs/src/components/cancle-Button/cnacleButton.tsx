// components/CancelButton.tsx
"use client";
import { useRouter } from 'next/navigation';

interface CancelButtonProps {
  children?: React.ReactNode; // Optionaler Button-Text
}



export default function CancelButton({ children = "Abbrechen" }: CancelButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 text-xs font-medium transition"
    >
      {children}
    </button>
  );
}
