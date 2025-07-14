"use client"

import React, { useState, useTransition } from "react"
import { formatFullName } from "@/lib/utils"
import { generateAndDownloadPDF } from "@/app/actions/pdfActions"
import type { SanitizedRegistration, SanitizedCourse } from "@/types/query-models"

const documentTypes = [
  { key: "certificate", label: "Zertifikat" },
  { key: "KursRegeln", label: "Kursregeln" },
  { key: "Teilnahmebestaetigung", label: "Teilnahmbestätigung" },
  { key: "vvvTicket", label: "VVV Ticket" },
] as const;

interface ClientGenerateCourseDocumentsProps {
  registrations: SanitizedRegistration[]
  courseName: string
  courseId: string
  course: SanitizedCourse
}

export function ClientGenerateCourseDocuments({
  registrations,
  courseName,
  course,
}: ClientGenerateCourseDocumentsProps) {
  const [selectedDocs, setSelectedDocs] = useState<string[]>(["certificate"])
  const [selectedRegs, setSelectedRegs] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const toggleDoc = (key: string) => {
    setSelectedDocs((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }
  const toggleReg = (id: string) => {
    setSelectedRegs((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    )
  }
  const allChecked = selectedRegs.length === registrations.length
  const toggleAll = () => {
    setSelectedRegs(allChecked ? [] : registrations.map((r) => r.id))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)
    setError(null)
    setSuccess(null)
    const total = selectedRegs.length * selectedDocs.length
    let done = 0

    try {
      for (const regId of selectedRegs) {
        const reg = registrations.find((r) => r.id === regId)
        if (!reg) continue
        for (const docType of selectedDocs) {
          const filename = `${docType}_${reg.participant.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`
          await generateAndDownloadPDF(
            regId,
            docType,
            {
              course,
              participant: reg.participant,
              registration: reg,
            },
            filename
          )
          done++
          setProgress(Math.round((done / total) * 100))
        }
      }
      setSuccess("Alle Dokumente wurden erfolgreich generiert.")
    } catch (err) {
      console.error(err) // <-- Now the error is used
      setError("Fehler beim Generieren der Dokumente.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Generate Course Documents for {courseName}
      </h1>

      {/* Generate Document Section */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-neutral-800 mb-2">Generate Document:</h2>
        <div className="flex gap-6 flex-wrap">
          {documentTypes.map((doc) => (
            <label key={doc.key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedDocs.includes(doc.key)}
                onChange={() => toggleDoc(doc.key)}
                className="accent-blue-600"
              />
              {doc.label}
            </label>
          ))}
        </div>
      </section>

      {/* Participants Table */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-neutral-800 mb-2">Teilnehmer</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs border border-neutral-200 rounded">
            <thead>
              <tr className="bg-neutral-100">
                <th className="px-3 py-2 text-left font-semibold">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="accent-blue-600"
                  />
                </th>
                <th className="px-3 py-2 text-left font-semibold">Name</th>
                <th className="px-3 py-2 text-left font-semibold">E-Mail</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 py-2 text-neutral-400 italic text-xs bg-white rounded text-center">
                    Keine Teilnehmer gefunden.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.id} className="border-t border-neutral-200 bg-white hover:bg-blue-50 transition">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedRegs.includes(reg.id)}
                        onChange={() => toggleReg(reg.id)}
                        className="accent-blue-600"
                      />
                    </td>
                    <td className="px-3 py-2">{formatFullName(reg.participant)}</td>
                    <td className="px-3 py-2">{reg.participant?.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Generate Button & Progress */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => startTransition(handleGenerate)}
          disabled={isGenerating || isPending || selectedRegs.length === 0 || selectedDocs.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
        >
          {isGenerating || isPending ? "Generiere..." : "Dokumente generieren"}
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
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
      </div>
    </div>
  )
}