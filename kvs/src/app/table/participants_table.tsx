// -------------------- Imports --------------------

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// -------------------- Types --------------------
// Defines the shape of a participant row
export type Participant = {
  id: string
  name: string
  status: string
  invoice: string
}

// -------------------- Table Columns Definition --------------------
// Columns for the participants table
const participantColumns: ColumnDef<Participant>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "invoice", header: "Invoice" },
]

// -------------------- ParticipantsTable Component --------------------
/**
 * Renders a table of participants.
 * @param participants Array of Participant objects
 */
export function ParticipantsTable({ participants = [] }: { participants: Participant[] }) {
  // Set up the table instance using TanStack Table
  const table = useReactTable({
    data: participants,
    columns: participantColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table>
      {/* Table Header */}
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead key={header.id} className="text-center">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      {/* Table Body */}
      <TableBody>
        {table.getRowModel().rows.length ? (
          // Render each participant row
          table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id} className="text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          // Show message if no participants
          <TableRow>
            <TableCell colSpan={participantColumns.length} className="text-center text-gray-400">
              No participants.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}