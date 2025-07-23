import * as React from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { Column } from "@tanstack/react-table"

type FilterHeaderProps<TData extends Record<string, unknown>, TValue> = {
  column: Column<TData, TValue>
  label: string
  placeholder?: string,
  alignRight?: boolean,
}
/**
 * FilterHeader
 * 
 * - Renders a table header with a label, sorting controls, and a single input filter.
 * - Clicking the label toggles the filter input visibility.
 * - Clicking the sort icon toggles sorting for the column.
 * - Used in tables with @tanstack/react-table for filtering and sorting.
 */
export function FilterHeader<TData extends Record<string, unknown>, TValue>({
  column,
  label,
  placeholder = "Filter...",
  alignRight = false
}: FilterHeaderProps<TData, TValue>) {
  const [showFilter, setShowFilter] = React.useState(false)
  const filterRef = React.useRef<HTMLSpanElement>(null)

  // Handles closing the filter popover when clicking outside
  const handleClick = React.useCallback((event: MouseEvent) => {
    if (
      filterRef.current &&
      !filterRef.current.contains(event.target as Node)
    ) {
      setShowFilter(false)
    }
  }, [])

  // Attach/detach click-away listener when filter is open
  React.useEffect(() => {
    if (!showFilter) return
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showFilter, handleClick])

  // Toggle filter input visibility
  const toggleFilter = React.useCallback(() => {
    setShowFilter(v => !v)
  }, [])

  const colId = column.id

  return (
    <div className={ `w-56 min-w-[12rem] flex ${alignRight ? ' justify-end ': ''}`}>
    <span
      ref={filterRef}
      className="flex flex-col  pl-2 relative"
    >
      {/* Header label and sort icon */}
      <span className="flex items-center gap-1 select-none">
        {/* Clickable label to toggle filter */}
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
        {/* Sort icon, toggles sorting on click */}
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
      {/* Filter input shown when filter is open */}
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
          onKeyDown={e => {
            if (e.key === "Escape") setShowFilter(false)
          }}
        />
      )}
    </span>
    </div>
  )
}