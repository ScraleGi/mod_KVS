"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

export function TrainerCourseDialog({
  courses,
  children,
}: {
  courses: { id: string; name: string; startDate?: string }[]
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
          {children}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-bold mb-2">Courses</DialogTitle>
        {courses.length === 0 ? (
          <div className="text-gray-400 italic">No courses</div>
        ) : (
          <ul>
            {courses.map(course => (
              <li key={course.id}>
                <Link
                  href={`/course/${course.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {course.name} - {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A'}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}