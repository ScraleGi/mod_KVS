"use client"

import Link from "next/link"
import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, UserPlus } from "lucide-react"
import { CoursesDialog } from "./participantCoursesDialog"

export type ParticipantRow = {
  id: string
  name: string
  email: string
  phoneNumber: string
  courses: { id: string; name: string; startDate?: string | Date }[] // <-- Add startDate here
}

export const AddParticipantButton = () => {
  return (
    <Link href="/participant/new">
      <button 
        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-medium text-sm transition-colors shadow-sm cursor-pointer"
      >
        <UserPlus size={16} />
        <span>Add Participant</span>
      </button>
    </Link>
  )
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
    accessorFn: row => row.courses.length,
  },
]