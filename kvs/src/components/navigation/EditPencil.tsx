import Link from 'next/link'
import { Pencil } from 'lucide-react'


export default function EditPencil({ goTo, auth }: {
    goTo: string,
    auth?: boolean
}) {
    if (auth === true) {
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