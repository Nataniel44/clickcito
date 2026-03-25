/**
 * Resuelve una URL de imagen para que sea absoluta.
 * Si la URL comienza con '/', se asume que es un path de MinIO (ej: /menu/foto.jpg)
 * y se concatena con el dominio de imágenes configurado.
 */
export const resolveImageUrl = (url: string | null | undefined): string => {
    if (!url) return "";

    // Si ya es una URL absoluta (http:// o https://), la devolvemos tal cual
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    // Si comienza con '/', asumimos que es un bucket de MinIO (ej: /menu/imagen.jpg)
    // También manejamos si no tiene el '/' inicial pero es un path (tiene el bucket al inicio)
    if (url.startsWith("/") || (!url.startsWith("data:") && url.includes("/"))) {
        const endpoint = "https://imagenes.elysrestobar.com";
        const path = url.startsWith("/") ? url : `/${url}`;
        return `${endpoint}${path}`;
    }

    // Si es un base64 o similar
    if (url.startsWith("data:")) {
        return url;
    }

    // Por defecto, devolvemos lo que venga (podría ser un path relativo de Next.js public/)
    return url;
};
