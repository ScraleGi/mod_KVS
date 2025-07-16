import { getHolidays } from './actions'
import { HolidayTable } from './components/HolidayTable'
import { formatDateISO } from '../../lib/utils'

export default async function HolidaysPage() {
  const holidaysRaw = await getHolidays()
  const holidays = holidaysRaw.map(h => ({
    ...h,
    date: formatDateISO(h.date),
    createdAt: formatDateISO(h.createdAt),
    deletedAt: h.deletedAt ? formatDateISO(h.deletedAt) : null,
  }))
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-200 flex flex-col items-center py-16 px-2">
      <div className="w-full max-w-2xl bg-white/80 rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight text-center">
          Öffentliche Feiertage
        </h1>
        <HolidayTable holidays={holidays} />
      </div>
    </main>
  )
}