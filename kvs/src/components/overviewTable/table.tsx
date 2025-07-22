"use client"

// -------------------- External Imports --------------------
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
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// -------------------- Internal Imports --------------------
import { CourseParticipantsDialog } from "../participants/CourseParticipantsDialog"
import { TrainerCourseDialog } from "../trainer/TrainerCourseDialog"
import { CoursesDialog } from "../participants/participantCoursesDialog"
import { DocumentDialog } from "../participants/DocumentDialog"
import { FilterHeader } from "./FilterHeader"
import { DoubleFilterHeader } from "./DoubleFilterHeader"
import { formatFullName } from "@/lib/utils"
import { DownloadPDFLink } from "@/components/DownloadButton/DownloadButton"

// -------------------- Types --------------------
export type Participant = {
  id: string
  name: string
  surname: string
  invoice: string
}

export type ParticipantRow = {
  id: string
  name: string
  surname: string
  email: string
  phoneNumber: string
  courses: { id: string; name: string; startDate?: string | Date }[]
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

export type AreaRow = {
  id: string
  area: string
  programs?: { id: string; name: string }[]
  courseCount: number
  participantCount: number
  courses?: CourseRow[]
}

export type ProgramRow = {
  id: string
  program: string
  area: string
  courses: number
  teachingUnits: number | null
  price: number | null
}

export type TrainerRow = {
  id: string
  name: string
  surname: string
  email: string
  phoneNumber: string
  mainCourses?: { id: string; name: string; startDate?: string }[]
  courses?: { id: string; name: string; startDate?: string }[]
}

export type CourseParticipantRow = {
  id: string
  participant: {
    name: string
    surname: string
    email?: string
    phoneNumber?: string
  } | null
  invoices: {
    id: string
    invoiceNumber: string
    dueDate: Date | string | null
    isCancelled?: boolean 
  }[]
  generatedDocuments: {
    id: string
    file: string
    role: string
    createdAt: Date | string
  }[]
  discountAmount?: string | number | null
  subsidyAmount?: string | number | null
  discountRemark?: string | null
  subsidyRemark?: string | null
}

export type PrivilegesColumns = {
  id: string
  email: string
  roles: string
}

// -------------------- Table Columns Definition --------------------
// Each columns array defines the columns for a specific table type.
// Use these with the CourseTable component for different data views.

  /*********************************** */
  // Course Sorting 
  /*********************************** */
export const home: ColumnDef<CourseRow>[] = [
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
      <Link
        href={`/course/${row.original.id}`}
        className="relative text-blue-600 hover:text-blue-800 pl-8 inline-block after:content-[''] after:absolute after:left-8 after:bottom-0 after:w-0 hover:after:w-[calc(100%-2rem)] after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300"
        style={{ whiteSpace: "nowrap", overflowWrap: "normal" }}
      >
        {row.getValue("course")}
      </Link>
    ),
  },
  // Area Sorting
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
      if (isNaN(date.getTime())) return false
      const [from, to] = filterValue
      if (from && date < new Date(from)) return false
      if (to && date > new Date(to)) return false
      return true
    },

    sortingFn:(rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId)
      const b = rowB.getValue(columnId)
      const dateA = a ? new Date(a as string) : null
      const dateB = b ? new Date(b as string) : null
      
      if ((!dateA || isNaN(dateA.getTime())) && (!dateB || isNaN(dateB.getTime()))) return 0
      if (!dateA || isNaN(dateA.getTime())) return 1
      if (!dateB || isNaN(dateB.getTime())) return -1

      return dateA.getTime() - dateB.getTime()
    },
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
    {
        id: "actions",
        size: 80,
        header: "Aktionen",
        cell: ({ row }) => (
        <div className="flex justify-center gap-1">
            <Link
            href={`/course/${row.original.id}/edit`}
            className="p-2 rounded hover:bg-blue-100 text-blue-600 transition"
            title="Bearbeiten"
            aria-label="Bearbeiten"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            </Link>
        </div>
        ),
    },

]

