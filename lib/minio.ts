import * as Minio from 'minio'

if (process.env.NODE_ENV === 'development' || true) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export const minio = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'imagenes.elysrestobar.com',
    port: Number(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true' || false,
    accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
    secretKey: process.env.MINIO_SECRET_KEY || 'tupassword123',
})

export async function subirArchivo(buffer: Buffer, nombre: string, carpeta = 'logos', contentType = 'application/octet-stream') {
    const bucket = 'negocios';
    const key = `${carpeta}/${Date.now()}-${nombre}`

    try {
        await minio.putObject(bucket, key, buffer, buffer.length, {
            'Content-Type': contentType,
        })
        return `https://imagenes.elysrestobar.com/${bucket}/${key}`
    } catch (err: any) {
        console.error("Error TYPE:", typeof err);
        console.error("Error msg:", err.message);
        console.error("Error full:", err);
        throw err;
    }
}
