import * as React from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { Column } from "@tanstack/react-table"


type FilterHeaderProps<T> = {
  column: Column<T, unknown>
  label: string
  placeholder?: string
}

export function FilterHeader<T>({ column, label, placeholder = "Filter..." }: FilterHeaderProps<T>) {
  const [showFilter, setShowFilter] = React.useState(false)

  const toggleFilter = React.useCallback(() => {
    setShowFilter(v => !v)
  }, [])

  const colId = column.id

  return (
    <span className="flex flex-col w-56 min-w-[12rem] pl-2 relative">
      <span className="flex items-center gap-1 select-none">
        <span
          className="cursor-pointer truncate"
          onClick={toggleFilter}
          tabIndex={0}
          role="button"
          aria-expanded={showFilter}
          aria-controls={`filter-${colId}`}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") toggleFilter()
          }}
        >
          {label}
        </span>
        <span
          className="ml-1 h-4 w-4 cursor-pointer flex"
          onClick={() => column.toggleSorting()}
          role="button"
          tabIndex={0}
          aria-label={
            column.getIsSorted() === "asc"
              ? "Sort descending"
              : column.getIsSorted() === "desc"
              ? "Clear sort"
              : "Sort ascending"
          }
          aria-pressed={!!column.getIsSorted()}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") column.toggleSorting()
          }}
        >
          {column.getIsSorted() === "asc" ? (
            <ArrowDown className="h-4 w-4 text-yellow-100" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowUp className="h-4 w-4 text-yellow-100" />
          ) : (
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
          )}
        </span>
      </span>
      {showFilter && (
        <input
          id={`filter-${colId}`}
          type="text"
          autoFocus
          placeholder={placeholder}
          value={(column.getFilterValue() as string) ?? ""}
          onChange={e => column.setFilterValue(e.target.value)}
          className="block rounded border px-2 py-1 text-xs bg-white shadow text-black w-32 truncate"
          aria-label={`Filter ${label}`}
          onBlur={() => setShowFilter(false)}
        />
      )}
    </span>
  )
}
