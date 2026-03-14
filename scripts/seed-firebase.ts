import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// INSTRUCCIONES:
// 1. Ve a la Consola de Firebase -> Configuración del proyecto -> Cuentas de servicio
// 2. Haz clic en "Generar nueva clave privada" y descarga el archivo JSON.
// 3. Guarda ese archivo en la raíz de tu proyecto como "serviceAccountKey.json"
// 4. Ejecuta: npm run seed:firebase

const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ ERROR: No se encontró serviceAccountKey.json en la raíz del proyecto.');
    process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// =============================================
// DATOS DE NEGOCIOS
// =============================================
const NEGOCIOS = [
    {
        id: 'clickcito-demo',
        data: {
            nombre: 'Clickcito Burger',
            rubro: 'gastronomia',
            categoria_principal: 'gastronomia',
            descripcion: 'Las mejores hamburguesas smash de la zona. Delivery y takeaway.',
            ubicacion: 'Av. San Martín 450',
            activo: true,
            configuracion_logistica: { delivery_habilitado: true, takeaway_habilitado: true },
        },
        productos: [
            { nombre_producto: 'Hamburguesa Doble Smash', precio_base: 8500, detalles_especificos: { tipo: 'hamburguesa', lleva_cheddar: true, extras: 'Bacon, Cebolla Caramelizada' } },
            { nombre_producto: 'Papas con Cheddar & Bacon', precio_base: 5200, detalles_especificos: { tipo: 'acompañamiento', porcion: 'grande' } },
            { nombre_producto: 'Coca-Cola 500ml', precio_base: 2500, detalles_especificos: { tipo: 'bebida', tamaño: '500ml' } },
            { nombre_producto: 'Combo Smash + Papas + Bebida', precio_base: 14900, detalles_especificos: { tipo: 'combo', incluye: 'Hamburguesa Doble + Papas Cheddar + Coca 500ml' } },
        ]
    },
    {
        id: 'almacen-dona-rosa',
        data: {
            nombre: 'Almacén Doña Rosa',
            rubro: 'gastronomia',
            categoria_principal: 'gastronomia',
            descripcion: 'Cocina casera de la abuela. Empanadas, milanesas y postres artesanales.',
            ubicacion: 'Calle Belgrano 112',
            activo: true,
            configuracion_logistica: { delivery_habilitado: true, takeaway_habilitado: true },
        },
        productos: [
            { nombre_producto: 'Empanadas Caseras x12', precio_base: 12000, detalles_especificos: { tipo: 'comida casera', sabores: 'Carne, Pollo, JyQ', unidad: 'docena' } },
            { nombre_producto: 'Milanesa Napolitana c/ Fritas', precio_base: 9800, detalles_especificos: { tipo: 'plato principal', acompañamiento: 'papas fritas' } },
            { nombre_producto: 'Flan Casero c/ DDL', precio_base: 4500, detalles_especificos: { tipo: 'postre', artesanal: true } },
        ]
    },
    {
        id: 'maderera-san-vicente',
        data: {
            nombre: 'Maderera San Vicente',
            rubro: 'construccion',
            categoria_principal: 'materiales',
            descripcion: 'Maderas, tirantes, machimbre y materiales de construcción. Venta por metro.',
            ubicacion: 'Ruta 14 Km 8',
            activo: true,
            configuracion_logistica: { delivery_habilitado: true, takeaway_habilitado: false },
        },
        productos: [
            { nombre_producto: 'Tabla de Pino 1x4 (metro)', precio_base: 1200, detalles_especificos: { tipo: 'madera', unidad_medida: 'metros', venta_fraccionada: true } },
            { nombre_producto: 'Tirante 3x3 Eucalipto (metro)', precio_base: 3800, detalles_especificos: { tipo: 'madera', unidad_medida: 'metros', venta_fraccionada: true } },
            { nombre_producto: 'Machimbre Pino 1/2x4 (m²)', precio_base: 8500, detalles_especificos: { tipo: 'revestimiento', unidad_medida: 'm²', venta_fraccionada: true } },
            { nombre_producto: 'Bolsa de Cemite x50kg', precio_base: 9200, detalles_especificos: { tipo: 'construcción', unidad_medida: 'bolsa', venta_fraccionada: false } },
        ]
    },
    {
        id: 'estilo-urbano',
        data: {
            nombre: 'Estilo Urbano',
            rubro: 'retail',
            categoria_principal: 'moda',
            descripcion: 'Ropa urbana de calidad. Remeras, jeans y camperas de temporada.',
            ubicacion: 'Galería Central, Local 7',
            activo: true,
            configuracion_logistica: { delivery_habilitado: false, takeaway_habilitado: true },
        },
        productos: [
            { nombre_producto: 'Remera Oversize Algodón', precio_base: 18500, detalles_especificos: { tipo: 'remera', talles: 'S, M, L, XL', colores: 'Negro, Blanco, Gris' } },
            { nombre_producto: 'Jean Mom Tiro Alto', precio_base: 35000, detalles_especificos: { tipo: 'pantalón', talles: '36, 38, 40, 42', color: 'Celeste Nevado' } },
            { nombre_producto: 'Campera Puffer Unisex', precio_base: 65000, detalles_especificos: { tipo: 'abrigo', talles: 'M, L, XL', colores: 'Negro, Verde Militar' } },
        ]
    },
    {
        id: 'barber-club',
        data: {
            nombre: 'Barber Club SV',
            rubro: 'servicios',
            categoria_principal: 'barbería',
            descripcion: 'Barbería de autor. Cortes clásicos y modernos, barba y tratamientos.',
            ubicacion: 'Av. Libertad 320',
            activo: true,
            configuracion_logistica: { delivery_habilitado: false, takeaway_habilitado: true },
        },
        productos: [
            { nombre_producto: 'Corte Clásico', precio_base: 8000, detalles_especificos: { tipo: 'servicio', duracion: '30 min', incluye: 'Lavado + Secado' } },
            { nombre_producto: 'Perfilado de Barba', precio_base: 5000, detalles_especificos: { tipo: 'servicio', duracion: '20 min', incluye: 'Toalla caliente' } },
            { nombre_producto: 'Combo Corte + Barba', precio_base: 11000, detalles_especificos: { tipo: 'combo', duracion: '50 min', ahorro: '$2000' } },
        ]
    },
];

