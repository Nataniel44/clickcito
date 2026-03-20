"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRestaurantPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        slug: "",
        name: "",
        description: "",
        logo: "",
        banner: "",
        phone: "",
        whatsapp: "",
        email: "",
        address: "",
        deliveryCost: "",
        minOrderAmount: "",
        deliveryTime: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/restaurants", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                deliveryCost: parseFloat(form.deliveryCost) || null,
                minOrderAmount: parseFloat(form.minOrderAmount) || null,
            }),
        });

        if (res.ok) router.push("/admin/restaurants");
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Crear Restaurante</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                {Object.keys(form).map((key) => (
                    <div key={key}>
                        <label className="capitalize text-sm font-semibold">{key}</label>
                        {key === "description" ? (
                            <textarea
                                name={key}
                                value={(form as any)[key]}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            />
                        ) : (
                            <input
                                type="text"
                                name={key}
                                value={(form as any)[key]}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            />
                        )}
                    </div>
                ))}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    {loading ? "Guardando..." : "Guardar Restaurante"}
                </button>
            </form>
        </div>
    );
}
