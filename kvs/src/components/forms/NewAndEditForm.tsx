import Link from 'next/link';
export async function NewAndEditForm(
    {
        title,
        formAction,
        children,
        navHref,
        navHrefText,
        navTitle,
        buttonText,
    }: {
        title: string;
        formAction: string | ((formData: FormData) => Promise<void>);
        children: React.ReactNode;
        navHref: string;
        navHrefText: string;
        navTitle: string;
        buttonText: string;
    }
) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10 px-4">
            <div className="w-full max-w-md mx-auto">
                <nav className="max-w-xl mx-auto mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
                    <Link href={navHref} className="hover:underline text-gray-700">{navHrefText}</Link>
                    <span>&gt;</span>
                    <span className="text-gray-700 font-semibold">{navTitle}</span>
                </nav>
                <div className="bg-white rounded-sm shadow border border-gray-100">
                    <div className="px-6 py-8">
                        <h1 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
                            {title}
                        </h1>
                        <form action={formAction} className="space-y-6">
                            {children}
                            <div className="pt-2 flex items-center justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-5 py-2 cursor-pointer border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {buttonText}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
