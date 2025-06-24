import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <main className="w-full max-w-xl mx-auto backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl border border-gray-100 p-10 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-6 tracking-tight text-center">
          Welcome to KVS
        </h1>
        <p className="mb-8 text-gray-700 text-center">
          This is a platform for managing and organizing the DCV Courses.<br />
          Get started by exploring our different areas.
        </p>
        <ul className="space-y-4">
          <li>
            <Link
              href="/area"
              className="block w-full text-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              View Areas
            </Link>
          </li>
          <li>
            <Link
              href="/program"
              className="block w-full text-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              View Programs
            </Link>
          </li>
          <li>
            <Link
              href="/course"
              className="block w-full text-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              View Courses
            </Link>
          </li>
                    <li>
            <Link
              href="/table"
              className="block w-full text-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              View Courses Table
            </Link>
          </li>
        </ul>
      </main>
    </div>
  )
}