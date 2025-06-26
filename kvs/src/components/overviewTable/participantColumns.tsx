"use client"

import Link from "next/link"
import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { CoursesDialog } from "./participantCoursesDialog"

export type ParticipantRow = {
  id: string
  name: string
  email: string
  phoneNumber: string
  courses: { id: string; name: string }[]
}

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
        className="text-blue-600 hover:text-blue-800 underline pl-8 block"
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
        <CoursesDialog courses={row.original.courses} />
      </div>
    ),
    accessorFn: row => row.courses.length,
  },
]