'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useToaster } from '@/components/ui/toaster';

export default function SubsidyToaster() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToaster();
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current) return;

    const paramMap: Record<string, { message: string; type: 'success' | 'error' }> = {
      created: { message: 'Gutschein erfolgreich hinzugefügt!', type: 'success' },
      edited: { message: 'Gutschein erfolgreich bearbeitet!', type: 'success' },
      deleted: { message: 'Gutschein erfolgreich gelöscht!', type: 'success' },
      discountCreated: { message: 'Rabatt erfolgreich hinzugefügt!', type: 'success' },
      discountEdited: { message: 'Rabatt erfolgreich bearbeitet!', type: 'success' },
      discountDeleted: { message: 'Rabatt erfolgreich gelöscht!', type: 'success' },
    };

    for (const key in paramMap) {
      if (searchParams.get(key)) {
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