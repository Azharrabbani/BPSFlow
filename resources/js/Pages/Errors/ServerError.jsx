import { Head, Link } from "@inertiajs/react";

export default function ServerError({ error }) {
    console.log(error);
    return (
        <>
            <Head title="Server Error" />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
                <div className="max-w-md text-center">
                    <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
                    <h2 className="text-2xl font-semibold mb-2">Oops! Something went wrong.</h2>
                    <p className="text-gray-600 mb-6">
                        Kami sedang berusaha memperbaikinya. Silakan coba lagi nanti atau kembali ke dashboard.
                    </p>
                    <Link 
                        href={route('dashboard')} 
                        className="inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                    >
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </>
    );
}
