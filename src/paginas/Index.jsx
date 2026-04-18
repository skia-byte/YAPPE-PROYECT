
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* IMAGES */
import slide1 from "../componentes/img/slide1.png";
import slide2 from "../componentes/img/slide2.png";
import slide3 from "../componentes/img/slide3.png";
import slide4 from "../componentes/img/slide4.png";
import slide5 from "../componentes/img/slide5.png";

import video from "../componentes/img/video.mp4";

/* PASOS */
import uso1 from "../componentes/img/uso1.png";
import uso2 from "../componentes/img/uso2.png";
import uso3 from "../componentes/img/uso3.png";
import uso4 from "../componentes/img/uso4.png";
import uso5 from "../componentes/img/uso5.png";
import uso6 from "../componentes/img/uso6.png";

/* TARJETAS */
import motivo1 from "../componentes/img/motivo1.png";
import motivo2 from "../componentes/img/motivo2.png";
import motivo3 from "../componentes/img/motivo3.png";
import motivo4 from "../componentes/img/motivo4.png";
import motivo5 from "../componentes/img/motivo5.png";
import motivo6 from "../componentes/img/motivo6.png";
import motivo7 from "../componentes/img/motivo7.png";
import motivo8 from "../componentes/img/motivo8.png";

/* ================= DATA ================= */

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
const pasos = [
  { img: uso1, titulo: "1.Regístrate", desc: "Crea tu cuenta en Yape Oportunidades de forma rápida y sencilla." },
  { img: uso2, titulo: "2.Completa tu perfil", desc: "Agrega tus datos y cuéntanos sobre ti." },
  { img: uso3, titulo: "3.Explora oportunidades", desc: "Descubre las vacantes disponibles para jóvenes como tú." },
  { img: uso4, titulo: "4.Postula", desc: "Aplica fácil,elige la oportunidad que más te guste y envía tu solicitud." },
  { img: uso5, titulo: " 5. Espera nuestro contacto", desc: "Nuestro equipo revisará tu perfil y te llamará si avanzas." },
  { img: uso6, titulo: "Bienvenido al Team Yape 🎉", desc: " Ya eres parte de la familia Yape. Empieza a crecer con nosotros." },
];


const tarjetas = [
  { img: motivo1, titulo: "Primer empleo", desc: "Tu primera oportunidad laboral." },
  { img: motivo2, titulo: "Aprendizaje", desc: "Aprendes habilidades digitales." },
  { img: motivo3, titulo: "Crecimiento", desc: "Crecimiento profesional." },
  { img: motivo4, titulo: "Ambiente joven", desc: "Equipo joven." },
  { img: motivo5, titulo: "Innovación", desc: "Tecnología real." },
  { img: motivo6, titulo: "Flexibilidad", desc: "Trabajo dinámico." },
  { img: motivo7, titulo: "Impacto", desc: "Impacto real." },
  { img: motivo8, titulo: "Futuro", desc: "Construye tu futuro." },
];

