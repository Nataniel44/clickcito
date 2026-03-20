import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Tipamos el objeto de configuración por buenas prácticas
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Evitamos que Next.js inicialice Firebase App múltiples veces 
// en modo desarrollo debido al Fast Refresh (HMR).
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializamos Firestore
// Opcionalmente se puede habilitar offline persistence aquí después si es requerido.
const db = getFirestore(app);

// Inicializamos Authentication
const auth = getAuth(app);

// Inicializamos Storage
const storage = getStorage(app);

export { app, db, auth, storage };
