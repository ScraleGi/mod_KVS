import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to German locale format (DD.MM.YYYY)
 */
export function formatDateGerman(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('de-DE')
}

export function formatDateTimeGerman(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('de-DE', {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })
}

/**
 * Format date to ISO format (YYYY-MM-DD) for form inputs
 */
export function formatDateISO(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]  // YYYY-MM-DD
}

/**
 * Format date to a readable display format
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString()
}

// Utility functions for working with model data
export function formatFullName(person: { name: string, surname: string, title?: string | null }): string {
  return [person.title, person.name, person.surname]
    .filter(Boolean)
    .join(' ')
}

export function formatCurrency(amount: string | null): string {
  if (!amount) return '€0.00'
  return `€${parseFloat(amount).toFixed(2)}`
}