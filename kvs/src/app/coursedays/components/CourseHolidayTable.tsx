import { courseHolidayColumns } from '../columns'
import { CourseHoliday } from '../types'
import { createCourseHoliday, updateCourseHoliday, deleteCourseHoliday } from '../actions'
import { TableToolbar } from './TableToolbar'

export function CourseHolidayTable({ holidays, courseId }: { holidays: CourseHoliday[], courseId: string }) {
  return (
    <form action={createCourseHoliday}>
      <input type="hidden" name="courseId" value={courseId} />
      <TableToolbar onAdd={() => {}} />
      <table className="w-full border">
        <thead>
          <tr>
            {courseHolidayColumns.map(col => (
              <th key={col.key} className="border px-2 py-1">{col.label}</th>
            ))}
            <th className="border px-2 py-1">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map(h => (
            <tr key={h.id}>
              <td className="border px-2 py-1">
                <input name="title" defaultValue={h.title} formAction={updateCourseHoliday} />
                <input type="hidden" name="id" value={h.id} />
                <input type="hidden" name="courseId" value={courseId} />
              </td>
              <td className="border px-2 py-1">
                <input name="date" type="date" defaultValue={h.date.slice(0, 10)} formAction={updateCourseHoliday} />
                <input type="hidden" name="id" value={h.id} />
                <input type="hidden" name="courseId" value={courseId} />
              </td>
              <td className="border px-2 py-1">
                <form action={deleteCourseHoliday}>
                  <input type="hidden" name="id" value={h.id} />
                  <input type="hidden" name="courseId" value={courseId} />
                  <button type="submit" className="text-red-500">Löschen</button>
                </form>
              </td>
            </tr>
          ))}
          <tr>
            <td className="border px-2 py-1">
              <input name="title" placeholder="Titel" />
            </td>
            <td className="border px-2 py-1">
              <input name="date" type="date" />
            </td>
            <td className="border px-2 py-1">
              <button type="submit" className="text-green-600">Hinzufügen</button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  )
}