import * as React from "react"
import { ArrowUpDown } from "lucide-react"
import type { Column } from "@tanstack/react-table"

type FilterHeaderProps = {
  column: Column<any, any>
  label: string
  placeholder?: string
}

export function FilterHeader({ column, label, placeholder = "Filter..." }: FilterHeaderProps) {
  const [showFilter, setShowFilter] = React.useState(false)
  
  return (
    <span className="flex flex-col w-56 min-w-[12rem] pl-2 relative">
      <span className="flex items-center gap-1 select-none">
        <span
          className="cursor-pointer"
          onClick={() => setShowFilter(s => !s)}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") setShowFilter(s => !s)
          }}
          role="button"
        >
          {label}
        </span>
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
      {showFilter && (
        <input
          type="text"
          autoFocus
          placeholder={placeholder}
          value={(column.getFilterValue() as string) ?? ""}
          onChange={e => column.setFilterValue(e.target.value)}
          className="mt-1 block w-full rounded border px-2 py-1 text-xs bg-white shadow text-black"
          onBlur={() => setShowFilter(false)}
        />
      )}
    </span>
  )
}