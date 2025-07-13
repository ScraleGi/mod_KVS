import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { formatDateTimeGerman } from "@/lib/utils"

export function DocumentDialog({ documents, trigger }: { documents: { id: string; file: string; role: string; createdAt: string | Date }[], trigger: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dokumente</DialogTitle>
        </DialogHeader>
        <ul className="space-y-2">
          {documents.length === 0 && <li className="text-gray-400">Keine Dokumente</li>}
          {documents.map(doc => (
            <li key={doc.id} className="flex flex-col">
              <span className="font-medium">{doc.role}</span>
              <Link href={doc.file} className="text-blue-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">
                {doc.file}
              </Link>
            <span className="text-xs text-gray-500">
            {formatDateTimeGerman(doc.createdAt)}
            </span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}