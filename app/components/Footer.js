"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, MessageCircle, Instagram, Mail, ShoppingBag, ArrowUpRight, Heart, QrCode, Smartphone, Palette, Users } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.includes("/dashboard") || pathname?.includes("/checkout") || pathname?.includes("/negocio")) return null;

  const services = [
    { icon: QrCode, label: "Cartas Digitales", desc: "Menús QR y web dinámicos" },
    { icon: Smartphone, label: "Apps Personalizadas", desc: "Pedidos y reservas" },
    { icon: Palette, label: "Diseño Publicitario", desc: "Flyers y redes sociales" },
  ];

  const links = {
    plataforma: [
      { label: "Explorar Negocios", href: "/explorar" },
      { label: "Gastronomía", href: "/explorar?cat=gastronomia" },
      { label: "Minimercados", href: "/explorar?cat=minimercados" },
      { label: "Servicios", href: "/explorar?cat=servicios" },
    ],
    empresa: [
      { label: "Iniciar Sesión", href: "/login" },
      { label: "Registrar Negocio", href: "/login" },
      { label: "Soporte", href: "https://wa.me/549375522344" },
    ],
  };

  return (
    <footer id="contacto" className="bg-black text-white py-16 lg:py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2.5 rounded-xl">
                <ShoppingBag size={20} className="text-black" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                CLICKCITO
              </span>
            </div>

            <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-sm">
              El sistema operativo para negocios locales en Misiones.
              Sin comisiones, sin contratos, sin letra chica.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/login" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-200 text-black text-sm font-bold rounded-xl transition-colors">
                Empezar Gratis <ArrowUpRight size={16} />
              </Link>
              <a href="https://wa.me/549375522344" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent border border-white/20 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-colors">
                <MessageCircle size={16} /> Soporte
              </a>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <a href="https://instagram.com/nata.st44" target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:bg-white/10 rounded-lg transition-colors group">
                <Instagram size={18} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="https://wa.me/549375522344" target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:bg-white/10 rounded-lg transition-colors group">
                <MessageCircle size={18} className="text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 lg:pl-12">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Plataforma</h4>
              <ul className="space-y-4">
                {links.plataforma.map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-gray-400 hover:text-white font-medium transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Empresa</h4>
              <ul className="space-y-4">
                {links.empresa.map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-gray-400 hover:text-white font-medium transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Ubicación</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-gray-400 font-medium">
                  <MapPin size={18} className="text-white shrink-0" />
                  <span>San Vicente<br />Misiones, Argentina</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-medium text-center md:text-left">
            © {new Date().getFullYear()} Clickcito. Todos los derechos reservados.
          </p>
          <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
            Hecho con <Heart size={14} className="text-white" /> en Misiones
          </p>
        </div>
      </div>
    </footer>
  );
}
