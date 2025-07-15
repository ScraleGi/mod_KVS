"use client"

import React, { useState, useTransition, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import type { SanitizedRegistration, SanitizedInvoice, SanitizedInvoiceRecipient } from "@/types/query-models"
import { generateInvoice } from "@/utils/generateInvoice"

interface Props {
  registrations: SanitizedRegistration[]
  recipients: SanitizedInvoiceRecipient[]
  courseId: string
}

export function ClientGenerateCourseInvoices({ registrations, recipients, courseId }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [recipientType, setRecipientType] = useState<"default" | "custom">("default")
  const [customRecipientId, setCustomRecipientId] = useState<string>("")
  const [selectedRegs, setSelectedRegs] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // On mount, check if customRecipientId is in query params (after redirect from new recipient form)
  useEffect(() => {
    const id = searchParams.get("customRecipientId")
    if (id) {
      setRecipientType("custom")
      setCustomRecipientId(id)
    }
  }, [searchParams])

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRegs(
        registrations
          .filter(r => !r.invoices?.[0] || (r.invoices?.[0]?.isCancelled))
          .map(r => r.id)
      )
    } else {
      setSelectedRegs([])
    }
  }

  const handleRegChange = (id: string, checked: boolean) => {
    setSelectedRegs(prev =>
      checked ? [...prev, id] : prev.filter(rid => rid !== id)
    )
  }

  // Deduplicate recipients, always show the most recent, fallback to id if name empty
  const seenNames = new Set<string>()
  const filteredRecipients = [...recipients].reverse().filter(rec => {
    let nameKey = ""
    if (rec.type === "COMPANY") {
      nameKey = (rec.companyName || "").trim().toLowerCase()
    } else {
      nameKey = [
        rec.recipientSalutation || "",
        rec.recipientName || "",
        rec.recipientSurname || ""
      ].join(" ").replace(/\s+/g, " ").trim().toLowerCase()
      if (!nameKey) nameKey = rec.id
    }
    if (seenNames.has(nameKey)) return false
    seenNames.add(nameKey)
    return true
  })

  // Always show the currently selected recipient (even if just created)
  const currentRecipient = recipients.find(r => r.id === customRecipientId)
  const recipientOptions = [
    ...(currentRecipient && !filteredRecipients.some(r => r.id === currentRecipient.id)
      ? [currentRecipient]
      : []),
    ...filteredRecipients
  ]

  const renderRecipientName = (rec: SanitizedInvoiceRecipient) =>
    rec.type === "COMPANY"
      ? rec.companyName
      : `${rec.recipientSalutation || ""} ${rec.recipientName || ""} ${rec.recipientSurname || ""}`.trim() || "(Unbenannte Person)"

  // Handle "Empfänger anlegen" click
  const handleCreateRecipient = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/course/${courseId}/courseInvoices/new?returnTo=${encodeURIComponent(`/course/${courseId}/courseInvoices`)}&recipientType=custom`)
  }

  // Bulk invoice generation logic using generateInvoice server action
  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)
    setError(null)
    setSuccess(null)
    const total = selectedRegs.length
    let done = 0

    try {
      if (selectedRegs.length === 0) throw new Error("Bitte wählen Sie mindestens einen Teilnehmer aus.")
      if (recipientType === "custom" && !customRecipientId) {
        throw new Error("Bitte wählen Sie einen Empfänger aus.")
      }

      for (const regId of selectedRegs) {
        const formData = new FormData()
        formData.set("registrationId", regId)

        if (recipientType === "default") {
          const reg = registrations.find(r => r.id === regId)
          if (!reg) continue
          formData.set("type", "PERSON")
          formData.set("recipientSalutation", reg.participant.salutation || "")
          formData.set("recipientName", reg.participant.name || "")
          formData.set("recipientSurname", reg.participant.surname || "")
          formData.set("recipientEmail", reg.participant.email || "")
          formData.set("recipientStreet", reg.participant.street || "")
          formData.set("postalCode", reg.participant.postalCode || "")
          formData.set("recipientCity", reg.participant.city || "")
          formData.set("recipientCountry", reg.participant.country || "")
        } else {
          const rec = recipients.find(r => r.id === customRecipientId)
          if (!rec) continue
          formData.set("type", rec.type)
          if (rec.type === "COMPANY") {
            formData.set("companyName", rec.companyName || "")
          } else {
            formData.set("recipientSalutation", rec.recipientSalutation || "")
            formData.set("recipientName", rec.recipientName || "")
            formData.set("recipientSurname", rec.recipientSurname || "")
          }
          formData.set("recipientEmail", rec.recipientEmail || "")
          formData.set("recipientStreet", rec.recipientStreet || "")
          formData.set("postalCode", rec.postalCode || "")
          formData.set("recipientCity", rec.recipientCity || "")
          formData.set("recipientCountry", rec.recipientCountry || "")
        }

        const result = await generateInvoice(formData)
        if (!result.success) {
          throw new Error(result.error || "Fehler beim Erstellen der Rechnung.")
        }
        done++
        setProgress(Math.round((done / total) * 100))
      }

      setSuccess("Rechnungen erfolgreich generiert.")
      setSelectedRegs([])
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Unbekannter Fehler.")
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        startTransition(handleGenerate)
      }}
    >
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-neutral-800 mb-2">Empfänger wählen</h2>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="radio"
              name="recipientType"
              value="default"
              checked={recipientType === "default"}
              onChange={() => setRecipientType("default")}
              required
            />
            Standard (Teilnehmer als Empfänger)
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="radio"
              name="recipientType"
              value="custom"
              checked={recipientType === "custom"}
              onChange={() => setRecipientType("custom")}
              required
            />
            <span>
              Eigener Empfänger:
              <button
                type="button"
                className="ml-2 text-blue-600 underline bg-transparent border-0 p-0 cursor-pointer"
                style={{ fontSize: "0.95em" }}
                onClick={handleCreateRecipient}
                tabIndex={recipientType === "custom" ? 0 : -1}
              >
                Neuen Empfänger anlegen
              </button>
            </span>
            <select
              name="customRecipientId"
              className="ml-2 border rounded px-2 py-1 text-xs"
              disabled={recipientType !== "custom"}
              style={{ minWidth: 180 }}
              value={customRecipientId}
              onChange={e => setCustomRecipientId(e.target.value)}
              required={recipientType === "custom"}
            >
              <option value="" disabled>
                {currentRecipient
                  ? `Empfänger: ${renderRecipientName(currentRecipient)}`
                  : "Empfänger wählen…"}
              </option>
              {recipientOptions.map((rec) => (
                <option key={rec.id} value={rec.id}>
                  {renderRecipientName(rec)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-neutral-800 mb-2">Teilnehmer auswählen</h2>
        <table className="min-w-full text-xs border border-neutral-200 rounded mb-2">
          <thead>
            <tr className="bg-neutral-100">
              <th className="px-3 py-2 text-left font-semibold">
                <input
                  type="checkbox"
                  checked={
                    registrations.filter(r => !r.invoices?.[0] || (r.invoices?.[0]?.isCancelled)).length > 0 &&
                    selectedRegs.length === registrations.filter(r => !r.invoices?.[0] || (r.invoices?.[0]?.isCancelled)).length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-3 py-2 text-left font-semibold">Teilnehmer</th>
              <th className="px-3 py-2 text-left font-semibold">E-Mail</th>
              <th className="px-3 py-2 text-center font-semibold">Rechnung</th>
              <th className="px-3 py-2 text-center font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-2 text-neutral-400 italic text-xs bg-white rounded text-center">
                  Keine Teilnehmer gefunden.
                </td>
              </tr>
            ) : (
              registrations.map((reg) => {
                const invoice: SanitizedInvoice | undefined = reg.invoices?.[0]
                let status = "-"
                if (invoice) {
                  status = invoice.isCancelled ? "storniert" : "aktiv"
                }
                return (
                  <tr key={reg.id} className="border-t border-neutral-200 bg-white hover:bg-blue-50 transition">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        name="registrationIds"
                        value={reg.id}
                        checked={selectedRegs.includes(reg.id)}
                        onChange={e => handleRegChange(reg.id, e.target.checked)}
                        disabled={!!invoice && !invoice.isCancelled}
                      />
                    </td>
                    <td className="px-3 py-2">{reg.participant.name} {reg.participant.surname}</td>
                    <td className="px-3 py-2">{reg.participant.email}</td>
                    <td className="px-3 py-2 text-center">
                      {invoice ? (
                        <Link
                          href={`/invoice/${invoice.id}`}
                          className="text-blue-600 underline"
                        >
                          #{invoice.invoiceNumber}
                        </Link>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {status}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
        <div className="text-xs text-neutral-500 mb-2">
          Bereits generierte Rechnungen können nicht erneut generiert werden.
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
          disabled={isGenerating || isPending || selectedRegs.length === 0 || (recipientType === "custom" && !customRecipientId)}
        >
          {isGenerating || isPending ? "Rechnungen werden generiert..." : "Rechnungen generieren"}
        </button>
        {(isGenerating || isPending) && (
          <div className="w-full max-w-md">
            <div className="h-3 bg-neutral-200 rounded">
              <div
                className="h-3 bg-blue-600 rounded transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-neutral-600 mt-1 text-center">{progress}% abgeschlossen</div>
          </div>
        )}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
      </div>
      <input type="hidden" name="courseId" value={courseId} />
    </form>
  )
}