// =============================================
// SEED FUNCTION
// =============================================
async function seed() {
    console.log('🌱 Iniciando seed multi-rubro en Firestore...\n');

    try {
        const productosRef = db.collection('productos_catalogo');

        for (const negocio of NEGOCIOS) {
            // Crear o actualizar negocio (merge para no perder data existente)
            await db.collection('negocios').doc(negocio.id).set({
                ...negocio.data,
                createdAt: FieldValue.serverTimestamp()
            }, { merge: true });
            console.log(`✅ Negocio: ${negocio.data.nombre} (${negocio.id})`);

            // Crear productos
            for (const prod of negocio.productos) {
                await productosRef.add({
                    id_negocio: negocio.id,
                    ...prod,
                    createdAt: FieldValue.serverTimestamp()
                });
            }
            console.log(`   └─ ${negocio.productos.length} productos creados`);
        }

        // Usuario Admin (mantener el existente)
        const uidAdmin = 'kJ6ggcjdaYdCqH4y6gW2XlYc0rz2';
        await db.collection('usuarios').doc(uidAdmin).set({
            nombre: 'Dev Admin',
            email: 'admin@clickcito.com',
            rol: 'admin_clickcito',
            id_negocio: 'clickcito-demo',
            createdAt: FieldValue.serverTimestamp()
        }, { merge: true });
        console.log(`\n✅ Usuario Admin vinculado`);

        console.log('\n🎉 Seed multi-rubro completado con éxito!');
    } catch (error) {
        console.error('❌ Error durante el seed:', error);
    } finally {
        process.exit(0);
    }
}

seed();
