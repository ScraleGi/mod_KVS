
import Link from 'next/link'

export default function Home() {
  return (
    <>
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to KVS</h1>
      <p className="mb-6">
        This is a platform for managing and organizing the DCV Courses.
        Get started by exploring our different areas.
      </p>
      <div>
        <Link href="/areas" className="text-blue-500 hover:text-blue-700 underline">
          View Areas
        </Link>
      </div>
    </main>
    </>
  );
}
