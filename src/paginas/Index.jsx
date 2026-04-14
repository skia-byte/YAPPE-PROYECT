
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// HERO SLIDES
import slide1 from "../componentes/img/slide1.png";
import slide2 from "../componentes/img/slide2.png";
import slide3 from "../componentes/img/slide3.png";
import slide4 from "../componentes/img/slide4.png";
import slide5 from "../componentes/img/slide5.png";

// TARJETAS
import motivo1 from "../componentes/img/motivo1.png";
import motivo2 from "../componentes/img/motivo2.png";
import motivo3 from "../componentes/img/motivo3.png";
import motivo4 from "../componentes/img/motivo4.png";
import motivo5 from "../componentes/img/motivo5.png";
import motivo6 from "../componentes/img/motivo6.png";
import motivo7 from "../componentes/img/motivo7.png";
import motivo8 from "../componentes/img/motivo8.png";

const slides = [
  {
    titulo: (
      <>
        Yape <span className="text-[#18dbc1]">Oportunidades</span>
        <br /> para Todos
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

const tarjetas = [
  { img: motivo1, titulo: "Primer empleo", desc: "Yape te da tu primera oportunidad laboral real." },
  { img: motivo2, titulo: "Aprendizaje", desc: "Aprendes habilidades digitales y financieras." },
  { img: motivo3, titulo: "Crecimiento", desc: "Puedes crecer dentro de la empresa." },
  { img: motivo4, titulo: "Ambiente joven", desc: "Trabajas con jóvenes como tú." },
  { img: motivo5, titulo: "Innovación", desc: "Formas parte de tecnología real." },
  { img: motivo6, titulo: "Flexibilidad", desc: "Ambiente moderno y dinámico." },
  { img: motivo7, titulo: "Impacto", desc: "Ayudas a millones de personas." },
  { img: motivo8, titulo: "Futuro", desc: "Construyes tu carrera desde cero." },
];

export default function Inicio() {
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [activa, setActiva] = useState(null);

  const scrollRef = useRef(null);
  const finalNumber = 1000;

  // CONTADOR
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = finalNumber / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= finalNumber) {
        start = finalNumber;
        clearInterval(counter);
      }
      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(counter);
  }, []);

  // HERO AUTO
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -500, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 500, behavior: "smooth" });
  };

  const slide = slides[current];
  const digits = count.toString().padStart(4, "0").split("");

  return (
    <main className="overflow-x-hidden bg-white">

      {/* HERO CON FLECHAS */}
      <section
        className="relative w-full h-[90vh] flex items-center justify-center text-center px-4"
        style={{
          backgroundImage: `url(${slide.imagen})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Flecha izquierda */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20
          bg-white/30 hover:bg-white/60 backdrop-blur-md
          w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        >
          ‹
        </button>

        {/* Flecha derecha */}
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20
          bg-white/30 hover:bg-white/60 backdrop-blur-md
          w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        >
          ›
        </button>

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

      {/* MENSAJE + CONTADOR */}
      <section className="pt-16 pb-10 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          No importa de dónde vienes, importa a dónde quieres llegar
        </h2>

        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          En Yape creemos en el talento joven 🚀
        </p>

        <div className="mt-10">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
            Jóvenes construyendo el futuro
          </h3>

          <div className="flex justify-center items-center gap-4 mt-6">
            {digits.map((num, index) => (
              <div
                key={index}
                className="w-20 h-24 flex items-center justify-center text-3xl font-bold bg-white border-2 rounded-xl shadow-lg"
              >
                {num}
              </div>
            ))}
          </div>

          <p className="mt-3 text-gray-600">
            jóvenes ya forman parte del{" "}
            <span className="font-semibold text-[#18dbc1]">
              Team Yape
            </span>
          </p>
        </div>
      </section>

      {/* CARRUSEL */}
      <section className="py-28 px-4 text-center">
        <h2 className="text-5xl font-extrabold mb-16">
          ¿Por qué trabajar en <span className="text-[#18dbc1]">Yape</span>?
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

        <div className="relative max-w-[1600px] mx-auto">

          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20
            bg-white/30 hover:bg-white/60 backdrop-blur-lg
            w-16 h-16 rounded-full shadow-lg flex items-center justify-center"
          >
            ‹
          </button>

          <div
            ref={scrollRef}
            className="flex gap-12 overflow-x-auto scroll-smooth px-24 no-scrollbar"
          >
            {tarjetas.map((item, index) => (
              <div key={index} className="flex-shrink-0">
                <div
                  onClick={() => setActiva(index)}
                  className={`
                    w-[520px] md:w-[600px]
                    h-[380px] md:h-[480px]
                    relative cursor-pointer rounded-2xl overflow-hidden
                    transition-all duration-500
                    ${activa === index ? "scale-110 z-10" : "hover:scale-105"}
                  `}
                >
                  <img
                    src={item.img}
                    alt=""
                    className="w-full h-full object-cover"
                  />

                  <div
                    className={`absolute inset-0 flex flex-col justify-center items-center text-white text-center p-8
                    transition-all duration-500
                    ${
                      activa === index
                        ? "bg-black/70 opacity-100"
                        : "bg-black/0 opacity-0 hover:bg-black/50 hover:opacity-100"
                    }`}
                  >
                    <h3 className="font-bold text-4xl">{item.titulo}</h3>
                    <p className="text-xl mt-4">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20
            bg-white/30 hover:bg-white/60 backdrop-blur-lg
            w-16 h-16 rounded-full shadow-lg flex items-center justify-center"
          >
            ›
          </button>

        </div>

      </section>

    </main>
  );
}