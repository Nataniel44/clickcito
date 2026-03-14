"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, MessageCircle, Instagram, Mail, ShoppingBag, ArrowUpRight, Heart } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // No mostrar footer en el dashboard
  if (pathname?.includes("/dashboard")) return null;

  return (
    <footer id="contacto" className="relative bg-gray-950 text-white overflow-hidden">
      {/* Glow decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-[100px]" />

      {/* CTA Banner */}
      <div className="relative z-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
              ¿Tenés un negocio en <span className="text-orange-500">Misiones</span>?
            </h3>
            <p className="text-gray-400 font-medium text-sm md:text-base max-w-lg">
              Sumá tu comercio a Clickcito y empezá a vender online hoy. Sin comisiones ocultas.
            </p>
          </div>
          <a
            href="https://wa.me/5493755000000?text=Quiero sumar mi negocio a Clickcito"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl shadow-lg shadow-orange-600/20 transition-all hover:scale-105 active:scale-95"
          >
            Quiero Sumarme <ArrowUpRight size={18} />
          </a>
        </div>
      </div>

      {/* Main Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-orange-600 p-2 rounded-xl">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter">
                CLICK<span className="text-orange-500">CITO</span>
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-xs">
              El sistema operativo para los negocios locales de Misiones. Digitalizá tu comercio sin importar el rubro.
            </p>
          </div>

          {/* Plataforma */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-600 mb-5">Plataforma</h4>
            <ul className="space-y-3">
              {[
                { label: "Explorar Negocios", href: "/explorar" },
                { label: "Gastronomía", href: "/explorar" },
                { label: "Retail & Moda", href: "/explorar" },
                { label: "Servicios", href: "/explorar" },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-white font-medium transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-600 mb-5">Empresa</h4>
            <ul className="space-y-3">
              {[
                { label: "Iniciar Sesión", href: "/login" },
                { label: "Mi Dashboard", href: "/dashboard" },
                { label: "Precios", href: "#precios" },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-white font-medium transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-600 mb-5">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://wa.me/5493755000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-green-400 font-medium transition-colors group">
                  <MessageCircle size={15} className="text-green-500/60 group-hover:text-green-400" /> WhatsApp
                </a>
              </li>
              <li>
                <a href="https://instagram.com/nata.st44" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-pink-400 font-medium transition-colors group">
                  <Instagram size={15} className="text-pink-500/60 group-hover:text-pink-400" /> @nata.st44
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-500 font-medium">
                <MapPin size={15} className="text-gray-600" /> San Vicente, Misiones
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + Bottom */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600 font-bold">
            © {new Date().getFullYear()} Clickcito. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-600 font-medium flex items-center gap-1.5">
            Hecho con <Heart size={12} className="text-red-500 fill-red-500" /> en Misiones, Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
