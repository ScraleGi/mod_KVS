"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

export function CoursesDialog({
  courses,
}: {
  courses: { id: string; name: string; startDate?: string | Date }[]
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
          {courses.length}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-bold mb-2">Registered Courses</DialogTitle>
        {courses.length === 0 ? (
          <div className="text-gray-400 italic">No courses</div>
        ) : (
          <ul>
            {courses.map(course => (
              <li key={course.id}>
                <Link
                  href={`/course/${course.id}`}
                  className="text-blue-600 underline hover:text-blue-800"
                  onClick={() => setOpen(false)}
                >
                  {course.name}
                </Link>
                {course.startDate && (
                  <span className="ml-2 text-xs text-neutral-500">
                    ({new Date(course.startDate).toLocaleDateString('de-DE')})
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}