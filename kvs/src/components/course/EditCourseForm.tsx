"use client"
import { useState } from "react"
import Link from "next/link"
import { EditCourseFormProps } from "@/types/query-models"
import { formatDateISO } from "@/lib/utils" 

export default function EditCourseForm({ 
  id, 
  course, 
  trainers, 
  onSubmit 
}: EditCourseFormProps) {
  const [mainTrainerId, setMainTrainerId] = useState(course?.mainTrainer?.id || "")


  return (
    <form action={onSubmit} className="space-y-6" id="edit-course-form">
      <input type="hidden" name="id" value={id} />
      {/* Course Code */}
      <div className="space-y-1">
        <label htmlFor="code" className="block text-xs font-medium text-gray-600">
          Kurs Code
        </label>
        <input
          id="code"
          name="code"
          type="text"
          required
          defaultValue={course?.code || ""}
          placeholder="Enter course code"
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      {/* Program (readonly) */}
      <div className="space-y-1">
        <label htmlFor="program" className="block text-xs font-medium text-gray-600">
          Programm
        </label>
        <input
          id="program"
          name="program"
          type="text"
          value={course?.program?.name || ''}
          disabled
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      {/* Start Date */}
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
      {/* End Date */}
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
      {/* Main Trainer */}
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
          <option value="" disabled>Trainer wählen</option>
          {trainers.map(trainer => (
            <option key={trainer.id} value={trainer.id}>
              {trainer.name} {trainer.surname}
            </option>
          ))}
        </select>
      </div>
      {/* Additional Trainers */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600">
          Co-Trainer
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
      {/* Actions */}
      <div className="pt-2 flex items-center justify-between">
        <button
          type="submit"
          className="cursor-pointer inline-flex items-center px-5 py-2 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Speichern
        </button>
        <Link
          href={`/course/${id}`}
          className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kurs
        </Link>
        <Link
          href="/course"
          className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Startseite
        </Link>
      </div>
    </form>
  )
}