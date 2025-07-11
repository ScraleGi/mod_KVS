'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useToaster } from '@/components/ui/toaster';

export default function ParticipantToaster() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToaster();
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current) return;

    const paramMap: Record<string, string> = {
      created: 'Teilnehmer erfolgreich hinzugefügt!',
      edited: 'Teilnehmer erfolgreich bearbeitet!',
    };

    for (const key in paramMap) {
      if (searchParams.get(key)) {
        showToast(paramMap[key], 'success');
        shownRef.current = true;
        const params = new URLSearchParams(searchParams.toString());
        params.delete(key);
        router.replace('?' + params.toString(), { scroll: false });
        break;
      }
    }
  }, [searchParams, showToast, router]);

  return null;
}
