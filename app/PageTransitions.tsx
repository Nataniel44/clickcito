"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import GlobalLoading from "./loading";

export default function PageTransitions({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);

    // Detectar cuando cambia la ruta para quitar el loading y resetear scroll
    useEffect(() => {
        setIsNavigating(false);
        // Resetear scroll al inicio de la página inmediatamente al cambiar de ruta
        // Usamos requestAnimationFrame para asegurar que el scroll se ejecute después del renderizado
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
        });
    }, [pathname, searchParams]);

    // Interceptar clicks en enlaces para poner el loading ANTES de que Next inicie la transición
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            // Ignorar si el click fue con Ctrl, Cmd, Shift o click central
            if (e.ctrlKey || e.shiftKey || e.metaKey || e.button === 1) return;
            // Ignorar si el evento fue cancelado por otro listener
            if (e.defaultPrevented) return;

            const target = e.target as HTMLElement;
            const anchor = target.closest("a");

            if (anchor &&
                anchor instanceof HTMLAnchorElement &&
                anchor.href &&
                anchor.href.startsWith(window.location.origin) &&
                anchor.target !== "_blank" &&
                !anchor.hasAttribute('download')
            ) {
                // No mostrar loading si es un hash link en la misma página
                const url = new URL(anchor.href);
                const normalize = (p: string) => p.replace(/\/$/, "") || "/";
                const isSamePage = normalize(url.pathname) === normalize(window.location.pathname) && url.search === window.location.search;

                if (!isSamePage) {
                    setIsNavigating(true);
                    // Timeout de seguridad: si por alguna razón no cambia de página en 8s, quitar el loader
                    setTimeout(() => setIsNavigating(false), 8000);
                }
            }
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    return (
        <>
            {isNavigating && <GlobalLoading />}
            {children}
        </>
    );
}
