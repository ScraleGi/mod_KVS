"use client"

// -------------------- Imports --------------------
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

import { ParticipantsTable } from "./participants_table"

// -------------------- Types --------------------
export type Participant = {
  id: string
  name: string
  status: string
  invoice: string
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
  // Checkbox column for row selection
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="cursor-pointer"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // Course column with sorting
  {
    accessorKey: "course",
    header: ({ column }) => (
      <span className="flex items-center gap-1 select-none">
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
  },
  // Area column
  { accessorKey: "area", header: "Area" },
  // Start Date column (left-aligned, not sortable)
  {
    accessorKey: "startDate",
    header: () => (
      <span className="block text-left w-full">Start Date</span>
    ),
    cell: ({ row }) => (
      <span className="block text-left w-full">{row.getValue("startDate")}</span>
    ),
  },
  // Trainer column (left-aligned)
  {
    accessorKey: "trainer",
    header: () => <span className="text-left w-full block">Trainer</span>,
    cell: ({ row }) => (
      <span className="block text-left w-full">{row.getValue("trainer")}</span>
    ),
  },
  // Registrations column with sorting
  {
    accessorKey: "registrations",
    header: ({ column }) => (
      <span className="flex items-center gap-1 w-full justify-center select-none">
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
      <span className="block text-center w-full min-w-[60px]">
        {row.getValue("registrations")}
      </span>
    ),
  },
  // Actions column (dropdown menu and dialog)
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      // Each row gets its own dialog state
      const course = row.original
      const [open, setOpen] = React.useState(false)
      return (
        <>
          {/* Row actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200">
              <DropdownMenuLabel className="border-b border-gray-200 pb-1">Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(course.id)}
                className="cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Copy course ID
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setOpen(true)}
              >
                View details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Participants dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
              className="bg-white max-w-5xl w-full p-8 resize overflow-auto"
              style={{
                minWidth: "700px",
                maxWidth: "1100px",
                borderRadius: "1rem",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              }}
            >
              <DialogTitle className="mb-4 text-2xl font-semibold">
                Participants for {course.course}
              </DialogTitle>
              <div className="rounded-xl border border-gray-200 bg-white p-2 max-h-[70vh] overflow-auto overflow-x-auto">
                <ParticipantsTable participants={course.participants ?? []} />
              </div>
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]

// -------------------- Main Table Component --------------------
/**
 * Renders the main courses table with filtering, sorting, pagination, and actions.
 * @param data Array of CourseRow objects (courses with participants)
 */
export function CourseTable({ data }: { data: CourseRow[] }) {
  // Table state hooks
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Create the table instance
  const table = useReactTable({
    data,
    columns,
    initialState: { pagination: { pageSize: 5 } },
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
          placeholder="Filter courses..."
          value={(table.getColumn("course")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("course")?.setFilterValue(event.target.value)
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
      <div className="rounded-2xl shadow-xl border border-gray-200 overflow-hidden bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="bg-gray-600">
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