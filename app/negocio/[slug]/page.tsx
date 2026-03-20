import { getAllNegocios } from "@/app/firebase/db";
import NegocioClient from "./NegocioClient";

// Exportamos esto para asegurar que Next.js trate la página como estática
export const dynamic = "force-static";

export async function generateStaticParams() {
    try {
        console.log("Generating static params for negocios...");
        const negocios = await getAllNegocios();

        if (!negocios || negocios.length === 0) {
            console.warn("No negocios found in Firebase.");
            return [];
        }

        const params = negocios
            .filter(n => n && n.id)
            .map((n) => ({
                slug: String(n.id).trim(),
            }));

        console.log("Generated params:", params);
        return params;
    } catch (error) {
        console.error("Error generating static params for negocios:", error);
        return [];
    }
}

export default async function NegocioPage(props: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await props.params;
    const slug = params?.slug;

    if (!slug) return null;

    return <NegocioClient slug={slug} />;
}