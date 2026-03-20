import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    writeBatch,
    query,
    where,
    addDoc,
    serverTimestamp,
    QueryConstraint
} from "firebase/firestore";
import { db } from "./config";

// COLECCIONES PRINCIPALES
const NEGOCIOS_COL = "negocios";
const PRODUCTOS_COL = "productos_catalogo";
const USUARIOS_COL = "usuarios";
const TRANSACCIONES_COL = "transacciones";

// ============================================
// SERVICIOS: NEGOCIOS
// ============================================

export async function getNegocioById(idNegocio: string) {
    const docRef = doc(db, NEGOCIOS_COL, idNegocio);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
}

export async function getAllNegocios() {
    const snapshot = await getDocs(collection(db, NEGOCIOS_COL));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function createNegocio(idNegocio: string, data: any) {
    const docRef = doc(db, NEGOCIOS_COL, idNegocio);
    await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateNegocio(idNegocio: string, data: any) {
    const docRef = doc(db, NEGOCIOS_COL, idNegocio);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

// ============================================
// SERVICIOS: PRODUCTOS (MULTI-TENANT / RUBRO DINÁMICO)
// ============================================

export async function getProductosByNegocio(idNegocio: string) {
    const q = query(
        collection(db, PRODUCTOS_COL),
        where("id_negocio", "==", idNegocio)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id_producto: doc.id, ...doc.data() }));
}

// data contiene campos obligatorios + detalles_especificos (objeto dinámico según rubro)
export async function createProducto(idNegocio: string, data: any) {
    const productosRef = collection(db, PRODUCTOS_COL);
    const docRef = await addDoc(productosRef, {
        ...data,
        id_negocio: idNegocio, // Mantenemos el aislamiento de tenant
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateProducto(idProducto: string, data: any) {
    const docRef = doc(db, PRODUCTOS_COL, idProducto);
    // Al actualizar no se debería permitir cambiar el id_negocio sin reglas severas
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteProducto(idProducto: string) {
    await deleteDoc(doc(db, PRODUCTOS_COL, idProducto));
}

// ============================================
// SERVICIOS: USUARIOS 
// ============================================

// El rol debe ser gestionado al crear el perfil
// roles posibles: 'cliente_final', 'dueño_negocio', 'admin_clickcito'
export async function createUserProfile(uid: string, email: string, nombre: string, rol: string) {
    const userRef = doc(db, USUARIOS_COL, uid);
    await setDoc(userRef, {
        email,
        nombre,
        rol,
        createdAt: serverTimestamp(),
    }, { merge: true }); // Merge asegura que si se loguea de nuevo no sobreescriba su data
}

export async function getUserProfile(uid: string) {
    const docSnap = await getDoc(doc(db, USUARIOS_COL, uid));
    return docSnap.exists() ? docSnap.data() : null;
}

export async function getAllUsuariosByRol(rol: string) {
    const q = query(collection(db, USUARIOS_COL), where("rol", "==", rol));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ uid: d.id, ...d.data() }));
}

export async function updateUsuario(uid: string, data: any) {
    const userRef = doc(db, USUARIOS_COL, uid);
    await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
    });
}

// ============================================
// SERVICIOS: TRANSACCIONES (MULTI-TENANT)
// ============================================

export async function createTransaccion(idNegocio: string, uidCliente: string, items: any[], metadataList: any) {
    const transaccionesRef = collection(db, TRANSACCIONES_COL);
    const docRef = await addDoc(transaccionesRef, {
        id_usuario: uidCliente,
        id_negocio: idNegocio,
        tipo_transaccion: "pedido_compra",
        estado: "pendiente",
        items: items,
        datos_logistica: metadataList,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function getTransaccionesByNegocio(idNegocio: string, extraFilters: QueryConstraint[] = []) {
    const q = query(
        collection(db, TRANSACCIONES_COL),
        where("id_negocio", "==", idNegocio),
        ...extraFilters // ej. where('estado', '==', 'pendiente')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id_transaccion: doc.id, ...doc.data() }));
}

export async function getTransaccionesByCliente(uidCliente: string) {
    const q = query(
        collection(db, TRANSACCIONES_COL),
        where("id_usuario", "==", uidCliente)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id_transaccion: doc.id, ...doc.data() }));
}

export async function updateEstadoTransaccion(idTransaccion: string, nuevoEstado: string) {
    const docRef = doc(db, TRANSACCIONES_COL, idTransaccion);
    await updateDoc(docRef, {
        estado: nuevoEstado,
        updatedAt: serverTimestamp()
    });
}

export async function deleteTransaccion(idTransaccion: string) {
    const docRef = doc(db, TRANSACCIONES_COL, idTransaccion);
    await deleteDoc(docRef);
}

export async function deleteTransaccionesBatch(ids: string[]) {
    const batch = writeBatch(db);
    ids.forEach(id => {
        batch.delete(doc(db, TRANSACCIONES_COL, id));
    });
    await batch.commit();
}

// ============================================
// SERVICIOS: LOGS DE ACTIVIDAD
// ============================================
const LOGS_COL = "actividad_logs";

export async function createActivityLog(idNegocio: string, data: {
    usuario_email: string;
    accion: string;
    detalles: string;
}) {
    const logsRef = collection(db, LOGS_COL);
    await addDoc(logsRef, {
        ...data,
        id_negocio: idNegocio,
        createdAt: serverTimestamp(),
    });
}

export async function getActivityLogs(idNegocio: string) {
    const q = query(collection(db, LOGS_COL), where("id_negocio", "==", idNegocio));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