/*********************************** */
// Participant Sorting 
/*********************************** */

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
    className="relative text-blue-600 hover:text-blue-800 inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300"
    style={{ whiteSpace: "nowrap" }}
  >
    {row.original.name} {row.original.surname}
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
    cell: ({ row }) =>
      <span className="block pl-2">{row.getValue("email")}</span>
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
      <span className="block pl-2">{row.getValue("phoneNumber")}</span>
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
      <span className="block pl-2">
        <CoursesDialog courses={row.original.courses ?? []} />
      </span>
    ),
    // Filter: nach Anzahl der Kurse (als Zahl oder String im Input)
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (!value || !Array.isArray(value)) return false
      const count = value.length
      if (typeof filterValue === "number") {
        return count === filterValue
      } else if (typeof filterValue === "string") {
        const num = parseInt(filterValue, 10)
        return !isNaN(num) && count === num
      }
      return false
    },
    // Sortierung nach Anzahl der Kurse
    sortingFn: (rowA, rowB) => {
      const a = Array.isArray(rowA.original.courses) ? rowA.original.courses.length : 0
      const b = Array.isArray(rowB.original.courses) ? rowB.original.courses.length : 0
      return a - b
    },
  },
]

/*********************************** */
// Area Sorting 
/*********************************** */

export const areaColumns: ColumnDef<AreaRow>[] = [
  {
    accessorKey: "area",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="Bereich"
        placeholder="Filter Bereich..."
      />
    ),
    cell: ({ row }) => (
      <Link
        href={`/area/${row.original.id}`}
        className="relative text-blue-600 hover:text-blue-800 inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300"
      >
        {row.original.area}
      </Link>
    ),
  },
  {
    accessorKey: "programs",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="Programme"
        placeholder="Filter Programme..."
      />
    ),
    cell: ({ row }) => (
      <span className="block pl-2">
        {row.original.programs?.length ?? 0}
      </span>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (!value || !Array.isArray(value)) return false
      const count = value.length
      if (typeof filterValue === "number") {
        return count === filterValue
      } else if (typeof filterValue === "string") {
        const num = parseInt(filterValue, 10)
        return !isNaN(num) && count === num
      }
      return false
    },
  },
  {
    accessorKey: "courseCount",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="Kurse"
        placeholder="Filter Kurse..."
      />
    ),
    cell: ({ row }) => (
      <span className="block pl-2">
        {row.getValue("courseCount")}
      </span>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (typeof value !== "number") return false
      if (typeof filterValue === "number") {
        return value === filterValue
      } else if (typeof filterValue === "string") {
        const num = parseInt(filterValue, 10)
        return !isNaN(num) && value === num
      }
      return false
    },
  },
  {
    accessorKey: "participantCount",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="Teilnehmer"
        placeholder="Filter Teilnehmer..."
      />
    ),
    cell: ({ row }) => (
      <span className="block pl-2">
        {row.getValue("participantCount")}
      </span>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (typeof value !== "number") return false
      if (typeof filterValue === "number") {
        return value === filterValue
      } else if (typeof filterValue === "string") {
        const num = parseInt(filterValue, 10)
        return !isNaN(num) && value === num
      }
      return false
    },
  },
  {
    id: "actions",
    header: "Aktionen",
    cell: ({ row }) => (
      <div className="flex justify-center gap-1">
        <Link
          href={`/area/${row.original.id}/edit`}
          className="p-2 rounded hover:bg-blue-100 text-blue-600 transition"
          title="Bearbeiten"
          aria-label="Bearbeiten"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
      </div>
    ),
  }
]

/*********************************** */
// Program Sorting 
/*********************************** */

