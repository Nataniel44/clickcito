"use server";

import { subirImagen } from "@/lib/minio";

export async function uploadLogoAction(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await subirImagen(buffer, file.name, "logos");
    return url;
}

export async function uploadProductImageAction(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await subirImagen(buffer, file.name, "productos");
    return url;
}
