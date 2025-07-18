// components/CancelButton.tsx
import Link from 'next/link';

interface CancelButtonProps {
  href: string; // Pflichtfeld
  children?: React.ReactNode; // Optionaler Button-Text
}

export default function CancelButton({ href, children = "Abbrechen" }: CancelButtonProps) {
  return (
    <Link
      href={href}
      className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 text-xs font-medium transition"
    >
      {children}
    </Link>
  );
}