export const programColumns: ColumnDef<ProgramRow>[] = [
  {
    accessorKey: "program",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="Programm"
        placeholder="Filter Programm..."
      />
    ),
    cell: ({ row }) => (
      <Link
        href={`/program/${row.original.id}`}
        className="relative text-blue-600 hover:text-blue-800 inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300"
      >
        {row.original.program}
      </Link>
    ),
  },
  {
    accessorKey: "area",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="Bereich"
        placeholder="Filter Bereich..."
      />
    ),
    cell: ({ row }) => (
      <span className="block pl-2">{row.original.area}</span>
    ),
  },
  {
    accessorKey: "courses",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="Kurse"
        placeholder="Filter Kurse..."
      />
    ),
    cell: ({ row }) => (
      <span className="block pl-2">
        {row.original.courses ?? "N/A"}
      </span>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (typeof value !== "number") return false
      if (typeof filterValue === "number") {
        return value === filterValue
      } else if (typeof filterValue === "string") {
        const num = parseInt(filterValue, 10)
        return !isNaN(num) && value === num
      }
      return false
    },
  },
  {
    accessorKey: "teachingUnits",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="Einheit"
        placeholder="Filter Einheit..."
      />
    ),
    cell: ({ row }) => (
      <span className="block pl-2">
        {row.original.teachingUnits ?? "N/A"}
      </span>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (typeof value !== "number") return false
      if (typeof filterValue === "number") {
        return value === filterValue
      } else if (typeof filterValue === "string") {
        const num = parseInt(filterValue, 10)
        return !isNaN(num) && value === num
      }
      return false
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="Preis"
        placeholder="Filter Preis..."
      />
    ),
    cell: ({ row }) => (
      <span className="block pl-2">
        {row.original.price != null ? `€${row.original.price.toFixed(2)}` : "N/A"}
      </span>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (value == null || typeof value !== "number") return false
      const valueStr = value.toFixed(2) // z.B. "179.98"
      if (typeof filterValue === "number") {
        return valueStr.includes(filterValue.toString())
      } else if (typeof filterValue === "string") {
        return valueStr.includes(filterValue)
      }
      return false
    },
  },
  {
    id: "actions",
    header: "Aktionen",
    cell: ({ row }) => (
      <div className="flex justify-center gap-1">
        <Link
          href={`/program/${row.original.id}/edit`}
          className="p-2 rounded hover:bg-blue-100 text-blue-600 transition"
          title="Bearbeiten"
          aria-label="Bearbeiten"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
      </div>
    ),
  },
]

