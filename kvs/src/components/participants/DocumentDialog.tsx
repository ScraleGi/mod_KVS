import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { DownloadPDFLink } from "@/components/DownloadButton/DownloadButton"
import { formatDateTimeGerman } from "@/lib/utils"

/**
 * DocumentDialog
 * 
 * - Renders a dialog/modal for displaying documents related to a participant.
 * - The trigger prop is used as the button or element to open the dialog.
 * - Lists all documents with download links and creation dates.
 * - Shows a placeholder if there are no documents.
 * - Intended for use in participant or registration views to quickly access participant documents.
 */
export function DocumentDialog({
  documents,
  trigger,
  registrationId,
  participantName,
}: {
  documents: { id: string; file: string; role: string; createdAt: string | Date }[]
  trigger: React.ReactNode
  registrationId: string
  participantName: string
}) {
  return (
    <Dialog>
      {/* The element that opens the dialog */}
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Dokumente für {participantName}
          </DialogTitle>
          <DialogDescription>
            Hier finden Sie alle zugehörigen Dokumente für diesen Teilnehmer.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-2">
          {/* Show message if there are no documents */}
          {documents.length === 0 && <li className="text-gray-400">Keine Dokumente</li>}
          {/* List all documents with download links and creation dates */}
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