"use client"
import { useState } from "react"
import Link from "next/link"
import { CreateCourseFormProps } from "@/types/query-models"
import { formatDateISO } from "@/lib/utils"
import TrainerSearchBox from "../forms/TrainerSearchBox"

export default function CreateCourseForm({
  id,
  course,
  trainers,
  programs,
  onSubmit,
}: CreateCourseFormProps) {
  const [mainTrainerId, setMainTrainerId] = useState<string>(course?.mainTrainer?.id || "")
  const [additionalTrainerIds, setAdditionalTrainerIds] = useState<string[]>(
    course?.trainers?.map(t => t.id).filter(id => id !== course?.mainTrainer?.id) || []
  )
  const [programId, setProgramId] = useState(course?.program?.id || "")

  const isEditing = Boolean(id)
  const buttonText = isEditing ? "Aktualisieren" : "Kurs erstellen"

  return (
    <form action={onSubmit} className="space-y-6">
      {/* Course Code */}
      <div className="space-y-1">
        <label htmlFor="code" className="block text-xs font-medium text-gray-600">
          Kurs-Code
        </label>
        <input
          id="code"
          name="code"
          type="text"
          required
          defaultValue={course?.code || ""}
          placeholder="Kurs-Code einfügen"
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      {/* Program */}
      <div className="space-y-1">
        <label htmlFor="programId" className="block text-xs font-medium text-gray-600">
          Programm
        </label>
        <select
          id="programId"
          name="programId"
          value={programId}
          onChange={e => setProgramId(e.target.value)}
          required
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="" disabled>Programm wählen</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>{program.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label htmlFor="startDate" className="block text-xs font-medium text-gray-600">
          Start Datum
        </label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          defaultValue={formatDateISO(course?.startDate)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          required
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="endDate" className="block text-xs font-medium text-gray-600">
          End Datum
        </label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          defaultValue={formatDateISO(course?.endDate)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          required
        />
      </div>

      {/* Main Trainer Searchbox */}
      <TrainerSearchBox
        label="Trainer (Haupttrainer)"
        trainers={trainers}
        selected={mainTrainerId}
        onChange={id => {
          setMainTrainerId(id as string)
          setAdditionalTrainerIds(ids => ids.filter(aid => aid !== id))
        }}
        excludeIds={additionalTrainerIds}
      />

      {/* Additional Trainer Searchbox */}
      <TrainerSearchBox
        label="Co-Trainer"
        trainers={trainers}
        selected={additionalTrainerIds}
        onChange={value => setAdditionalTrainerIds(Array.isArray(value) ? value : [value])}
        multi
        excludeIds={mainTrainerId ? [mainTrainerId] : []}
      />

      {/* Hidden Inputs for backend */}
      <input type="hidden" name="mainTrainerId" value={mainTrainerId} />
      {additionalTrainerIds.map(id => (
        <input key={id} type="hidden" name="trainerIds" value={id} />
      ))}

      <div className="pt-2 flex items-center justify-between">
        <button
          type="submit"
          className="inline-flex items-center px-5 py-2 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {buttonText}
        </button>
        <Link
          href="/course"
          className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Abbrechen
        </Link>
      </div>
    </form>
  )
}