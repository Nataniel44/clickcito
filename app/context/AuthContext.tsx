"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";

// Tipo del usuario extendido con la info de la BD
export interface UserProfile {
    uid: string;
    email: string | null;
    nombre?: string;
    rol?: "cliente_final" | "dueño_negocio" | "admin_clickcito";
    id_negocio?: string; // Sólo si es dueño
}

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Al detectar sesión en Auth, consultamos también la colección /usuarios de Firestore
                try {
                    const userDocRef = doc(db, "usuarios", firebaseUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    let dbData = {};
                    if (userDocSnap.exists()) {
                        dbData = userDocSnap.data();
                    }

                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        ...dbData,
                    });
                } catch (error) {
                    console.error("Error obteniendo los datos del usuario de Firestore:", error);
                    setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook para usar la app de una manera más limpia: const { user, loading } = useAuth();
export const useAuth = () => useContext(AuthContext);
