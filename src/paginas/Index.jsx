
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import slide1 from "../componentes/img/slide1.png";
import slide2 from "../componentes/img/slide2.png";
import slide3 from "../componentes/img/slide3.png";
import slide4 from "../componentes/img/slide4.png";
import slide5 from "../componentes/img/slide5.png";

const slides = [
  {
    titulo: (
      <>
        Yape <span className="text-[#18dbc1]">Oportunidades</span>
        <br />
        para Todos
      </>
    ),
    texto: "Da tu primer paso al mundo laboral con Yape.",
    imagen: slide4,
  },
  {
    titulo: "Tu primer paso al mundo laboral",
    texto: "Accede a oportunidades reales diseñadas para jóvenes.",
    imagen: slide1,
  },
  {
    titulo: "Un espacio para todos",
    texto: "Creemos en la inclusión y el talento joven.",
    imagen: slide3,
  },
  {
    titulo: "Aprende mientras creces",
    texto: "Desarrolla habilidades en un entorno innovador.",
    imagen: slide2,
  },
  {
    titulo: "Tu futuro empieza hoy",
    texto: "Atrévete a dar el primer paso.",
    imagen: slide5,
  },
];

export default function Inicio() {
  const [current, setCurrent] = useState(0);

  const [count, setCount] = useState(0);
  const finalNumber = 1000;

  useEffect(() => {
    let start = 0;

    const interval = setInterval(() => {
      start += 10;

      if (start >= finalNumber) {
        start = finalNumber;
        clearInterval(interval);
      }

      setCount(start);
    }, 20);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];
  const digits = count.toString().padStart(4, "0").split("");

  return (
    <main className="overflow-x-hidden bg-gradient-to-br from-white via-purple-50 to-[#f5f3ff]">

      {/* HERO */}
      <section
        className="relative w-full min-h-[80vh] flex items-center justify-center text-center px-4"
        style={{
          backgroundImage: `url(${slide.imagen})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white">
            {slide.titulo}
          </h1>

          <p className="mt-6 text-lg text-white opacity-90">
            {slide.texto}
          </p>

          <Link
            to="/productos"
            className="inline-block mt-8 px-10 py-4 bg-[#18dbc1] text-white font-bold rounded-full hover:scale-105 transition"
          >
            Únete a nosotros
          </Link>
        </div>
      </section>

      {/* MENSAJE */}
      <section className="py-16 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          No importa de dónde vienes, importa a dónde quieres llegar
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          En Yape creemos en el talento joven 🚀
        </p>
      </section>

      {/* 🔢 CONTADOR */}
      <section className="py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Jóvenes construyendo el futuro
        </h2>

        <p className="mt-3 text-gray-500">
          Cada vez somos más 🚀
        </p>

        <div className="flex justify-center gap-4 mt-10">
          {digits.map((num, index) => (
            <div
              key={index}
              className="w-14 h-16 md:w-16 md:h-20 flex items-center justify-center 
              text-2xl md:text-3xl font-bold 
              bg-white/80 backdrop-blur-md 
              border border-purple-100 
              rounded-xl shadow-sm"
            >
              {num}
            </div>
          ))}
        </div>

        <p className="mt-4 text-gray-600">
          jóvenes ya forman parte del Team Yape
        </p>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-purple-700 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Tu futuro empieza hoy
        </h2>

        

        <p className="mt-4 text-purple-100">
          No esperes tener experiencia. Empieza ahora.
        </p>

        <Link
          to="/productos"
          className="inline-block mt-8 px-10 py-4 bg-[#18dbc1] font-bold rounded-full hover:scale-105 transition"
        >
          Postula ahora
        </Link>

      </section>

    </main>
  );
}
