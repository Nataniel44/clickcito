"use server";

import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
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
        const host = headersList.get("host") || "clickcito.vercel.app";
        const protocol = headersList.get("x-forwarded-proto") || "https";
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
            external_reference: `ORDER-${Date.now()}`,
            notification_url: `${baseUrl}/api/webhooks/mercadopago`
        };

        const response = await preference.create({ body });
        
        // Determinar qué URL de inicio usar (Producción o Sandbox)
        const isSandbox = businessAccessToken.startsWith('TEST-');
        const initPoint = isSandbox ? response.sandbox_init_point : response.init_point;

        return {
            id: response.id,
            init_point: initPoint
        };
    } catch (error: any) {
        console.error("Error creating MP preference:", error);
        throw new Error(error.message || "Error al procesar el pago");
    }
}

/**
 * Obtiene el ID de usuario de Mercado Pago a partir de un Access Token
 */
export async function getMPUserIdAction(accessToken: string) {
    if (!accessToken) return null;
    
    try {
        const response = await fetch('https://api.mercadopago.com/users/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error("Error obteniendo MP User ID:", error);
        return null;
    }
}
