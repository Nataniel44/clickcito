"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

// Tipo del usuario extendido con la info de la BD
export interface UserProfile {
    uid: string;
    email: string | null;
    nombre?: string;
    nombre_negocio?: string;
    rol?: "cliente_final" | "dueño_negocio" | "admin_clickcito" | "admin";
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
        let unsubscribeDoc: (() => void) | undefined;

        const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "usuarios", firebaseUser.uid);
                // Usamos onSnapshot para que el perfil de usuario sea en tiempo real (nombre, rol, id_negocio)
                unsubscribeDoc = onSnapshot(userDocRef, (snap) => {
                    if (snap.exists()) {
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            ...snap.data(),
                        } as any);
                    } else {
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                        } as any);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error in user doc snapshot:", error);
                    setUser({ uid: firebaseUser.uid, email: firebaseUser.email } as any);
                    setLoading(false);
                });
            } else {
                if (unsubscribeDoc) {
                    unsubscribeDoc();
                    unsubscribeDoc = undefined;
                }
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            if (unsubscribeDoc) {
                unsubscribeDoc();
            }
            unsubscribeAuth();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook para usar la app de una manera más limpia: const { user, loading } = useAuth();
export const useAuth = () => useContext(AuthContext);
