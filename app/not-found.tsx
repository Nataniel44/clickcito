import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-center flex-col items-center justify-center p-6 bg-white">
            <h2 className="text-4xl font-black text-gray-900 mb-4">404 - Página no encontrada</h2>
            <p className="text-gray-500 mb-8 font-medium">Lo sentimos, la página que buscas no existe.</p>
            <Link
                href="/"
                className="px-8 py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 transition-all"
            >
                Volver al Inicio
            </Link>
        </div>
    )
}
