"use client"
import { useState } from "react"

export default function EditCourseForm({ 
  id, 
  course, 
  trainers, 
  onSubmit 
}: { 
  id: string, 
  course: any, 
  trainers: any[], 
  onSubmit: (formData: FormData) => void 
}) {
  const [mainTrainerId, setMainTrainerId] = useState(course?.mainTrainer?.id || "")

  return (
    <form action={onSubmit} className="space-y-8" id="edit-course-form">
      <input type="hidden" name="id" value={id} />
      {/* Program (readonly) */}
      <div className="space-y-2">
        <label htmlFor="program" className="block text-sm font-medium text-gray-600">
          Program
        </label>
        <input
          id="program"
          name="program"
          type="text"
          value={course?.program?.name || ''}
          disabled
          className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
        />
      </div>
      {/* Start Date */}
      <div className="space-y-2">
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-600">
          Start Date
        </label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          defaultValue={course?.startDate?.toISOString().slice(0, 10)}
          className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
          required
        />
      </div>
      {/* End Date */}
      <div className="space-y-2">
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-600">
          End Date
        </label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          defaultValue={course?.endDate ? course.endDate.toISOString().slice(0, 10) : ''}
          className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
          required
        />
      </div>
      {/* Main Trainer */}
      <div className="space-y-2">
        <label htmlFor="mainTrainerId" className="block text-sm font-medium text-gray-600">
          Main Trainer
        </label>
        <select
          id="mainTrainerId"
          name="mainTrainerId"
          value={mainTrainerId}
          onChange={e => setMainTrainerId(e.target.value)}
          className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
          required
        >
          <option value="" disabled>Select main trainer</option>
          {trainers.map(trainer => (
            <option key={trainer.id} value={trainer.id}>
              {trainer.name}
            </option>
          ))}
        </select>
      </div>
      {/* Additional Trainers */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-600">
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
                  defaultChecked={course?.trainers.some((t: any) => t.id === trainer.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 trainer-checkbox"
                />
                <span className="text-sm">{trainer.name}</span>
              </label>
            ))}
        </div>
      </div>
      {/* Actions */}
      <div className="pt-2 flex items-center justify-between">
        <button
          type="submit"
          className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}