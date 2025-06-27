"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"

export function CourseParticipantsDialog({
  participants,
  children,
}: {
  participants: { id: string; name: string; email?: string }[] // <-- add email
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
        <DialogTitle className="text-lg font-bold mb-2">Participants</DialogTitle>
        {participants.length === 0 ? (
          <div className="text-gray-400 italic">No participants</div>
        ) : (
          <ul>
            {participants.map(p => (
              <li key={p.id}>
                {p.name}
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