import Link from 'next/link'
import { Pencil } from 'lucide-react'

/**
 * EditPencil
 * 
 * Renders a pencil icon as a link for editing.
 * - If `auth` is true, shows a disabled/greyed-out icon (no navigation).
 * - Otherwise, shows an active edit link to the provided `goTo` path.
 */
export default function EditPencil({ goTo, auth }: {
    goTo: string,
    auth?: boolean
}) {
    if (auth === true) {
        // Disabled/greyed-out edit icon (no link destination)
        return (
            <Link
                href={``}
                className="absolute top-6 right-6 text-gray-200 transition"
                title="Edit Area"
            >
                <Pencil className="w-5 h-5 cursor-pointer" />
            </Link>
        )
    } else {
        // Active edit icon with navigation
        return (
            <Link
                href={goTo}
                className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 transition"
                title="Bereich bearbeiten"
            >
                <Pencil className="w-5 h-5 cursor-pointer" />
            </Link>
        )
    }
}