"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"

// A dialog component that displays a list of courses for a trainer.
// Opens a modal when the trigger button is clicked.
export function TrainerCourseDialog({
  courses,
  children,
}: {
  courses: { id: string; name: string; startDate?: string }[]
  children: React.ReactNode
}) {
  // State to control dialog open/close
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* The button that opens the dialog */}
      <DialogTrigger asChild>
        <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
          {children}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-bold mb-2">Kurse</DialogTitle>
        <DialogDescription>
          Hier sehen Sie alle Kurse, die diesem Trainer zugeordnet sind.
        </DialogDescription>
        {courses.length === 0 ? (
          <div className="text-gray-400 italic">keine Kurse</div>
        ) : (
          // List all courses with links to their detail pages
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