import Link from 'next/link';
export default async function UserInfo() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Zugriff verweigert</h1>
            <p className="text-gray-700">Du hast keine Berechtigung, diese Seite zu sehen.</p>
            <p className="text-gray-700">Bitte kontaktiere deinen Administrator, wenn du denkst, dass dies ein Fehler ist.</p>
            <Link href="/" className="text-blue-600 underline mt-4 inline-block">
                Zurück zur Startseite
            </Link>
        </div>
    );
}
// ...existing code...