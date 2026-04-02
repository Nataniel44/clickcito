import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/firebase/config';
import { collection, query, where, getDocs, updateDoc, doc, limit } from 'firebase/firestore';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("🔔 [Webhook MP] Notificación recibida:", body);

        // Mercado Pago envía notificaciones de distintos tipos. 
        // Solo nos interesan las de tipo 'payment'.
        const { type, data, user_id: mpUserId } = body;

        if (type !== 'payment') {
            return NextResponse.json({ received: true }, { status: 200 });
        }

        const paymentId = data.id;
        if (!paymentId) {
            return NextResponse.json({ error: 'No payment ID provided' }, { status: 400 });
        }

        // 1. Buscamos el negocio asociado a este MP User ID
        const negociosRef = collection(db, 'negocios');
        const qNegocio = query(negociosRef, where('mercado_pago.user_id', '==', String(mpUserId)));
        const snapNegocio = await getDocs(qNegocio);

        if (snapNegocio.empty) {
            console.error(`❌ [Webhook MP] Negocio no encontrado para MP User ID: ${mpUserId}`);
            return NextResponse.json({ error: 'Business not found' }, { status: 404 });
        }

        const negocioDoc = snapNegocio.docs[0];
        const negocioData = negocioDoc.data();
        const accessToken = negocioData.mercado_pago?.access_token;

        if (!accessToken) {
            console.error(`❌ [Webhook MP] Access Token no configurado para negocio: ${negocioDoc.id}`);
            return NextResponse.json({ error: 'Access Token not configured' }, { status: 400 });
        }

        // 2. Buscamos el detalle del pago en Mercado Pago
        const client = new MercadoPagoConfig({ accessToken });
        const payment = new Payment(client);
        
        const paymentDetails: any = await payment.get({ id: paymentId });
        const status = paymentDetails.status;
        const preferenceId = paymentDetails.order?.id || paymentDetails.preference_id;
        const externalReference = paymentDetails.external_reference;

        console.log(`💳 [Webhook MP] Pago ${paymentId} procesado con estado: ${status}`);

        // 3. Bucamos la transacción/pedido original en Firestore
        // Buscamos por el ID de la preferencia o referencia externa
        const transaccionesRef = collection(db, 'transacciones');
        let qTransaccion = query(transaccionesRef, where('mercado_pago_id', '==', preferenceId), limit(1));
        let snapTransaccion = await getDocs(qTransaccion);

        // Si no lo encuentra por ID, probamos por external_reference
        if (snapTransaccion.empty && externalReference) {
            qTransaccion = query(transaccionesRef, where('metadata.external_reference', '==', externalReference), limit(1));
            snapTransaccion = await getDocs(qTransaccion);
        }

        if (snapTransaccion.empty) {
            console.warn(`⚠️ [Webhook MP] Pedido no encontrado para Pago ${paymentId}`);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const transDoc = snapTransaccion.docs[0];
        const transRef = doc(db, 'transacciones', transDoc.id);

        // 4. Actualizamos el estado del pago
        let nuevoEstado = 'pendiente';
        if (status === 'approved') nuevoEstado = 'pagado';
        else if (status === 'in_process') nuevoEstado = 'en proceso';
        else if (status === 'rejected') nuevoEstado = 'rechazado';
        else if (status === 'cancelled') nuevoEstado = 'cancelado';

        await updateDoc(transRef, {
            'metadata.estado_pago': nuevoEstado,
            'metadata.mercado_pago_status': status,
            'metadata.last_webhook_update': new Date().toISOString()
        });

        console.log(`✅ [Webhook MP] Pedido ${transDoc.id} actualizado a estado: ${nuevoEstado}`);

        return NextResponse.json({ updated: true }, { status: 200 });

    } catch (error: any) {
        console.error("🔥 [Webhook MP] Error fatal:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
