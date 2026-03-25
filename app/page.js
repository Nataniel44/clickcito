"use client";

import Link from "next/link";
import {
  Rocket,
  Store,
  ArrowRight,
  Search,
  Users,
  Sparkles,
  CheckCircle2,
  ShoppingBag,
  Clock,
  MessageCircle,
  Zap,
  LayoutDashboard
} from "lucide-react";
import Footer from "./components/Footer";
import { useAuth } from "@/app/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const isOwnerOrAdmin = user?.rol === "dueño_negocio" || user?.rol === "admin_clickcito" || user?.rol === "admin";

  const primaryBtn = !user ? {
    href: "/login",
    icon: <Rocket size={20} />,
    text: "Empezar Gratis"
  } : isOwnerOrAdmin ? {
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
    text: "Ir a mi Panel"
  } : {
    href: "/mis-pedidos",
    icon: <ShoppingBag size={20} />,
    text: "Mis Pedidos"
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0A] overflow-x-hidden selection:bg-orange-100 selection:text-orange-600">

      {/* ═══════════════════════════════════════════ */}
      {/* HERO: DIRECT & PUNCHY */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[-5%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">


          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tight leading-[0.85] mb-10">
            Tu tienda.<br />
            <span className="bg-gradient-to-r from-orange-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Sin límites.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Clickcito es la forma más rápida de vender online.
            <span className="text-gray-900 dark:text-white font-bold"> Gastronomía, Minimercados, Tiendas o Servicios</span> — creá tu catálogo y empezá hoy mismo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={primaryBtn.href} className="group relative w-full sm:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
              <div className="relative flex items-center justify-center gap-3 px-10 py-5 bg-orange-600 text-white font-black text-lg rounded-2xl shadow-xl transition-all hover:scale-[1.03] active:scale-95">
                {primaryBtn.icon} {primaryBtn.text}
              </div>
            </Link>
            <Link href="/explorar" className="flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-zinc-900 border-2 border-gray-100 dark:border-zinc-800 text-gray-900 dark:text-white font-black text-lg rounded-2xl hover:border-indigo-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all w-full sm:w-auto active:scale-95">
              <Search size={20} /> Explorar Tiendas
            </Link>
            {!user && (
              <section className="flex items-center gap-2">
                <p className="text-gray-500 dark:text-zinc-400 font-medium">O también puedes </p>
                <Link className="font-bold" href="/login">Iniciar sesión</Link>
              </section>
            )}
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <div className="flex items-center gap-2 font-black text-sm text-gray-400 lowercase italic tracking-tighter">
              <CheckCircle2 size={16} className="text-orange-500" /> 0% Comisiones
            </div>
            <div className="flex items-center gap-2 font-black text-sm text-gray-400 lowercase italic tracking-tighter">
              <CheckCircle2 size={16} className="text-orange-500" /> WhatsApp Directo
            </div>
            <div className="flex items-center gap-2 font-black text-sm text-gray-400 lowercase italic tracking-tighter">
              <CheckCircle2 size={16} className="text-orange-500" /> Setup en 5min
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* EXPLORE COMMUNITY: THE BRIDGE */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#F8F9FF] dark:bg-zinc-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 rounded-[3rem] p-10 md:p-20 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-50 border border-white/20">
                  <Sparkles size={12} className="text-yellow-300 fill-yellow-300" /> Ecosistema Clickcito
                </span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                  Unite a la red de <br />
                  <span className="text-yellow-300">negocios locales.</span>
                </h2>
                <p className="text-indigo-50 font-medium text-lg leading-relaxed opacity-90 max-w-lg">
                  No estás solo. Inspirate con otros catálogos, conectá con clientes reales y descubrí por qué cientos de negocios eligen Clickcito para crecer.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Link href="/explorar" className="flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl group/btn">
                    Ver Comunidad <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <div className="flex items-center gap-3 p-1 px-4 bg-black/10 backdrop-blur-sm rounded-2xl border border-white/10">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-500 bg-indigo-100 flex items-center justify-center text-indigo-600"><Store size={14} /></div>
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-50">+150 Comercios</span>
                  </div>
                </div>
              </div>

              <div className="relative hidden lg:flex items-center justify-center">
                <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl animate-pulse" />
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: ShoppingBag, color: "bg-orange-500", label: "Menú" },
                    { icon: MessageCircle, color: "bg-green-500", label: "💬" },
                    { icon: Users, color: "bg-blue-500", label: "CRM" },
                    { icon: Zap, color: "bg-yellow-500", label: "Live" },
                  ].map((item, i) => (
                    <div key={i} className={`p-8 ${item.color} rounded-[2rem] shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-500 ${i % 2 !== 0 ? 'translate-y-8' : ''}`}>
                      <item.icon size={40} className="text-white" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* CASE STUDY: SOCIAL PROOF */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white dark:bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">El éxito habla por sí solo.</h2>
            <p className="text-gray-500 font-medium">Historias reales de emprendedores misioneros.</p>
          </div>

          <div className="bg-zinc-950 rounded-[3rem] p-8 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shrink-0">T</div>
                <h3 className="text-4xl md:text-5xl font-black text-white leading-[0.9] italic tracking-tight">
                  &quot;Pasamos de anotar en papeles a vender 3 veces más.&quot;
                </h3>
                <div className="space-y-1">
                  <p className="text-white font-bold text-xl">Top One Burgers</p>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">San Vicente, Misiones</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Ventas", value: "300%", sub: "Incremento" },
                  { label: "Tiempo", value: "-90%", sub: "Ahorro" },
                  { label: "Errores", value: "0%", sub: "Eliminados" },
                  { label: "Feedback", value: "4.9★", sub: "Estrellas" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[2rem] text-center hover:bg-white/10 transition-colors">
                    <p className="text-3xl font-black text-orange-500 mb-1">{stat.value}</p>
                    <p className="text-white font-bold text-sm mb-0.5">{stat.label}</p>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FINAL CALL TO ACTION */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
            Dejá de usar planillas.<br />
            <span className="text-orange-500">Empezá a crecer.</span>
          </h2>
          <p className="text-xl text-gray-500 dark:text-zinc-400 font-medium max-w-xl mx-auto">
            Unite a la red de negocios que ya están transformando su forma de vender. Sin contratos, sin letra chica.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={user ? (isOwnerOrAdmin ? "/dashboard" : "/mis-pedidos") : "/login"} className="px-12 py-5 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-lg rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 w-full sm:w-auto">
              {user ? (isOwnerOrAdmin ? "Ir a mi Panel" : "Ver Mis Pedidos") : "Registrar Negocio Gratis"}
            </Link>
            <Link href="https://wa.me/543755223344" target="_blank" className="flex items-center gap-2 text-gray-500 hover:text-orange-600 font-black text-lg transition-colors py-4">
              <MessageCircle size={24} className="text-green-500" /> Hablar con Soporte
            </Link>
          </div>
        </div>
      </section>


    </main>
  );
}
