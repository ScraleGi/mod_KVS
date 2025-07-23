"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"

/**
 * CoursesDialog
 * 
 * - Renders a button (showing the number of courses) that opens a dialog/modal.
 * - The dialog displays a list of registered courses with links to their detail pages.
 * - If no courses, shows a placeholder message.
 * - Intended for use in participant tables or lists to quickly view all courses a participant is registered for.
 */
export function CoursesDialog({
  courses,
}: {
  courses: { id: string; name: string; startDate?: string | Date }[]
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* The button that opens the dialog, showing the course count */}
      <DialogTrigger asChild>
        <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
          {courses.length}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-bold mb-2">Registrierte Kurse</DialogTitle>
        <DialogDescription>
          Hier sehen Sie alle Kurse, für die dieser Teilnehmer registriert ist.
        </DialogDescription>
        {courses.length === 0 ? (
          <div className="text-gray-400 italic">Keine Kurse</div>
        ) : (
          // List all courses with links to their detail pages
          <ul>
            {courses.map(course => (
              <li key={course.id}>
                <Link
                  href={`/course/${course.id}`}
                  className="text-blue-600 underline hover:text-blue-800"
                  onClick={() => setOpen(false)} // Close dialog on link click
                >
                  {course.name}
                </Link>
                {/* Show course start date if available */}
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