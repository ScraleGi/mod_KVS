'use client'
import CancelButton from '@/components/cancle-Button/cnacleButton'
import React, { useState } from 'react'

export default function DiscountClientLogic({
  onSubmit,
  programPrice,
}: {
  onSubmit: (formData: FormData) => void | Promise<void>
  programPrice: number
}) {
  const [euro, setEuro] = useState('')
  const [percent, setPercent] = useState('')
  const [error, setError] = useState<string | null>(null)

  function format(val: string) {
    return val.replace(/[^0-9.,]/g, '').replace(',', '.')
  }

  function handleEuroChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = format(e.target.value)
    setEuro(val)
    if (!val || isNaN(Number(val))) {
      setPercent('')
      setError(null)
      return
    }
    const euroValue = parseFloat(val)
    if (euroValue > programPrice) {
      setError('Der Rabatt darf nicht größer als der Programmpreis sein.')
      setPercent('')
      return
    }
    setError(null)
    const percentValue = (euroValue / programPrice) * 100
    setPercent(percentValue ? percentValue.toFixed(2) : '')
  }

  function handlePercentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = format(e.target.value)
    setPercent(val)
    if (!val || isNaN(Number(val))) {
      setEuro('')
      setError(null)
      return
    }
    const percentValue = parseFloat(val)
    if (percentValue > 100) {
      setError('Der Rabatt darf nicht mehr als 100% betragen.')
      setEuro('')
      return
    }
    setError(null)
    const euroValue = (percentValue / 100) * programPrice
    setEuro(euroValue ? euroValue.toFixed(2) : '')
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (error) {
      e.preventDefault()
      return
    }
    // Always submit euro value before native submit
    const form = e.target as HTMLFormElement
    const euroInput = form.elements.namedItem('amount') as HTMLInputElement
    euroInput.value = euro
    // Do NOT prevent default, let the browser submit the form for server action/redirect
  }

  return (
    <form action={onSubmit} onSubmit={handleSubmit} className="mt-8 space-y-4">
      <h2 className="text-lg font-bold">Rabatt hinzufügen</h2>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm">Betrag (€)</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            min={0}
            max={programPrice}
            value={euro}
            onChange={handleEuroChange}
            className="border rounded px-2 py-1 w-full"
            placeholder="z.B. 100"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm">Prozent (%)</label>
          <input
            type="number"
            step="0.01"
            min={0}
            max={100}
            value={percent}
            onChange={handlePercentChange}
            className="border rounded px-2 py-1 w-full"
            placeholder="z.B. 10"
            required
          />
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div>
        <label className="block text-sm">Bemerkung</label>
        <input
          name="remark"
          type="text"
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className=" flex justify-between">
        <CancelButton href="/participant">Abbrechen</CancelButton>
      <button
        type="submit"
        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition"
        disabled={!!error}
      >
        Speichern
      </button>
      </div>
    </form>
  )
}