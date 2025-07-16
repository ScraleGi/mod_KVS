import { courseSpecialDaysColumns } from '../columns'
import { CourseSpecialDays } from '../types'
import { createCourseSpecialDay, updateCourseSpecialDay, deleteCourseSpecialDay } from '../actions'
import { TableToolbar } from './TableToolbar'

export function CourseSpecialDaysTable({ specialDays, courseId }: { specialDays: CourseSpecialDays[], courseId: string }) {
  return (
    <form action={createCourseSpecialDay}>
      <input type="hidden" name="courseId" value={courseId} />
      <TableToolbar onAdd={() => {}} />
      <table className="w-full border">
        <thead>
          <tr>
            {courseSpecialDaysColumns.map(col => (
              <th key={col.key} className="border px-2 py-1">{col.label}</th>
            ))}
            <th className="border px-2 py-1">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {specialDays.map(d => (
            <tr key={d.id}>
              <td className="border px-2 py-1">
                <input name="title" defaultValue={d.title} formAction={updateCourseSpecialDay} />
                <input type="hidden" name="id" value={d.id} />
                <input type="hidden" name="courseId" value={courseId} />
              </td>
              <td className="border px-2 py-1">
                <input name="startTime" type="datetime-local" defaultValue={d.startTime.slice(0, 16)} formAction={updateCourseSpecialDay} />
                <input type="hidden" name="id" value={d.id} />
                <input type="hidden" name="courseId" value={courseId} />
              </td>
              <td className="border px-2 py-1">
                <input name="endTime" type="datetime-local" defaultValue={d.endTime.slice(0, 16)} formAction={updateCourseSpecialDay} />
                <input type="hidden" name="id" value={d.id} />
                <input type="hidden" name="courseId" value={courseId} />
              </td>
              <td className="border px-2 py-1">
                <input name="pauseDuration" type="time" defaultValue={d.pauseDuration.slice(11, 16)} formAction={updateCourseSpecialDay} />
                <input type="hidden" name="id" value={d.id} />
                <input type="hidden" name="courseId" value={courseId} />
              </td>
              <td className="border px-2 py-1">
                <form action={deleteCourseSpecialDay}>
                  <input type="hidden" name="id" value={d.id} />
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
              <input name="startTime" type="datetime-local" />
            </td>
            <td className="border px-2 py-1">
              <input name="endTime" type="datetime-local" />
            </td>
            <td className="border px-2 py-1">
              <input name="pauseDuration" type="time" />
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