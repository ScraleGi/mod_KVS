import * as React from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { Column } from "@tanstack/react-table"

type DoubleFilterHeaderProps<TData extends Record<string, unknown>, TValue> = {
  column: Column<TData, TValue>
  label: string
  placeholderFrom?: string
  placeholderTo?: string
  typeDefinition: "date" | "datetime-local" | "time" | "month" | "week" | "number" | "text"
  alignRight?: boolean
}

export function DoubleFilterHeader<TData extends Record<string, unknown>, TValue>({
  column,
  label,
  placeholderFrom,
  placeholderTo,
  typeDefinition,
  alignRight = false
}: DoubleFilterHeaderProps<TData, TValue>) {
  const [showFilter, setShowFilter] = React.useState(false)
  const filterRef = React.useRef<HTMLSpanElement>(null)
  const inputFromRef = React.useRef<HTMLInputElement>(null)
  const inputToRef = React.useRef<HTMLInputElement>(null)

  // Click-away handler
  const handleClick = React.useCallback((event: MouseEvent) => {
    if (
      filterRef.current &&
      !filterRef.current.contains(event.target as Node)
    ) {
      setShowFilter(false)
    }
  }, [])

  React.useEffect(() => {
    if (!showFilter) return
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showFilter, handleClick])

  // Focus first input when filter opens
  React.useEffect(() => {
    if (showFilter && inputFromRef.current) {
      inputFromRef.current.focus()
    }
  }, [showFilter])

  const toggleFilter = React.useCallback(() => {
    setShowFilter(v => !v)
  }, [])

  const filterValue = (column.getFilterValue() as [string, string]) ?? ["", ""]
  const colId = column.id

  // Handle Escape key on each input
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setShowFilter(false)
    }
  }

  return (
    <div className={ `w-56 min-w-[12rem] flex ${alignRight ? ' justify-end ': ''}`}>
    <span
      ref={filterRef}
      className="flex flex-col  pl-2 relative"
    >
      <span className="flex items-center gap-1 select-none">
        <span
          className="cursor-pointer"
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
        <div className="flex justify-center gap-2 w-full mt-1">
<input
  ref={inputFromRef}
  type={typeDefinition}
  value={filterValue[0]}
  onChange={e => column.setFilterValue([e.target.value, filterValue[1]])}
  className="rounded border px-2 py-1 text-xs bg-white shadow text-black w-32"
  placeholder={placeholderFrom}
  aria-label={`Filter ${label} von`}
  onKeyDown={handleInputKeyDown}
/>
<input
  ref={inputToRef}
  type={typeDefinition}
  value={filterValue[1]}
  onChange={e => column.setFilterValue([filterValue[0], e.target.value])}
  className="rounded border px-2 py-1 text-xs bg-white shadow text-black w-32"
  placeholder={placeholderTo}
  aria-label={`Filter ${label} bis`}
  onKeyDown={handleInputKeyDown}
/>
        </div>
      )}
    </span>
    </div>
  )
}