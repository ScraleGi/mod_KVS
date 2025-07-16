import { courseRythmColumns } from '../columns'
import { CourseRythm } from '../types'
import { createCourseRythm, updateCourseRythm, deleteCourseRythm } from '../actions'
import { TableToolbar } from './TableToolbar'

export function CourseRythmTable({ rythms, courseId }: { rythms: CourseRythm[], courseId: string }) {
  return (
    <div>
      <form action={createCourseRythm}>
        <input type="hidden" name="courseId" value={courseId} />
        <TableToolbar />
        <table className="w-full border">
          <thead>
            <tr>
              {courseRythmColumns.map(col => (
                <th key={col.key} className="border px-2 py-1">{col.label}</th>
              ))}
              <th className="border px-2 py-1">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {rythms.map(r => (
              <tr key={r.id}>
                <td className="border px-2 py-1">
                  <form action={updateCourseRythm} className="flex gap-2">
                    <input name="title" defaultValue={r.title} className="border px-2 py-1 flex-1" />
                    <select name="weekDay" defaultValue={r.weekDay} className="border px-2 py-1 flex-1">
                      <option value="MONDAY">Montag</option>
                      <option value="TUESDAY">Dienstag</option>
                      <option value="WEDNESDAY">Mittwoch</option>
                      <option value="THURSDAY">Donnerstag</option>
                      <option value="FRIDAY">Freitag</option>
                      <option value="SATURDAY">Samstag</option>
                      <option value="SUNDAY">Sonntag</option>
                    </select>
                    <input name="startTime" type="time" defaultValue={r.startTime.slice(11, 16)} className="border px-2 py-1 flex-1" />
                    <input name="endTime" type="time" defaultValue={r.endTime.slice(11, 16)} className="border px-2 py-1 flex-1" />
                    <input name="pauseDuration" type="time" defaultValue={r.pauseDuration.slice(11, 16)} className="border px-2 py-1 flex-1" />
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="courseId" value={courseId} />
                    <button type="submit" className="text-blue-500 px-2">Speichern</button>
                  </form>
                  <form action={deleteCourseRythm} style={{ display: 'inline' }}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="courseId" value={courseId} />
                    <button type="submit" className="text-red-500 px-2">Löschen</button>
                  </form>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={6}>
                <div className="flex gap-2">
                  <input name="title" placeholder="Titel" className="border px-2 py-1 flex-1" />
                  <select name="weekDay" className="border px-2 py-1 flex-1">
                    <option value="MONDAY">Montag</option>
                    <option value="TUESDAY">Dienstag</option>
                    <option value="WEDNESDAY">Mittwoch</option>
                    <option value="THURSDAY">Donnerstag</option>
                    <option value="FRIDAY">Freitag</option>
                    <option value="SATURDAY">Samstag</option>
                    <option value="SUNDAY">Sonntag</option>
                  </select>
                  <input name="startTime" type="time" className="border px-2 py-1 flex-1" />
                  <input name="endTime" type="time" className="border px-2 py-1 flex-1" />
                  <input name="pauseDuration" type="time" className="border px-2 py-1 flex-1" />
                  <button type="submit" className="text-green-600">Hinzufügen</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  )
}