/*********************************** */
// Course Participants Sorting 
/*********************************** */

  export const courseParticipantsColumns: ColumnDef<CourseParticipantRow>[] = [
  {
    accessorKey: "participant",
    header: ({ column }) => (
      <FilterHeader column={column} label="Name" placeholder="Filter Name..." />
    ),
    cell: ({ row }) => {
      const p = row.original.participant
      return p ? (
        <Link
          href={`/courseregistration/${row.original.id}`}
          className="relative text-blue-600 hover:text-blue-800 inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300"
        >
          {formatFullName(p)}
        </Link>
      ) : (
        <span className="text-gray-400">Unknown</span>
      )
    },
    filterFn: (row, _columnId, filterValue) => {
      const p = row.original.participant
      if (!p) return false
      return (
        p.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        p.surname.toLowerCase().includes(filterValue.toLowerCase())
      )
    },
  },
  {
  accessorKey: "invoices",
  header: "Rechnungen",
  cell: ({ row }) => {
    // Only show invoices that are not cancelled
    const invoices = (row.original.invoices || []).filter(inv => !inv.isCancelled);
    if (!invoices.length) {
      return <span className="text-gray-400">—</span>;
    }
    return (
      <span className="flex flex-wrap gap-2 items-center">
        {invoices.map((inv, idx) => (
          <span key={inv.id} className="flex items-center gap-1">
            <DownloadPDFLink
              uuidString={row.original.id}
              filename={`${inv.invoiceNumber}.pdf`}
              displayName={`${inv.invoiceNumber}`}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            />
            <Link
              href={`/invoice/${inv.id}`}
              className="ml-1 text-gray-400 hover:text-blue-600 transition"
              title="Details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
              </svg>
            </Link>
            {idx < invoices.length - 1 && <span>,</span>}
          </span>
        ))}
      </span>
    );
  },
},
  {
    accessorKey: "discountAmount",
    header: ({ column }) => (
      <FilterHeader column={column} label="Rabatt" placeholder="Filter Rabatt..." />
    ),
    cell: ({ row }) => {
      const value = row.original.discountAmount
      const remark = row.original.discountRemark
      if (value) {
        return (
          <span className="ml-1 text-xs text-gray-700">
            -{value} €{remark ? ` (${remark})` : ""}
          </span>
        )
      }
      return <span className="text-gray-400">—</span>
    },
    filterFn: (row, _columnId, filterValue) => {
      const value = row.original.discountAmount?.toString() ?? ""
      const remark = row.original.discountRemark ?? ""
      return (
        value.includes(filterValue) ||
        remark.toLowerCase().includes(filterValue.toLowerCase())
      )
    },
  },
  {
    accessorKey: "subsidyAmount",
    header: ({ column }) => (
      <FilterHeader column={column} label="Gutschein" placeholder="Filter Subvention..." />
    ),
    cell: ({ row }) => {
      const value = row.original.subsidyAmount
      const remark = row.original.subsidyRemark
      if (value) {
        return (
          <span className="ml-1 text-xs text-gray-700">
            -{value} €{remark ? ` (${remark})` : ""}
          </span>
        )
      }
      return <span className="text-gray-400">—</span>
    },
    filterFn: (row, _columnId, filterValue) => {
      const value = row.original.subsidyAmount?.toString() ?? ""
      const remark = row.original.subsidyRemark ?? ""
      return (
        value.includes(filterValue) ||
        remark.toLowerCase().includes(filterValue.toLowerCase())
      )
    },
  },
  {
    accessorKey: "generatedDocuments",
    header: () => (
      <span>Dokumente</span>
    ),
    cell: ({ row }) => {
      const docs = row.original.generatedDocuments;
      const participant = row.original.participant;
      const participantName = participant
        ? `${participant.name} ${participant.surname}`.trim()
        : "Unbekannt";
      if (!docs || docs.length === 0) {
        return <span className="text-gray-400">—</span>;
      }
      return (
        <DocumentDialog
          documents={docs}
          registrationId={row.original.id}
          participantName={participantName}
          trigger={
            <span className="cursor-pointer text-blue-600">
              {docs.length}
            </span>
          }
        />
      );
    },
  },
  {
    accessorKey: "participant.email",
    header: ({ column }) => (
      <FilterHeader column={column} label="E-Mail" placeholder="Filter E-Mail..." />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.participant?.email ?? <span className="text-gray-400">—</span>}
      </span>
    ),
    filterFn: (row, _columnId, filterValue) => {
      const email = row.original.participant?.email ?? ""
      return email.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: "participant.phoneNumber",
    header: ({ column }) => (
      <FilterHeader column={column} label="Telefon" placeholder="Filter Telefon..." />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.participant?.phoneNumber ?? <span className="text-gray-400">—</span>}
      </span>
    ),
    filterFn: (row, _columnId, filterValue) => {
      const phone = row.original.participant?.phoneNumber ?? ""
      return phone.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
{
  id: "actions",
  header: "Aktionen",
  cell: ({ row }) => (
    <div className="flex items-center justify-center h-full">
      <Link
        href={`/courseregistration/${row.original.id}`}
        className="p-2 rounded hover:bg-blue-100 text-blue-600 transition"
        title="Bearbeiten"
        aria-label="Bearbeiten"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </Link>
    </div>
  ),
},
]

/*********************************** */
// Trainer Sorting 
/*********************************** */
export const trainerColumns: ColumnDef<TrainerRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="Vorname"
        placeholder="Filter Vorname..."
      />
    ),
    cell: ({ row }) => (
      <Link
        href={`/trainer/${row.original.id}`}
        className="relative text-blue-600 hover:text-blue-800 pl-8 inline-block after:content-[''] after:absolute after:left-8 after:bottom-0 after:w-0 hover:after:w-[calc(100%-2rem)] after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300"
      >
        {row.original.name} {row.original.surname}
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
    cell: ({ row }) => (
      <span className="block pl-2">{row.getValue("email")}</span>
    ),
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
      <span className="block pl-2">{row.getValue("phoneNumber")}</span>
    ),
  },
  {
    accessorKey: "mainCourses",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="Hauptkurse"
        placeholder="Filter Hauptkurse..."
      />
    ),
    cell: ({ row }) => (
      <span className="block pl-2">
        <TrainerCourseDialog courses={row.original.mainCourses ?? []}>
          {row.original.mainCourses?.length ?? 0}
        </TrainerCourseDialog>
      </span>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (!value || !Array.isArray(value)) return false
      const count = value.length
      if (typeof filterValue === "number") {
        return count === filterValue
      } else if (typeof filterValue === "string") {
        const num = parseInt(filterValue, 10)
        return !isNaN(num) && count === num
      }
      return false
    },
  },
  {
    accessorKey: "courses",
    header: ({ column }) => (
      <FilterHeader
        column={column}
        label="Kurse"
        placeholder="Filter Kurse..."
      />
    ),
    cell: ({ row }) => (
     <span className="block pl-2">
      <TrainerCourseDialog courses={row.original.courses ?? []}>
        {row.original.courses?.length ?? 0}
      </TrainerCourseDialog>
      </span>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (!value || !Array.isArray(value)) return false
      const count = value.length
      if (typeof filterValue === "number") {
        return count === filterValue
      } else if (typeof filterValue === "string") {
        const num = parseInt(filterValue, 10)
        return !isNaN(num) && count === num
      }
      return false
    },
  },
]
/*********************************** */
// Privileges Sorting 
/*********************************** */

