import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ ERROR: No se encontró serviceAccountKey.json en la raíz del proyecto.');
    process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

try {
    initializeApp({ credential: cert(serviceAccount) });
} catch (error) {
    if (!/already exists/.test((error as any).message)) {
        console.error('Firebase initialization error', error);
    }
}

const db = getFirestore();

const NUEVOS_NEGOCIOS = [
    {
        id: 'almacen-dona-rosa',
        data: {
            nombre: 'Almacén Doña Rosa',
            rubro: 'gastronomia',
            categoria_principal: 'gastronomia',
            descripcion: 'Cocina casera de la abuela. Empanadas, milanesas y postres artesanales.',
            ubicacion: 'Calle Belgrano 112',
            telefono: "5491143211234",
            activo: true,
            createdAt: FieldValue.serverTimestamp(),
            rating: { promedio: 4.8, total_resenas: 32, distribucion: [80, 15, 3, 2, 0] },
            horarios: { lunes: "Cerrado", martes: "Cerrado", miercoles: "Cerrado", jueves: "09:00 - 23:00", viernes: "09:00 - 23:00", sabado: "10:00 - 01:00", domingo: "11:00 - 22:00" },
            fotos: ["🍕", "🍝", "🥙", "🥗", "🍔"],
            configuracion_logistica: { delivery_habilitado: true, takeaway_habilitado: true, precio_delivery: 500, delivery_gratis_desde: 5000, tiempo_aprox_delivery: "30-45 min", direccion_retiro_local: "Calle Belgrano 112, Listo en 15m" },
            categorias: ["Comida Casera", "Empanadas", "Postres"]
        },
        productos: [
            { nombre_producto: 'Empanadas Caseras x12', precio_base: 12000, descripcion: 'Docena completa con sabores a elección.', categorias: ["Casero", "Para compartir", "Más pedido"], detalles_especificos: { tipo: 'comida casera', sabores: 'Carne, Pollo, JyQ', unidad: 'docena' } },
            { nombre_producto: 'Milanesa Napolitana c/ Fritas', precio_base: 9800, descripcion: 'Milanesa gigante para dos personas con papas fritas.', categorias: ["Carne", "Plato principal", "Fritas"], detalles_especificos: { tipo: 'plato principal', acompañamiento: 'papas fritas' } },
        ]
    },
    {
        id: 'estilo-urbano',
        data: {
            nombre: 'Estilo Urbano',
            rubro: 'retail',
            categoria_principal: 'moda',
            descripcion: 'Ropa urbana de calidad. Remeras oversize, jeans y camperas de temporada con envíos a todo el país.',
            ubicacion: 'Galería Central, Local 7',
            telefono: "5491145678901",
            activo: true,
            createdAt: FieldValue.serverTimestamp(),
            rating: { promedio: 4.5, total_resenas: 124, distribucion: [70, 20, 5, 5, 0] },
            horarios: { lunes: "10:00 - 20:00", martes: "10:00 - 20:00", miercoles: "10:00 - 20:00", jueves: "10:00 - 20:00", viernes: "10:00 - 20:00", sabado: "10:00 - 14:00", domingo: "Cerrado" },
            fotos: ["👕", "👖", "🧢", "👟", "🧥"],
            configuracion_logistica: { delivery_habilitado: false, takeaway_habilitado: true, direccion_retiro_local: "Galería Central Local 7, de 10 a 20hs" },
            categorias: ["Oversize", "Streetwear", "Zapatillas"]
        },
        productos: [
            { nombre_producto: 'Remera Oversize Algodón', precio_base: 18500, descripcion: 'Algodón premium peinado. Unisex.', categorias: ["Remeras", "Oversize", "Verano"], detalles_especificos: { talles: 'S, M, L, XL', colores: 'Negro, Blanco, Gris' } },
            { nombre_producto: 'Campera Puffer Unisex', precio_base: 65000, descripcion: 'Abrigada e impermeable. Especial para invierno.', categorias: ["Abrigo", "Invierno"], detalles_especificos: { talles: 'M, L, XL', colores: 'Negro, Verde Militar' } },
        ]
    },
    {
        id: 'barber-club',
        data: {
            nombre: 'Barber Club SV',
            rubro: 'servicios',
            categoria_principal: 'barbería',
            descripcion: 'Barbería de autor contemporánea. Cortes clásicos, perfilado de barba y sala de espera con pool y barra.',
            ubicacion: 'Av. Libertad 320',
            telefono: "5491122334455",
            activo: true,
            createdAt: FieldValue.serverTimestamp(),
            rating: { promedio: 5.0, total_resenas: 8, distribucion: [100, 0, 0, 0, 0] },
            horarios: { lunes: "Cerrado", martes: "12:00 - 21:00", miercoles: "12:00 - 21:00", jueves: "12:00 - 21:00", viernes: "10:00 - 22:00", sabado: "10:00 - 22:00", domingo: "Cerrado" },
            fotos: ["✂️", "💈", "💇", "🔥"],
            configuracion_logistica: { delivery_habilitado: false, takeaway_habilitado: false },
            categorias: ["Barbería", "Estilo", "Cuidado Personal"]
        },
        productos: [
            { nombre_producto: 'Corte Clásico o Degradado', precio_base: 8000, descripcion: 'Servicio premium de corte incluyendo lavado, secado y peinado final.', categorias: ["Corte", "Premium"], detalles_especificos: { duracion: '30 min' } },
            { nombre_producto: 'Combo Corte + Barba', precio_base: 11000, descripcion: 'Corte completo y perfilado de barba con toalla caliente.', categorias: ["Combos", "Promo"], detalles_especificos: { duracion: '50 min', ahorro: '$2000' } },
        ]
    }
];

async function seedMejoras() {
    console.log('🌱 Iniciando actualización estructurada de negocios para Explorar...\n');

    try {
        const productosRef = db.collection('productos_catalogo');

        for (const negocio of NUEVOS_NEGOCIOS) {
            await db.collection('negocios').doc(negocio.id).set({
                ...negocio.data,
            }, { merge: true });

            console.log(`✅ Negocio actualizado: ${negocio.data.nombre} (${negocio.id})`);

            // Borrar productos anteriores
            const oldProds = await productosRef.where('id_negocio', '==', negocio.id).get();
            const batch = db.batch();
            oldProds.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();

            // Insertamos los nuevos
            for (const prod of negocio.productos) {
                await productosRef.add({
                    id_negocio: negocio.id,
                    ...prod,
                    createdAt: FieldValue.serverTimestamp()
                });
            }
            console.log(`   └─ ${negocio.productos.length} productos recreados.`);
        }

        console.log('\n🎉 ¡Seed con mejoras completado con éxito!');
    } catch (error) {
        console.error('❌ Error durante el seed:', error);
    } finally {
        process.exit(0);
    }
}

seedMejoras();
