'use client'
import { useState } from 'react'
import AddCourseModal from '../../../components/forms/AddCourseModal' // Adjust the path if needed

export default function ClientCourseModalWrapper({
  registerToCourse,
  availableCourses,
  RegistrationStatus,
}: {
  registerToCourse: (formData: FormData) => void
  availableCourses: any[]
  RegistrationStatus: any
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-blue-600 hover:bg-blue-50 transition"
        title="Register to new course"
        type="button"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
      </button>
      <AddCourseModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={async (formData) => {
          await registerToCourse(formData)
          setOpen(false)
        }}
        availableCourses={availableCourses}
        RegistrationStatus={RegistrationStatus}
      />
    </>
  )
}