export const privilegesColumns: ColumnDef<PrivilegesColumns>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="block pl-2">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "email",
    header: "E-Mail",
    cell: ({ row }) => 
      <Link
        href={`/user/${row.original.id}`}
        className="block pl-2 text-blue-600 hover:text-blue-800"
        style={{ whiteSpace: "nowrap", overflowWrap: "normal" }}
      >
        {row.getValue("email")}
      </Link>,
  },
  {
    accessorKey: "roles",
    header: "Rollen",
    cell: ({ row }) => <span className="block pl-2">{row.getValue("roles")}</span>,
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
  courseId, // <-- Add this prop if you want to pass the course id for the button link
}: {
  data: T[]
  columns: ColumnDef<T>[]
  filterColumn?: string
  courseId?: string // optional, for dynamic link
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

   // Helper to check if columns is courseParticipantsColumns
  const isCourseParticipantsTable =
    columns === courseParticipantsColumns

  // -------------------- Render --------------------
  return (
    <div className="w-full">
      {/* Filter and column visibility controls */}
      <div className="flex items-center py-4">
        {isCourseParticipantsTable && (
          <>
            <Link
              href={courseId ? `/course/${courseId}/courseDocuments` : "/course/courseDocuments"}
              className="mr-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium flex items-center"
              title="Dokumente generieren"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Dokumente generieren
            </Link>
            <Link
              href={courseId ? `/course/${courseId}/courseInvoices` : "/course/courseInvoices"}
               className="mr-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium flex items-center"
              title="Rechnungen generieren"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Rechnungen generieren
            </Link>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto cursor-pointer">
              Filter <ChevronDown />
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
      <div className="shadow border border-gray-200 bg-white rounded-md">
        <div className="overflow-x-auto w-full">
         <Table className="min-w-[900px]">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-600 hover:bg-gray-600 border-b border-gray-200" 
              >
                {headerGroup.headers.map((header, colIdx) => (
                  <TableHead
                    key={header.id}
                    className={`py-4 px-3 text-gray-100 font-semibold text-base
                      ${colIdx === 0 ? "sticky left-0 z-20 bg-gray-600" : ""}
                    `}
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
              table.getRowModel().rows.map((row, idx, arr) => {
                const rowBg = idx % 2 === 0 ? "bg-slate-50" : "bg-white";
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`group transition-colors ${rowBg} hover:bg-blue-50 ${idx !== arr.length - 1 ? "border-b border-gray-200" : ""}`}
                  >
                    {row.getVisibleCells().map((cell, colIdx) => (
                      <TableCell
                        key={cell.id}
                        className={`py-3 px-3 text-gray-800
                          ${colIdx === 0
                            ? `sticky left-0 z-10 ${rowBg} group-hover:bg-blue-50 transition-colors`
                            : ""}
                        `}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                  Keine Resultate.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>
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
          Zurück
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Vor
        </Button>
      </div>
    </div>
  )
}