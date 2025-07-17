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

    const paramMap: Record<string, { message: string; type: 'success' | 'error' }> = {
      created: { message: 'Trainer erfolgreich hinzugefügt!', type: 'success' },
      edited: { message: 'Trainer erfolgreich bearbeitet!', type: 'success' },
      deleted: { message: 'Trainer erfolgreich gelöscht!', type: 'success' },
      restored: { message: 'Trainer erfolgreich wiederhergestellt!', type: 'success' }
    };

    for (const key in paramMap) {
      if (searchParams.get(key)) {
        console.log('showToast', key)
        showToast(paramMap[key].message, paramMap[key].type);
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