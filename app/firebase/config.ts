import { initializeApp, getApps, getApp } from "firebase/app";
import {
    getFirestore,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Evitamos que Next.js inicialice Firebase App múltiples veces 
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializamos Firestore con persistencia solo en el cliente para evitar bloqueos en el servidor (SSR)
let db: any;
if (typeof window !== "undefined") {
    try {
        db = initializeFirestore(app, {
            localCache: persistentLocalCache({
                tabManager: persistentMultipleTabManager()
            })
        });
    } catch (e) {
        // Fallback si ya fue inicializado (HMR o múltiples imports en cliente)
        db = getFirestore(app);
    }
} else {
    // En el servidor usamos la configuración estándar (vía memoria)
    db = getFirestore(app);
}

const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
