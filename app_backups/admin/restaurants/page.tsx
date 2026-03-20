"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from 'next/image';

export default function RestaurantsPage() {
    const [restaurants, setRestaurants] = useState<any[]>([]);

    const fetchRestaurants = async () => {
        const res = await fetch("/api/admin/restaurants");
        const data = await res.json();
        setRestaurants(data);
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que querés eliminar este restaurante?")) return;
        await fetch(`/api/admin/restaurants/${id}`, { method: "DELETE" });
        fetchRestaurants();
    };

    return (
        <div className="max-w-5xl mx-auto mt-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Restaurantes</h1>
                <Link
                    href="/admin/restaurants/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Nuevo
                </Link>
            </div>

            {restaurants.length === 0 ? (
                <p>No hay restaurantes todavía.</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {restaurants.map((r) => (
                        <div
                            key={r.id}
                            className="border rounded-lg p-4 hover:shadow-lg transition"
                        >
                            {r.logo && (
                                <Image
                                    width={720}
                                    height={568}
                                    src={r.logo}
                                    alt={r.name}
                                    className="w-full h-40 object-cover rounded-md mb-2"
                                />
                            )}
                            <h2 className="text-lg font-semibold">{r.name}</h2>
                            <p className="text-gray-600">{r.address}</p>
                            <p className="text-sm text-gray-500 mt-1">{r.phone}</p>

                            <div className="flex gap-2 mt-4">
                                <Link
                                    href={`/admin/restaurants/${r.id}/edit`}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                                >
                                    Editar
                                </Link>
                                <button
                                    onClick={() => handleDelete(r.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
