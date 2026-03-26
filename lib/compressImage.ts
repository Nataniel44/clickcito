/**
 * Comprime una imagen en el cliente usando Canvas antes de subirla
 * @param file El archivo original (File)
 * @param maxWidth Ancho máximo (por defecto 1200px)
 * @param quality Calidad (0 a 1)
 * @returns Un nuevo File comprimido o el original si no se pudo comprimir
 */
export async function compressImage(
    file: File,
    maxWidth: number = 1000,
    quality: number = 0.75
): Promise<File> {
    // Solo comprimimos si es una imagen
    if (!file.type.startsWith('image/')) return file;

    // Y solo si es un tipo compresible (evitamos gif animados por ejemplo)
    if (file.type === 'image/gif') return file;

    // Si el archivo ya es pequeño (< 500KB), no nos arriesgamos a perder calidad
    if (file.size < 500 * 1024 && !file.type.includes('tiff')) {
        return file;
    }

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculamos redimensionado proporcional
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(file);

                // Limpiar canvas para transparencia si es necesario
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);

                // Determinamos el formato de salida
                // Si el original tiene transparencia (PNG) y no es gigante, mantenemos PNG
                const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

                // Convertimos el canvas a un Blob/File
                canvas.toBlob(
                    (blob) => {
                        if (!blob) return resolve(file);

                        // Creamos un nuevo archivo con el mismo nombre pero comprimido
                        const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + (outputType === 'image/png' ? '.png' : '.jpg'), {
                            type: outputType,
                            lastModified: Date.now(),
                        });

                        // Si por algún motivo el "comprimido" pesa más que el original, enviamos el original
                        if (compressedFile.size > file.size) {
                            return resolve(file);
                        }

                        resolve(compressedFile);
                    },
                    outputType,
                    outputType === 'image/jpeg' ? quality : undefined
                );
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
}