export default function Inicio() {

  /* ================= SLIDER ================= */
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex((p) => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[slideIndex];

  /* ================= CONTADOR ================= */
  const [count, setCount] = useState(0);
  const finalNumber = 1000;

  const digits = count.toString().padStart(4, "0").split("");

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i += 5;
      if (i >= finalNumber) clearInterval(t);
      setCount(Math.min(i, finalNumber));
    }, 25);
    return () => clearInterval(t);
  }, []);

  /* ================= CARRUSEL 3D ================= */
  const [pasoActivo, setPasoActivo] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPasoActivo((p) => (p + 1) % pasos.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  /* ================= CARRUSEL TARJETAS ================= */
  const [carIndex, setCarIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCarIndex((p) => (p + 1) % Math.ceil(tarjetas.length / 3));
    }, 4000);
    return () => clearInterval(t);
  }, []);
  const videoRef = useRef(null);

  return (
    <main className="overflow-x-hidden bg-white">

     {/* ================= SLIDER ================= */}
<section
  className="relative h-[90vh] flex items-center justify-center text-center"
  style={{
    backgroundImage: `url(${slide.imagen})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="absolute inset-0 bg-black/60" />

  {/* 🔥 FLECHA IZQUIERDA */}
  <button
    onClick={() =>
      setSlideIndex((prev) =>
        prev === 0 ? slides.length - 1 : prev - 1
      )
    }
    className="absolute left-6 z-20 text-white text-5xl bg-black/40 w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition"
  >
    ‹
  </button>

  {/* 🔥 FLECHA DERECHA */}
  <button
    onClick={() =>
      setSlideIndex((prev) => (prev + 1) % slides.length)
    }
    className="absolute right-6 z-20 text-white text-5xl bg-black/40 w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition"
  >
    ›
  </button>

  {/* CONTENIDO */}
  <div className="z-10 text-white max-w-4xl">
    <h1 className="text-6xl font-bold">{slide.titulo}</h1>
    <p className="mt-4 text-xl">{slide.texto}</p>

    <Link
      to="/unete"
      className="mt-6 inline-block bg-[#18dbc1] px-8 py-3 rounded-full font-bold"
    >
      Únete
    </Link>
  </div>
</section>

      {/* ================= BIENVENIDA ================= */}
      <section className="py-28 px-10 max-w-[1600px] mx-auto grid md:grid-cols-2 gap-20 items-center">

        <div>
          <h2 className="text-6xl font-extrabold text-gray-800">
            Bienvenido(a) a Yape
          </h2>

          <h3 className="text-4xl text-[#18dbc1] mt-6 font-semibold">
            Yape: oportunidades para todos
          </h3>

          <p className="mt-8 text-xl text-gray-700">
             Descubre cómo es un día trabajando en Yape y da el primer paso hacia tu futuro laboral.
          </p>

          <p className="mt-6 text-lg text-gray-600">
               A través de este espacio podrás conocer de cerca la experiencia real dentro de nuestro equipo:
            jóvenes como tú aprendiendo, creciendo y construyendo oportunidades en el mundo financiero.
            No necesitas experiencia, solo las ganas de empezar.
          </p>

          <p className="mt-6 text-xl font-bold text-gray-800">
            Empieza hoy tu camino.Mira el video, inspírate y comienza hoy tu camino con nosotros.
          </p>
        </div>

        
         <video
        ref={videoRef}
        src={video}
        autoPlay
        muted
        loop
         controls
          className="w-full h-[520px] object-cover rounded-[40px] border-[4px] border-[#7422ff]"
           />
        

      </section>

      {/* ================= CARRUSEL 3D ================= */}
       
       <section className="pt-24 pb-32 text-center">
  
  {/* TÍTULO MÁS AIRE ABAJO */}
  <h2 className="text-5xl font-bold mb-20">
    Tu camino en Yape
  </h2>

  {/* CARRUSEL */}
  <div className="relative h-[500px] flex justify-center items-center perspective-[1800px]">

    {pasos.map((item, index) => {
      let offset = index - pasoActivo;

      if (offset > pasos.length / 2) offset -= pasos.length;
      if (offset < -pasos.length / 2) offset += pasos.length;

      return (
        <div
          key={index}
          onClick={() => setPasoActivo(index)}
          className="absolute w-[380px] h-[500px] cursor-pointer transition-all duration-700"
          style={{
            transform: `
              translateX(${offset * 320}px)
              rotateY(${offset * -20}deg)
              scale(${offset === 0 ? 1.15 : 0.88})
            `,
            opacity: Math.abs(offset) > 2 ? 0 : 1,
            zIndex: 10 - Math.abs(offset),
          }}
        >
          <div className="bg-white rounded-[25px] shadow-xl overflow-hidden h-full">
            <img src={item.img} className="w-full h-[300px] object-cover" />
            <div className="p-4">
              <h3 className="text-2xl font-extrabold text-[#5F1DB3]">
                {item.titulo}
              </h3>
              <p className="text-base text-gray-700 mt-3 font-medium">
                {item.desc}
              </p>
            </div>
          </div>
        </div>
      );
    })}

  </div>
</section>

      {/* ================= CONTADOR ================= */}
      <section className="py-28 text-center bg-gradient-to-r from-[#681992] via-[#8436ad] to-[#00CBBF]">

        <h2 className="text-5xl font-bold text-white">
          No importa de dónde vienes, importa a dónde vas
        </h2>

        <div className="flex justify-center gap-4 mt-10">
          {digits.map((d, i) => (
            <div
              key={i}
              className="w-20 h-24 bg-white/10 text-white text-5xl flex items-center justify-center rounded-xl"
            >
              {d}
            </div>
          ))}
        </div>

        <p className="text-white mt-4 text-xl">
          +1000 jóvenes ya forman parte de Yape
        </p>

      </section>

      {/* ================= TARJETAS ================= */}
      <section className="py-24 text-center">

        <h2 className="text-5xl font-bold mb-10">
          ¿Por qué trabajar en Yape?
        </h2>

        <div className="relative max-w-[1600px] mx-auto flex items-center justify-center">

          <button
            onClick={() =>
              setCarIndex((p) =>
                p === 0 ? Math.ceil(tarjetas.length / 3) - 1 : p - 1
              )
            }
            className="absolute left-0 text-5xl w-14 h-14 bg-white shadow-md rounded-full"
          >
            ‹
          </button>

          <div className="flex gap-10 transition-all duration-700">

            {tarjetas
              .slice(carIndex * 3, carIndex * 3 + 3)
              .map((item, i) => (
                <div key={i} className="w-[420px] h-[320px] relative rounded-2xl overflow-hidden group shadow-lg">

                  <img src={item.img} className="w-full h-full object-cover" />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition flex items-center justify-center opacity-0 group-hover:opacity-100">

                    <div className="text-white text-center px-4">
                      <h3 className="text-2xl font-bold">{item.titulo}</h3>
                      <p className="mt-2 text-sm">{item.desc}</p>
                    </div>

                  </div>

                </div>
              ))}

          </div>

          <button
            onClick={() =>
              setCarIndex((p) =>
                (p + 1) % Math.ceil(tarjetas.length / 3)
              )
            }
            className="absolute right-0 text-5xl w-14 h-14 bg-white shadow-md rounded-full"
          >
            ›
          </button>

        </div>
      </section>

    </main>
  );
}