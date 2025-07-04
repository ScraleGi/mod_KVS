import * as React from "react"
import { ArrowUpDown } from "lucide-react"
import type { Column } from "@tanstack/react-table"

type DoubleFilterHeaderProps = {
  column: Column<any, any>
  label: string
  placeholderFrom?: string
  placeholderTo?: string
  typeDefinition: "date" | "datetime-local" | "time" | "month" | "week" | "number" | "text"
}

export function DoubleFilterHeader({
  column,
  label,
  placeholderFrom,
  placeholderTo,
  typeDefinition,
}: DoubleFilterHeaderProps) {
  const [showFilter, setShowFilter] = React.useState(false)
  const filterValue = (column.getFilterValue() as [string, string]) ?? ["", ""]
  const filterRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!showFilter) return
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showFilter])

  React.useEffect(() => {
    if (showFilter && filterRef.current) {
      const input = filterRef.current.querySelector("input[type='date']") as HTMLInputElement | null
      input?.focus()
    }
  }, [showFilter])

  return (
    <span className="flex flex-col w-32 min-w-[7rem] relative">
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
                  ? "text-yellow-100"
                  : "text-yellow-100"
                : "text-gray-400"
            }`}
          />
        </span>
      </span>
      {showFilter && (
        <div
          ref={filterRef}
          className="flex justify-center gap-2 w-full mt-1"
        >
          <input
            type={typeDefinition}
            value={filterValue[0]}
            onChange={e => column.setFilterValue([e.target.value, filterValue[1]])}
            className="rounded border px-1 py-0.5 text-xs bg-white shadow text-black w-32"
            placeholder={placeholderFrom}
          />
          <input
            type={typeDefinition}
            value={filterValue[1]}
            onChange={e => column.setFilterValue([filterValue[0], e.target.value])}
            className="rounded border px-1 py-0.5 text-xs bg-white shadow text-black w-32"
            placeholder={placeholderTo}
          />
        </div>
      )}
    </span>
  )
}