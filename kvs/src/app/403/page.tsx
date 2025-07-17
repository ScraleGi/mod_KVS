import Link from 'next/link';
export default async function UserInfo() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center">
                {/* Icon */}
                <svg className="w-16 h-16 text-red-500 mb-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fee2e2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6 6m0-6l-6 6" stroke="#ef4444" strokeWidth="2" />
                </svg>
                <h1 className="text-3xl font-bold text-red-600 mb-2">Zugriff verweigert</h1>
                <p className="text-gray-700 mb-4 text-center">
                    Du hast keine Berechtigung, diese Seite zu sehen.<br />
                    Bitte kontaktiere deinen Administrator, falls du denkst, dass dies ein Fehler ist.
                </p>
                <Link
                    href="/"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
                >
                    Zurück zur Startseite
                </Link>
            </div>
        </div>
    );
}
