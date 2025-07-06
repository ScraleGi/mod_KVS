"use client"
import { useState } from "react"
import Link from "next/link"

export default function CreateCourseForm({
  id,
  course,
  trainers,
  programs,
  onSubmit,
}: {
  id?: string,
  course: any,
  trainers: any[],
  programs: any[],
  onSubmit: (formData: FormData) => void
}) {
  const [mainTrainerId, setMainTrainerId] = useState(course?.mainTrainer?.id || "")
  const [programId, setProgramId] = useState(course?.program?.id || "")

  return (
    <form action={onSubmit} className="space-y-6">
      {/* Course Code */}
      <div className="space-y-1">
        <label htmlFor="code" className="block text-xs font-medium text-gray-600">
          Course Code
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
      {/* Program */}
      <div className="space-y-1">
        <label htmlFor="programId" className="block text-xs font-medium text-gray-600">
          Program
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
          {programs.map((p: any) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label htmlFor="startDate" className="block text-xs font-medium text-gray-600">
          Start Date
        </label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          defaultValue={course?.startDate?.toISOString?.slice(0, 10)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          required
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="endDate" className="block text-xs font-medium text-gray-600">
          End Date
        </label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          defaultValue={course?.endDate ? course.endDate.toISOString?.slice(0, 10) : ''}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          required
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="mainTrainerId" className="block text-xs font-medium text-gray-600">
          Main Trainer
        </label>
        <select
          id="mainTrainerId"
          name="mainTrainerId"
          value={mainTrainerId}
          onChange={e => setMainTrainerId(e.target.value)}
          required
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="" disabled>Select main trainer</option>
          {trainers.map(trainer => (
            <option key={trainer.id} value={trainer.id}>
              {trainer.name} {trainer.surname}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600">
          Additional Trainers
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
                  defaultChecked={course?.trainers?.some((t: any) => t.id === trainer.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 trainer-checkbox"
                />
                <span className="text-xs">{trainer.name} {trainer.surname}</span>
              </label>
            ))}
        </div>
      </div>
      <div className="pt-2 flex items-center justify-between">
        <button
          type="submit"
          className="inline-flex items-center px-5 py-2 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Course
        </button>
        <Link
          href="/course"
          className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Cancel
        </Link>
      </div>
    </form>
  )
}