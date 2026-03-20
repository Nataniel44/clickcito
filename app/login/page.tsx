"use client";

import { useState } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                // INICIAR SESIÓN
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("¡Bienvenido/a de nuevo!");
                router.push("/");
            } else {
                // REGISTRO
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Crear documento del usuario en Firestore
                await setDoc(doc(db, "usuarios", user.uid), {
                    nombre: name || email.split("@")[0],
                    email: user.email,
                    rol: "cliente_final", // Por defecto los nuevos registros son clientes
                    createdAt: serverTimestamp()
                });

                toast.success("¡Cuenta creada exitosamente!");
                router.push("/");
            }
        } catch (error: any) {
            toast.error(error.message || "Ocurrió un error en la autenticación.");
        } finally {
            setLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);

            await setDoc(doc(db, "usuarios", result.user.uid), {
                nombre: result.user.displayName,
                email: result.user.email,
                // Usamos merge: true para no sobreescribir el rol si ya existe
            }, { merge: true });

            toast.success("¡Sesión iniciada con Google!");
            router.push("/");
        } catch (error: any) {
            toast.error(error.message || "Error al conectar con Google.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden p-4 sm:p-6 lg:p-8">
            {/* Elementos fijos de fondo para estética */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-600/10 dark:bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-white/20 dark:border-zinc-800 relative z-10 transition-all duration-300">

                <div className="text-center mb-8">
                    {/* Logo/Icono */}
                    <div className="flex justify-center mb-5">

                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                        {isLogin ? "Hola de nuevo 👋" : "Únete a Clickcito 🚀"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium font-body">
                        {isLogin ? "Ingresa a tu cuenta para continuar" : "Crea tu cuenta y empieza a gestionar"}
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleEmailAuth}>
                    {!isLogin && (
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300"
                                placeholder="Nombre completo"
                            />
                        </div>
                    )}

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300"
                            placeholder="Correo electrónico"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300"
                            placeholder="Contraseña"
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Procesando...
                            </span>
                        ) : (
                            <>
                                {isLogin ? "Ingresar a mi cuenta" : "Crear mi cuenta"}
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-zinc-800/80" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-gray-500 dark:text-gray-400 font-medium rounded-full border border-gray-100 dark:border-zinc-800">
                                O continúa con
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={signInWithGoogle}
                            disabled={loading}
                            className="group w-full flex justify-center items-center py-3.5 px-4 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm bg-white dark:bg-zinc-900/50 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-all duration-300 disabled:opacity-50"
                        >
                            <svg className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continuar con Google
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-bold text-orange-600 dark:text-orange-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300"
                    >
                        {isLogin ? "Regístrate gratis" : "Inicia sesión"}
                    </button>
                </p>

            </div>
        </div>
    );
}
