'use client'
import React, { useRef } from 'react'
import { formatDate } from '@/lib/utils'

// Interface for available courses in the dropdown
interface AvailableCourse {
  id: string;
  startDate: Date | string;
  program?: {
    name: string;
  } | null;
}

interface AddCourseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  availableCourses: AvailableCourse[];
}

export default function AddCourseModal({
  open,
  onClose,
  onSubmit,
  availableCourses,
}: AddCourseModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === dialogRef.current) onClose()
  }

  if (!open) return null

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-sm shadow border border-gray-100 p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-8 tracking-tight text-left">Register to Course</h2>
        <form
          action={async (formData) => {
            await onSubmit(formData)
            onClose()
          }}
          className="space-y-6"
        >
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600 text-left" htmlFor="courseId">
              Course
            </label>
            <select
              id="courseId"
              name="courseId"
              required
              defaultValue=""
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="" disabled>Select course</option>
              {availableCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.program?.name ?? 'Course'} ({formatDate(course.startDate)})
                </option>
              ))}
            </select>
          </div>
          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
              Register
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}