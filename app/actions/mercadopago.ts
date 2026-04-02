"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";
import { headers } from "next/headers";

export async function createPreferenceAction(items: any[], businessAccessToken: string, businessName: string) {
    if (!businessAccessToken) {
        throw new Error("El negocio no tiene configurado Mercado Pago");
    }

    try {
        const client = new MercadoPagoConfig({
            accessToken: businessAccessToken
        });

        const preference = new Preference(client);
        
        // Dynamically get host for back_urls
        const headersList = await headers();
        const host = headersList.get("host") || "localhost:3000";
        const protocol = headersList.get("x-forwarded-proto") || "http";
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

        const body = {
            items: items.map(item => ({
                id: String(item.id || item.cartItemId).substring(0, 50),
                title: String(item.nombre_producto || "Producto")
                    .replace(/[^a-zA-Z0-9\sñáéíóúÁÉÍÓÚ]/g, '')
                    .substring(0, 250) || "Producto Mercado Pago",
                quantity: Math.max(1, Math.floor(Number(item.cantidad))),
                unit_price: Math.max(1, Math.floor(Number(item.precio_unitario))),
                currency_id: "ARS"
            })),
            back_urls: {
                success: `${baseUrl}/mis-pedidos?status=success`,
                failure: `${baseUrl}/checkout?status=failure`,
                pending: `${baseUrl}/mis-pedidos?status=pending`
            },
            // Clean statement descriptor (only alphanumeric and spaces, at least 1 char)
            statement_descriptor: (businessName || "Clickcito")
                .replace(/[^a-zA-Z0-9\s]/g, '')
                .substring(0, 16).trim() || "Clickcito",
            external_reference: `ORDER-${Date.now()}`
        };

        const response = await preference.create({ body });
        
        return {
            id: response.id,
            init_point: response.init_point
        };
    } catch (error: any) {
        console.error("Error creating MP preference:", error);
        throw new Error(error.message || "Error al procesar el pago");
    }
}
