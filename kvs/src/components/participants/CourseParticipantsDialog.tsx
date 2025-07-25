"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"

/**
 * CourseParticipantsDialog
 * 
 * - Renders a button (using children as the button content) that opens a dialog/modal.
 * - The dialog displays a list of course participants with links to their detail pages.
 * - If no participants, shows a placeholder message.
 * - Intended for use in course tables or lists to quickly view all participants of a course.
 */
export function CourseParticipantsDialog({
  participants,
  children,
}: {
  participants: { id: string; name: string; surname?: string; email?: string }[]
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
      <DialogContent className="bg-white">
        <DialogTitle className="text-lg font-bold mb-2">Teilnehmer</DialogTitle>
        <DialogDescription>
          Hier sehen Sie alle Teilnehmer dieses Kurses.
        </DialogDescription>
        {participants.length === 0 ? (
          <div className="text-gray-400 italic">Keine Teilnehmer</div>
        ) : (
          // List all participants with links to their detail pages
          <ul>
            {participants.map(p => (
              <li key={p.id}>
                <Link
                  href={`/participant/${p.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {p.name} {p.surname}
                </Link>
                {/* Show email if available */}
                {p.email && (
                  <span className="ml-2 text-xs text-neutral-500">&lt;{p.email}&gt;</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}