import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// =======================================
// 🚫 Rate Limit en memoria (por IP)
// =======================================
const RATE_LIMIT = 5;          // Máximo de intentos permitidos
const WINDOW_MS = 10 * 60_000; // 10 minutos
const attempts = new Map<string, { count: number; firstAttempt: number }>();

function getClientIp(req: NextRequest): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || // Proxy / Vercel / Cloudflare
        req.headers.get("cf-connecting-ip") ||                       // Cloudflare
        req.headers.get("x-real-ip") ||                              // Nginx / proxy
        "unknown"
    );
}

function rateLimit(ip: string): boolean {
    const now = Date.now();
    const record = attempts.get(ip);

    if (!record) {
        attempts.set(ip, { count: 1, firstAttempt: now });
        return true;
    }

    const { count, firstAttempt } = record;

    // Si ya pasó la ventana, reinicia contador
    if (now - firstAttempt > WINDOW_MS) {
        attempts.set(ip, { count: 1, firstAttempt: now });
        return true;
    }

    // Bloquea si excede el límite
    if (count >= RATE_LIMIT) {
        return false;
    }

    // Incrementa intento
    attempts.set(ip, { count: count + 1, firstAttempt });
    return true;
}

// =======================================
// 🔐 Middleware principal
// =======================================
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Ignorar archivos internos de Next
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon.ico") ||
        req.nextUrl.searchParams.has("_rsc") ||
        req.headers.get("rsc") === "1"
    ) {
        return NextResponse.next();
    }

    // =======================================
    // 🧱 Rate Limit: /api/login
    // =======================================
    if (pathname.startsWith("/api/login")) {
        const ip = getClientIp(req);
        const allowed = rateLimit(ip);

        if (!allowed) {
            return new NextResponse(
                JSON.stringify({
                    error: "Demasiados intentos de login. Esperá unos minutos antes de reintentar.",
                }),
                {
                    status: 429,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    }

    // =======================================
    // 🧩 Rutas públicas
    // =======================================
    const publicApiPaths = [
        "/api/login",
        "/api/menu",
        "/api/orders",
        "/api/customers/orders",
        "/api/customers/stats",
    ];

    if (publicApiPaths.some((path) => pathname.startsWith(path))) {
        if (pathname.startsWith("/api/orders") && req.method === "POST") return NextResponse.next();
        if (pathname.match(/^\/api\/orders\/\d+$/) && req.method === "GET") return NextResponse.next();
        if (pathname.match(/^\/api\/orders\/\d+\/cancel$/) && req.method === "POST") return NextResponse.next();
        if (pathname.match(/^\/api\/orders\/\d+\/expire$/) && req.method === "POST") return NextResponse.next();
        if (pathname.startsWith("/api/menu")) return NextResponse.next();
        if (pathname.startsWith("/api/customers")) return NextResponse.next();
    }

    const publicPagePaths = ["/login", "/", "/menu"];
    if (publicPagePaths.some((path) => pathname === path || pathname.startsWith("/menu/"))) {
        return NextResponse.next();
    }

    // =======================================
    // 🔒 Rutas protegidas (requieren JWT)
    // =======================================
    const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
    const isModifyingApiRoute =
        pathname.startsWith("/api/") &&
        ["POST", "PUT", "PATCH", "DELETE"].includes(req.method || "");

    if (isAdminRoute || isModifyingApiRoute) {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ error: "No autorizado" }, { status: 401 });
            }
            return NextResponse.redirect(new URL("/login", req.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
        } catch (error) {
            console.error("Token inválido:", error);
            const response = pathname.startsWith("/api/")
                ? NextResponse.json({ error: "Token inválido" }, { status: 401 })
                : NextResponse.redirect(new URL("/login", req.url));
            response.cookies.delete("token");
            return response;
        }
    }

    return NextResponse.next();
}

// =======================================
// Config matcher
// =======================================
export const config = {
    matcher: [
        "/api/login",
        "/admin/:path*",
        "/api/admin/:path*",
        "/api/restaurants/:path*",
        "/api/products/:path*",
        "/api/categories/:path*",
        "/api/orders/:path*",
    ],
};
