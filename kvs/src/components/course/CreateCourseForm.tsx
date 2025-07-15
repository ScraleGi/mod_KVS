"use client"
import { useState } from "react"
import Link from "next/link"
import { CreateCourseFormProps } from "@/types/query-models"
import { formatDateISO } from "@/lib/utils" 

export default function CreateCourseForm({
  id,
  course,
  trainers,
  programs,
  onSubmit,
}: CreateCourseFormProps) {
  const [mainTrainerId, setMainTrainerId] = useState(course?.mainTrainer?.id || "")
  const [programId, setProgramId] = useState(course?.program?.id || "")

  // Determine if this is a new course or an edit
  const isEditing = Boolean(id);
  const buttonText = isEditing ? "Aktualisieren" : "Kurs erstellen";

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
      <div className="space-y-1">
        <label htmlFor="mainTrainerId" className="block text-xs font-medium text-gray-600">
          Trainer
        </label>
        <select
          id="mainTrainerId"
          name="mainTrainerId"
          value={mainTrainerId}
          onChange={e => setMainTrainerId(e.target.value)}
          required
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="" disabled>Trainer auswählen</option>
          {trainers.map((trainer) => (
            <option key={trainer.id} value={trainer.id}>
              {trainer.name} {trainer.surname}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600">
          Co-Trainers
        </label>
        <div className="flex flex-wrap gap-2" id="trainer-checkboxes">
          {trainers
            .filter(trainer => trainer.id !== mainTrainerId)
            .map(trainer => (
              <label key={trainer.id} className="flex items-center space-x-2 trainer-checkbox-label" data-trainer-id={trainer.id}>
                <input
                  type="checkbox"
                  name="trainerIds"
                  value={trainer.id}
                  defaultChecked={course?.trainers?.some((t) => t.id === trainer.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 trainer-checkbox"
                />
                <span className="text-xs">{trainer.name} {trainer.surname}</span>
              </label>
            ))}
        </div>
      </div>
      <div className="pt-2 flex items-center justify-end">
        <button
          type="submit"
          className="cursor-pointer inline-flex items-center px-5 py-2 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {buttonText}
        </button>
        
      </div>
    </form>
  )
}