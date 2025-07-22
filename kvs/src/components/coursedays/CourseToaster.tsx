'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useToaster } from '@/components/ui/toaster'

export type ActionResult = { message: string; type: 'success' | 'error' }

const paramMap: Record<string, ActionResult> = {
  holiday_created: { message: 'Kursfeiertag erfolgreich hinzugefügt!', type: 'success' },
  holiday_edited: { message: 'Kursfeiertag erfolgreich bearbeitet!', type: 'success' },
  holiday_deleted: { message: 'Kursfeiertag erfolgreich gelöscht!', type: 'success' },
  special_created: { message: 'Besonderer Kurstag erfolgreich hinzugefügt!', type: 'success' },
  special_edited: { message: 'Besonderer Kurstag erfolgreich bearbeitet!', type: 'success' },
  special_deleted: { message: 'Besonderer Kurstag erfolgreich gelöscht!', type: 'success' },
  rhythmus_created: { message: 'Kurs-Rhythmus erfolgreich hinzugefügt!', type: 'success' },
  rhythmus_edited: { message: 'Kurs-Rhythmus erfolgreich bearbeitet!', type: 'success' },
  rhythmus_deleted: { message: 'Kurs-Rhythmus erfolgreich gelöscht!', type: 'success' },
  days_generated: { message: 'Kurstage erfolgreich generiert!', type: 'success'}
}

export default function CourseToaster() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { showToast } = useToaster()
  const shownRef = useRef(false)

  useEffect(() => {
    if (shownRef.current) return

    for (const key in paramMap) {
      if (searchParams.get(key)) {
        showToast(paramMap[key].message, paramMap[key].type)
        shownRef.current = true
        const params = new URLSearchParams(searchParams.toString())
        params.delete(key)
        router.replace('?' + params.toString(), { scroll: false })
        break
      }
    }
  }, [searchParams, showToast, router])

  return null
}