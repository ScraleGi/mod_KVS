import Link from 'next/link';

/**
 * NewAndEditForm
 * 
 * Renders a form layout with navigation breadcrumbs, a title, and form content.
 * - Supports up to two breadcrumb links and a main title.
 * - children: Main form fields/content.
 * - children2: Optional content below the form (e.g., action buttons).
 */
export async function NewAndEditForm(
    {
        title,
        formAction,
        children,
        children2,
        navHref,
        navHrefText,
        navTitle,
        nav2Href,
        nav2HrefText,
    }: {
        title: string;
        formAction: string | ((formData: FormData) => Promise<void>);
        children: React.ReactNode;
        children2?: React.ReactNode;
        navHref: string;
        navHrefText: string;
        navTitle: string;
        nav2Href?: string;
        nav2HrefText?: string;
    }
) {
    return (
        // Centered container for the form page
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10 px-4">
            <div className="w-full max-w-md mx-auto">
                {/* Breadcrumb navigation */}
                <nav className="max-w-xl mx-auto mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
                    <Link href={navHref} className="hover:underline text-gray-700">{navHrefText}</Link>
                    <span>&gt;</span>
                    {nav2Href && (
                        <>
                            <Link href={nav2Href} className="hover:underline text-gray-700">{nav2HrefText}</Link>
                            <span>&gt;</span>
                        </>
                    )}
                    <span className="text-gray-700 font-semibold">{navTitle}</span>
                </nav>
                {/* Form card */}
                <div className="bg-white rounded-sm shadow border border-gray-100">
                    <div className="px-6 py-8">
                        {/* Form title */}
                        <h1 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
                            {title}
                        </h1>
                        {/* Main form content */}
                        <form action={formAction} className="space-y-6">
                            {children}
                        </form>
                    </div>
                    {/* Optional content below the form (e.g., action buttons) */}
                    {children2}
                </div>
            </div>
        </div>
    );
}