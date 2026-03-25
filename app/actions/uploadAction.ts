"use server";

import { subirArchivo } from "@/lib/minio";

export async function uploadLogoAction(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await subirArchivo(buffer, file.name, "logos", file.type);
    return url;
}

export async function uploadProductImageAction(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await subirArchivo(buffer, file.name, "productos", file.type);
    return url;
}

export async function uploadFileAction(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await subirArchivo(buffer, file.name, "recursos", file.type);
    return url;
}
