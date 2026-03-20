import React from "react";
import Image from "next/image";
import Link from "next/link";
import "./local.css";
import Footer from "../app/components/Footer";

export default function About() {
  return (
    <div className="bg-white text-black font-serif">
      <div className="container mx-auto px-5 py-16 ">

        {/* Header: Sobre Nosotros */}
        <div className="text-center ">
          <h1 className="text-5xl md:text-6xl font-serif font-black uppercase tracking-widest text-yellow-400">
            Top One Burger
          </h1>
          <h2 className="text-xs font-bold mt-2 mb-2">
            Más que Hamburguesas, una Experiencia
          </h2>
        </div>
        <div className=" text-center ">
          <Link
            href="/"
            className="bg-yellow-500 hover:bg-yellow-600 mb-4 text-black font-bold py-4 px-8 rounded-full inline-flex items-center gap-2 transition duration-300"
          >
            ¡Pedí Ahora!
          </Link>
        </div>
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-20">
          {/* Nuestra Historia */}
          <div className=" t p-8 rounded-lg shadow-lg flex flex-col justify-center ">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">
              Nuestra Historia
            </h2>
            <p className="text-lg leading-relaxed flex-grow">
              En Top One Burgers, nuestra aventura comenzó con una simple pero
              ambiciosa misión: crear la hamburguesa perfecta. Desde nuestros
              inicios humildes, hemos dedicado incontables horas, sudor y pasión
              para perfeccionar cada detalle, desde la selección de los
              ingredientes hasta la última pincelada de salsa.
            </p>
          </div>

          {/* Nuestra Misión */}
          <div className="p-8 rounded-lg shadow-lg flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4 ">
              Nuestra Misión
            </h2>
            <p className="text-lg leading-relaxed flex-grow">
              Nuestra misión es simple: entregar una experiencia inigualable a
              cada cliente. Nos esforzamos por ofrecer la mejor hamburguesa que
              hayas probado, utilizando solo ingredientes frescos y de la más
              alta calidad. Nos obsesiona cada detalle.
            </p>
          </div>

          {/* Nuestra Visión */}
          <div className="p-8 rounded-lg shadow-lg flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4 ">
              Nuestra Visión
            </h2>
            <p className="text-lg leading-relaxed flex-grow">
              Aspiramos a ser más que una hamburguesería; queremos ser el punto
              de encuentro donde la comunidad se une para celebrar los buenos
              momentos. Imaginamos un futuro donde cada mordisco sea una
              experiencia memorable.
            </p>
          </div>
          {/* Nuestros Ingredientes */}
          <div className="p-8 rounded-lg shadow-lg flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4 ">
              Nuestros Ingredientes
            </h2>
            <p className="text-lg leading-relaxed flex-grow">
              En Top One Burgers, la calidad es nuestra prioridad. Seleccionamos
              carnes frescas, vegetales cultivados localmente y panes artesanales
              para garantizar que cada hamburguesa sea una obra maestra.
            </p>
          </div>
          {/* Nuestro Equipo */}
          <div className="p-8 rounded-lg shadow-lg flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-lg leading-relaxed flex-grow">
              Somos un equipo apasionado por las hamburguesas y comprometido con
              ofrecerte la mejor experiencia. Desde nuestros chefs hasta el
              equipo de atención al cliente, cada miembro comparte el mismo
              entusiasmo por la perfección.
            </p>
          </div>
          {/* Contáctanos */}
          <div className="p-8 rounded-lg shadow-lg flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4 ">
              Contáctanos
            </h2>
            <p className="text-lg leading-relaxed flex-grow">
              ¿Tienes alguna pregunta, comentario o sugerencia? ¡Nos encantaría
              saber de ti!
              <br />
              Visita nuestras redes sociales o envíanos un correo electrónico
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>

  );
}

