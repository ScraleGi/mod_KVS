import React from 'react'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Einstellungen</h1>
        <p className="text-gray-600 text-center mb-6">Hier könnten Ihre Einstellungen stehen.</p>
        <div className="flex justify-center">
<Link
  href="/settings/globalHolidays"
  className="text-blue-600 hover:underline font-medium flex items-center gap-2"
>
  <span>
    {/* Calendar Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-blue-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  </span>
  Globale Feiertage verwalten
</Link>
        </div>
      </div>
    </div>
  )
}