"use client";
import { useEffect, useState, useCallback } from "react";

export default function ProductList({ restaurantId }: { restaurantId: number }) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/restaurants/${restaurantId}/products`);
            if (!res.ok) throw new Error("Error al obtener productos");
            const data = await res.json();
            setProducts(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [restaurantId]);

    const deleteProduct = async (productId: number) => {
        if (!confirm("¿Seguro que querés eliminar este producto?")) return;
        try {
            const res = await fetch(`/api/admin/restaurants/${restaurantId}/products`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });
            if (!res.ok) throw new Error("Error al eliminar");
            loadProducts();
        } catch (err) {
            alert("No se pudo eliminar el producto");
        }
    };

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (products.length === 0) return <p>No hay productos aún.</p>;

    return (
        <div className="space-y-3">
            {products.map((p) => (
                <div
                    key={p.id}
                    className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
                >
                    <div>
                        <h3 className="font-medium">{p.name}</h3>
                        <p className="text-sm text-gray-600">${p.price}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() =>
                                window.location.assign(`/admin/products/${p.id}/edit`)
                            }
                            className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => deleteProduct(p.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
