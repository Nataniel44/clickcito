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
                id: item.id || item.cartItemId,
                title: String(item.nombre_producto).substring(0, 250),
                quantity: Math.max(1, Number(item.cantidad)),
                unit_price: Number(item.precio_unitario),
                currency_id: "ARS"
            })),
            back_urls: {
                success: `${baseUrl}/mis-pedidos?payment=success`,
                failure: `${baseUrl}/checkout?payment=failure`,
                pending: `${baseUrl}/mis-pedidos?payment=pending`
            },
            auto_return: "approved",
            statement_descriptor: businessName.substring(0, 16),
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
