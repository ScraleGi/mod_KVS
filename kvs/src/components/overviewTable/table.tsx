"use client"
import { CourseParticipantsDialog } from "../participants/CourseParticipantsDialog"
import { CoursesDialog } from "../participants/participantCoursesDialog"
import { FilterHeader } from "./FilterHeader"
import { DoubleFilterHeader } from "./DoubleFilterHeader"


// -------------------- Imports --------------------
import Link from "next/link"
import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


// -------------------- Types --------------------
export type Participant = {
  id: string
  name: string
  status: string
  invoice: string
}

export type ParticipantRow = {
  id: string
  name: string
  email: string
  phoneNumber: string
  courses: { id: string; name: string; startDate?: string | Date }[] // <-- Add startDate here
}


export type CourseRow = {
  id: string
  course: string
  area: string
  startDate: string
  trainer: string
  registrations: number
  participants?: Participant[]
}

// -------------------- Table Columns Definition --------------------
export const home: ColumnDef<CourseRow>[] = [
  // Course column with sorting
{
  accessorKey: "course",
  size: 220,
  header: ({ column }) => (
    <FilterHeader
      column={column}
      label="Kurs"
      placeholder="Filter Kurs..."
    />
  ),
    
  cell: ({ row }) => (
    <span
      className="block w-56 min-w-[12rem] pl-2"
      style={{ whiteSpace: "nowrap", overflowWrap: "normal" }}
    >
      {row.getValue("course")}
    </span>
  ),
},
  // Area column
{
  accessorKey: "area",
  size: 220,
  header: ({ column }) => (
    <FilterHeader
      column={column}
      label="Bereich"
      placeholder="Filter Bereich..."
    />
  ),
  cell: ({ row }) => (
    <span
      className="block w-56 min-w-[12rem] pl-2"
      style={{ whiteSpace: "nowrap", overflowWrap: "normal" }}
    >
      {row.getValue("area")}
    </span>
  ),
},
  // Start Date column (right-aligned)
{
  accessorKey: "startDate",
  size: 120,
  header: ({ column }) => (
  <DoubleFilterHeader
    column={column}
    label="Start Datum"
    placeholderFrom="Filter von..."
    placeholderTo="Filter bis..."
    typeDefinition="date"
  />
),
  cell: ({ row }) => {
    const date = new Date(row.getValue("startDate") as string)
    return (
      <span className="block pr-2">
        {date.toLocaleDateString("de-DE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </span>
    )
  },
  // Filterfunktion für Zeitraum
  filterFn: (row, columnId, filterValue: [string, string]) => {
    const value = row.getValue(columnId)
    if (!value) return false
    const date = new Date(value as string)
    const [from, to] = filterValue
    if (from && date < new Date(from)) return false
    if (to && date > new Date(to)) return false
    return true
  },
  // ...restlicher Code...
},
  // Trainer column (left-aligned)
{
  accessorKey: "trainer",
  size: 160,
  header: ({ column }) => (
    <FilterHeader
      column={column}
      label="Trainer"
      placeholder="Filter Trainer..."
    />
  ),
  cell: ({ row }) => (
    <span
      className="block w-56 min-w-[12rem] pl-2"
      style={{ whiteSpace: "nowrap", overflowWrap: "normal" }}
    >
      {row.getValue("trainer")}
    </span>
  ),
},
  // Registrations column with sorting
{
  accessorKey: "registrations",
  size: 70, // Reduced from 120
  header: ({ column }) => (
    <DoubleFilterHeader
      column={column}
      label="Anmeldungen"
      placeholderFrom="Filter von..."
      placeholderTo="Filter bis..."
      typeDefinition="number"
    />
  ),
  cell: ({ row }) => (
    <span className="block text-right w-8 min-w-[2rem] pr-2">
      <CourseParticipantsDialog participants={row.original.participants ?? []}>
        {row.getValue("registrations")}
      </CourseParticipantsDialog>
    </span>
  ),
},

]

export const participantColumns: ColumnDef<ParticipantRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="Name"
        placeholder="Filter Name..."
      />
    ),
    cell: ({ row }) => (
      <Link
        href={`/participant/${row.original.id}`}
        className="relative text-blue-600 hover:text-blue-800 pl-8 inline-block after:content-[''] after:absolute after:left-8 after:bottom-0 after:w-0 hover:after:w-[calc(100%-2rem)] after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300"
      >
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="E-Mail"
        placeholder="Filter E-Mail..."
      />
    ),
    cell: ({ row }) => <span>{row.getValue("email")}</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="Telefon"
        placeholder="Filter Telefon..."
      />
    ),
    cell: ({ row }) => (
      <span className="block text-right pr-8">{row.getValue("phoneNumber")}</span>
    ),
  },
  {
  accessorKey: "courses",
  header: ({ column }) => (
    <FilterHeader
      column={column}
      label="Kurse"
      placeholder="Filter Anzahl Kurse..."
    />
  ),
  cell: ({ row }) => (
      <CoursesDialog courses={row.original.courses ?? []} />
  ),
  // Filter: nach Anzahl der Kurse (als Zahl oder String im Input)
  filterFn: (row, filterValue) => {
    if (!filterValue) return true
    const count = Array.isArray(row.original.courses) ? row.original.courses.length : 0
    return count === Number(filterValue)
  },
  // Sortierung nach Anzahl der Kurse
  sortingFn: (rowA, rowB) => {
    const a = Array.isArray(rowA.original.courses) ? rowA.original.courses.length : 0
    const b = Array.isArray(rowB.original.courses) ? rowB.original.courses.length : 0
    return a - b
  },
},
]

// -------------------- Main Table Component --------------------
/**
 * Renders the main courses table with filtering, sorting, pagination, and actions.
 * @param data Array of CourseRow objects (courses with participants)
 */
export function CourseTable<T>({
  data,
  columns,
  filterColumn = "course", // default for course tables
}: {
  data: T[]
  columns: ColumnDef<T>[]
  filterColumn?: string
}) {
  // Table state hooks
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Create the table instance
  const table = useReactTable({
    data,
    columns,
    initialState: { pagination: { pageSize: 10 } },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // -------------------- Render --------------------
  return (
    <div className="w-full">
      {/* Main table */}
      <div className="shadow border border-gray-200 overflow-hidden bg-white rounded-md">
        <Table>
<TableHeader>
  {table.getHeaderGroups().map(headerGroup => (
    <TableRow
      key={headerGroup.id}
      className="bg-gray-600 hover:bg-gray-600 border-b border-gray-200" // <-- add this
    >
      {headerGroup.headers.map(header => (
        <TableHead
          key={header.id}
          className="py-4 px-3 text-gray-100 font-semibold text-base"
        >
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </TableHead>
      ))}
    </TableRow>
  ))}
</TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx, arr) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`transition-colors ${
                    idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                  } hover:bg-blue-50 ${
                    idx !== arr.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className="py-3 px-3 text-gray-800"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}