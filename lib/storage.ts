import { uploadLogoAction, uploadProductImageAction } from "@/app/actions/uploadAction";

/**
 * Sube un archivo a Minio mediante Server Actions.
 * Esto evita problemas de CORS y centraliza la lógica en tu servidor.
 */
export async function uploadToFirebaseStorage(file: File, folder: string = "general"): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    try {
        if (folder === "logos" || folder === "logo") {
            return await uploadLogoAction(formData);
        } else {
            // Para productos, galería, etc.
            return await uploadProductImageAction(formData);
        }
    } catch (error) {
        console.error("Error uploading to Minio:", error);
        throw error;
    }
}
