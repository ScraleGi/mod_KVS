"use client"
import { CourseParticipantsDialog } from "./CourseParticipantsDialog"
import { CoursesDialog } from "./participantCoursesDialog"


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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
export const columns: ColumnDef<CourseRow>[] = [

  // Course column with sorting
{
  accessorKey: "course",
  size: 200,
header: ({ column }) => (
  <span className="flex items-center gap-1 select-none w-48 min-w-[8rem] pl-8">
    Course
    <span
      className="ml-1 h-4 w-4 cursor-pointer flex"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      }}
    >
      <ArrowUpDown
        className={`h-4 w-4 transition-transform ${
          column.getIsSorted()
            ? column.getIsSorted() === "asc"
              ? "text-yellow-100 rotate-180"
              : "text-yellow-100"
            : "text-gray-400"
        }`}
      />
    </span>
  </span>
),
  cell: ({ row }) => (
    <Link
      href={`/course/${row.original.id}`}
      className="relative text-blue-600 hover:text-blue-800 pl-8 inline-block after:content-[''] after:absolute after:left-8 after:bottom-0 after:w-0 hover:after:w-[calc(100%-2rem)] after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300"
      style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
    >
      {row.getValue("course")}
    </Link>
  ),
},
  // Area column
{
  accessorKey: "area",
  size: 220, // Increased from 140 to 220
  header: ({ column }) => (
    <span className="flex items-center gap-1 select-none w-56 min-w-[12rem] pl-2">
      Area
      <span
        className="ml-1 h-4 w-4 cursor-pointer flex"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        }}
      >
        <ArrowUpDown
          className={`h-4 w-4 transition-transform ${
            column.getIsSorted()
              ? column.getIsSorted() === "asc"
                ? "text-yellow-100 rotate-180"
                : "text-yellow-100"
              : "text-gray-400"
          }`}
        />
      </span>
    </span>
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
  // Enable sorting and add sort icon
  header: ({ column }) => (
    <span className="flex items-center gap-1 justify-end w-28 min-w-[5rem] pr-2 select-none">
      Start Date
      <span
        className="ml-1 h-4 w-4 cursor-pointer flex"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        }}
      >
        <ArrowUpDown
          className={`h-4 w-4 transition-transform ${
            column.getIsSorted()
              ? column.getIsSorted() === "asc"
                ? "text-yellow-100 rotate-180"
                : "text-yellow-100"
              : "text-gray-400"
          }`}
        />
      </span>
    </span>
  ),
  // Custom sorting: compare as dates
  sortingFn: (rowA, rowB, columnId) => {
    const a = rowA.getValue(columnId)
    const b = rowB.getValue(columnId)
    const dateA = a ? new Date(a as string).getTime() : 0
    const dateB = b ? new Date(b as string).getTime() : 0
    return dateA - dateB
  },
  cell: ({ row }) => {
    const value = row.getValue("startDate")
    let formatted: string = ""
    if (typeof value === "string" && value) {
      const date = new Date(value)
      formatted = !isNaN(date.getTime())
        ? date.toLocaleDateString("de-DE")
        : value
    } else if (typeof value === "number") {
      formatted = new Date(value).toLocaleDateString("de-DE")
    } else {
      formatted = ""
    }
    return (
      <span className="block text-right w-28 min-w-[5rem] pr-2">{formatted}</span>
    )
  },
},
  // Trainer column (left-aligned)
{
  accessorKey: "trainer",
  size: 160,
  header: ({ column }) => (
    <span className="flex items-center gap-1 select-none w-40 min-w-[7rem] pl-2">
      Trainer
      <span
        className="ml-1 h-4 w-4 cursor-pointer flex"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        }}
      >
        <ArrowUpDown
          className={`h-4 w-4 transition-transform ${
            column.getIsSorted()
              ? column.getIsSorted() === "asc"
                ? "text-yellow-100 rotate-180"
                : "text-yellow-100"
              : "text-gray-400"
          }`}
        />
      </span>
    </span>
  ),
  cell: ({ row }) => (
    <span className="block text-left w-40 min-w-[7rem] truncate pl-2">{row.getValue("trainer")}</span>
  ),
},
  // Registrations column with sorting
{
  accessorKey: "registrations",
  size: 70, // Reduced from 120
  header: ({ column }) => (
    <span className="flex items-center gap-1 justify-end w-18 min-w-[3.5rem] pr-2 select-none">
      Registrations
      <span
        className="ml-1 h-4 w-4 cursor-pointer flex"
        onClick={() => {
          if (!column.getIsSorted()) {
            column.toggleSorting(false)
          } else if (column.getIsSorted() === "asc") {
            column.toggleSorting(true)
          } else {
            column.toggleSorting()
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            if (!column.getIsSorted()) {
              column.toggleSorting(false)
            } else if (column.getIsSorted() === "asc") {
              column.toggleSorting(true)
            } else {
              column.toggleSorting()
            }
          }
        }}
      >
        <ArrowUpDown
          className={`h-4 w-4 transition-transform ${
            column.getIsSorted()
              ? column.getIsSorted() === "asc"
                ? "text-yellow-100 rotate-180"
                : "text-yellow-100"
              : "text-gray-400"
          }`}
        />
      </span>
    </span>
  ),
  cell: ({ row }) => (
    <span className="block text-right w-16 min-w-[3.5rem] pr-2">
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
      <span className="flex items-center gap-1 select-none pl-8">
        Name
        <span
          className="ml-1 h-4 w-4 cursor-pointer flex"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4 text-gray-400" />
        </span>
      </span>
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
    header: "Email",
    cell: ({ row }) => <span>{row.getValue("email")}</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: () => <span className="block text-right w-full pr-8">Phone</span>,
    cell: ({ row }) => (
      <span className="block text-right pr-8">{row.getValue("phoneNumber")}</span>
    ),
  },
  {
    id: "courses",
    header: () => (
      <span className="block text-right w-full pr-8">Courses</span>
    ),
    cell: ({ row }) => (
      <div className="text-right pr-8">
        {/* Pass courses with startDate to CoursesDialog */}
        <CoursesDialog courses={row.original.courses} />
      </div>
    ),
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
      {/* Filter and column visibility controls */}
      <div className="flex items-center py-4">
        <Input
          placeholder={`Filter ${filterColumn}...`}
          value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto cursor-pointer">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize cursor-pointer"
                  checked={column.getIsVisible()}
                  onCheckedChange={value =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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