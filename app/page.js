import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] overflow-x-hidden">

      {/* ═══════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-28 pb-20">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/3 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full mb-8">
            <span className="flex h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-orange-700">Disponible en San Vicente y toda Misiones</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-gray-900 tracking-tight leading-[0.9] mb-8">
            Llevá tu negocio
            <br />
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              al mundo digital
            </span>
            <br />
            en un click.
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Clickcito es la plataforma que adapta tu negocio al ecommerce sin importar el rubro.
            <span className="text-gray-900 font-bold"> Comida, ropa, servicios o materiales pesados</span> — tenemos la solución exacta para vos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group relative w-full sm:w-auto"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition" />
              <div className="relative flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-lg rounded-2xl shadow-xl transition-transform group-hover:scale-[1.02]">
                🚀 Crear tienda gratis
              </div>
            </Link>
            <Link
              href="#modulos"
              className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-gray-200 text-gray-900 font-black text-lg rounded-2xl hover:border-orange-500 hover:text-orange-600 transition-all text-center"
            >
              Ver soluciones →
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 font-bold">
            <span className="flex items-center gap-2">✅ Sin costo de activación</span>
            <span className="flex items-center gap-2">✅ Sin comisiones por venta</span>
            <span className="flex items-center gap-2">✅ Autogestión total</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* LOGOS / STATS BAR */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-12 px-6 border-y border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "150+", label: "Negocios activos" },
            { number: "10K+", label: "Pedidos procesados" },
            { number: "4", label: "Rubros adaptados" },
            { number: "99.9%", label: "Uptime garantizado" },
          ].map((stat, i) => (
            <div key={i} className="group">
              <p className="text-3xl sm:text-4xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">{stat.number}</p>
              <p className="text-sm text-gray-500 font-bold mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* MÓDULOS / FEATURES GRID */}
      {/* ═══════════════════════════════════════════ */}
      <section id="modulos" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-black text-orange-600 uppercase tracking-[0.3em]">Soluciones por rubro</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-4 tracking-tight">
              Un sistema que se adapta
              <br />
              <span className="text-gray-400">a tu negocio</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Gastronomía */}
            <div className="group relative bg-white rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <span className="text-5xl mb-6 block">🍔</span>
                <h3 className="text-2xl font-black text-gray-900 mb-3">Gastronomía</h3>
                <p className="text-gray-500 leading-relaxed font-medium mb-6">
                  Menús interactivos con fotos, categorías, agregados personalizados (tipo de pan, salsas, extras) y pedidos rápidos directo al WhatsApp o al panel.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Menú Digital", "Agregados", "Pedidos Rápidos", "Delivery"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Retail */}
            <div className="group relative bg-white rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <span className="text-5xl mb-6 block">👗</span>
                <h3 className="text-2xl font-black text-gray-900 mb-3">Retail & Moda</h3>
                <p className="text-gray-500 leading-relaxed font-medium mb-6">
                  Catálogos visuales con galería de fotos, gestión de talles, variantes de color, control de stock en tiempo real y carrito de compras integrado.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Catálogo Visual", "Talles", "Colores", "Stock Real"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Servicios */}
            <div className="group relative bg-white rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <span className="text-5xl mb-6 block">💇</span>
                <h3 className="text-2xl font-black text-gray-900 mb-3">Servicios & Turnos</h3>
                <p className="text-gray-500 leading-relaxed font-medium mb-6">
                  Sistema ágil de reserva de turnos para estéticas, profesionales y consultorios. Agendá clientes sin mensajes de ida y vuelta. Todo automatizado.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Turnos Online", "Agenda Smart", "Recordatorios", "Auto-gestión"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 4: Construcción */}
            <div className="group relative bg-white rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <span className="text-5xl mb-6 block">🪵</span>
                <h3 className="text-2xl font-black text-gray-900 mb-3">Materiales & Madera</h3>
                <p className="text-gray-500 leading-relaxed font-medium mb-6">
                  Venta B2B y B2C con unidades complejas: metros, pies cuadrados, venta fraccionada por volumen. Logística para fletes pesados incluida.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Unidades Complejas", "B2B / B2C", "Fletes Pesados", "Volumen"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* BENEFICIOS CLAVE */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-black text-orange-500 uppercase tracking-[0.3em]">¿Por qué Clickcito?</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-4 tracking-tight">
              Todo lo que necesitás,
              <br />
              <span className="text-gray-500">nada que no.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎛️",
                title: "Autogestión Total",
                description: "Manejá todo desde tu celular: productos, precios, estados de pedidos, horarios. Sin depender de nadie.",
                gradient: "from-orange-600/20 to-orange-600/0",
              },
              {
                icon: "💰",
                title: "Sin Comisiones Abusivas",
                description: "Tu ganancia es tuya. Sin porcentaje por venta, sin cargos ocultos. Pagás un plan fijo y transparente.",
                gradient: "from-emerald-600/20 to-emerald-600/0",
              },
              {
                icon: "🚚",
                title: "Logística Adaptable",
                description: "Delivery en moto, flete en camión, retiro en local. Cada rubro tiene su logística. Nosotros nos adaptamos.",
                gradient: "from-blue-600/20 to-blue-600/0",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="group relative bg-white/5 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/10 hover:border-orange-500/30 transition-all duration-500"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${benefit.gradient} rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <span className="text-4xl mb-6 block">{benefit.icon}</span>
                  <h3 className="text-xl font-black mb-3">{benefit.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SOCIAL PROOF — TOP ONE BURGERS */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 rounded-[3rem] p-8 sm:p-14 overflow-hidden">
            {/* Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-[80px]" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-bold mb-8">
                  ⭐ Caso de éxito
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-6 leading-tight">
                  &quot;Desde que usamos Clickcito, nuestros pedidos
                  <span className="text-orange-500"> se triplicaron</span>&quot;
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed font-medium mb-8">
                  Top One Burgers pasó de gestionar pedidos por WhatsApp a tener un menú interactivo con agregados personalizados, carrito inteligente y panel de administración en tiempo real.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xl">
                    T
                  </div>
                  <div>
                    <p className="text-white font-black">Top One Burgers</p>
                    <p className="text-gray-500 text-sm font-bold">San Vicente, Misiones</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-[2rem] p-6 border border-white/10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold">Resultados en 3 meses</span>
                    <span className="text-orange-500 font-black">📈 +300%</span>
                  </div>
                  {[
                    { label: "Pedidos mensuales", before: "~40", after: "120+", change: "+200%" },
                    { label: "Tiempo por pedido", before: "8 min", after: "45 seg", change: "-90%" },
                    { label: "Errores en pedidos", before: "15%", after: "~0%", change: "-100%" },
                    { label: "Satisfacción cliente", before: "3.2★", after: "4.9★", change: "+53%" },
                  ].map((metric, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-t border-white/5">
                      <div>
                        <p className="text-white font-bold text-sm">{metric.label}</p>
                        <p className="text-gray-500 text-xs font-medium">{metric.before} → {metric.after}</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-black rounded-full">
                        {metric.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* CTA FINAL */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight mb-6">
            ¿Listo para
            <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent"> digitalizar</span> tu negocio?
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-medium">
            Sumáte a los negocios que ya crecen con Clickcito. Configurá tu tienda en minutos, sin código, sin complicaciones.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group relative w-full sm:w-auto"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition" />
              <div className="relative flex items-center justify-center gap-3 px-12 py-5 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-lg rounded-2xl shadow-xl transition-transform group-hover:scale-[1.02]">
                Registrar mi Negocio — Es Gratis
              </div>
            </Link>
            <Link
              href="#contacto"
              className="w-full sm:w-auto px-10 py-5 text-gray-500 font-black text-lg hover:text-orange-600 transition-colors text-center"
            >
              Hablemos por WhatsApp →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}