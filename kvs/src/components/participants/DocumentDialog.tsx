import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DownloadPDFLink } from "@/components/DownloadButton/DownloadButton"
import { formatDateTimeGerman } from "@/lib/utils"

export function DocumentDialog({
  documents,
  trigger,
  registrationId, // <-- Pass the registrationId to use for DownloadPDFLink
}: {
  documents: { id: string; file: string; role: string; createdAt: string | Date }[]
  trigger: React.ReactNode
  registrationId: string
}) {
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
              <DownloadPDFLink
                uuidString={registrationId}
                filename={doc.file}
                displayName={doc.file}
                className="text-blue-600 hover:underline break-all"
              />
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