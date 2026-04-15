import React from "react";
// Swiper para el carrusel (Instalación: npm install swiper)
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

export default function NosotrosYape() {
  return (
    <div className="bg-[#fcfaff] min-h-screen font-sans">
      {/* CORRECCIÓN: Ajuste de h-[600px] a h-[auto] y pb-20 para que el contenido no choque con el fondo */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center overflow-hidden bg-[#3b0f52]">
        {/* Fondo con los colores oficiales */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7e1d91] via-[#3b0f52] to-[#1a0624]"></div>
          {/* Elemento decorativo circular turquesa */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#25d3c9] rounded-full blur-[120px] opacity-20"></div>
        </div>

        {/* CORRECCIÓN: pb-20 adicional en móviles y pb-10 en md para dar espacio al botón */}
        <div className="max-w-7xl mx-auto w-full px-6 md:px-20 relative z-10 pt-16 md:pt-0 pb-20 md:pb-10">
          <div className="max-w-3xl">
            <span className="inline-block px-5 py-2 bg-[#25d3c9] text-[#3b0f52] text-sm font-black uppercase tracking-[0.2em] rounded-xl mb-8 shadow-lg">
              #TALENTOYAPE
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight md:leading-[0.85] italic mb-6 drop-shadow-xl">
              Únete a nosotros y <br />
              <span className="text-[#25d3c9]">
                haz que tu <br /> carrera fluya
              </span>
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-xl font-medium leading-relaxed mb-10">
              No buscamos años de experiencia, buscamos ganas de transformar el
              Perú. Tu primer gran paso empieza aquí.
            </p>
            <Link
              to="/productos"
              className="px-10 py-5 bg-[#25d3c9] text-[#3b0f52] text-xl font-black rounded-2xl hover:scale-105 transition-all shadow-[0_10px_40px_rgba(37,211,201,0.4)]"
            >
              ¡Postula ahora!
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN: MISIÓN Y VISIÓN --- */}
      <div className="max-w-6xl mx-auto px-4 mb-20 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tarjeta de Misión */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-b-[10px] border-[#7422ff] hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#7422ff]/10 p-3 rounded-2xl">
                <svg
                  className="w-8 h-8 text-[#7422ff]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-[#7422ff] uppercase">
                Misión
              </h3>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              Nuestra misión es simplificar la vida de todos los peruanos,
              permitiéndoles realizar transacciones de forma rápida, segura y
              gratuita.
            </p>
          </div>

          {/* Tarjeta de Visión */}
          <div className="bg-white p-5 rounded-[2.5rem] shadow-xl border-b-[10px] border-[#00d1b2] hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#00d1b2]/10 p-3 rounded-2xl">
                <svg
                  className="w-8 h-8 text-[#00d1b2]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-[#00d1b2] uppercase">
                Visión
              </h3>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              Nuestra visión es ser la herramienta líder en inclusión financiera
              en el Perú, conectando a millones de personas a través de la
              tecnología.
            </p>
          </div>
        </div>
      </div>

      {/* 3. SECCIÓN: CONOCE AL TEAM YAPPE  */}
      <div className="mb-12 py-24 px-6 md:px-10 lg:px-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-6xl font-black text-[#7422ff] uppercase italic tracking-tighter">
            Conoce al <span className="text-[#00d1b2]">Team Yappe</span>
          </h2>
          <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px] sm:text-xs">
            Jóvenes talentosos 🎥
          </p>
        </div>

        {/* VIDEO PRINCIPAL */}
        <div className="mb-10 sm:mb-16 w-full">
          <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#7422ff]/20">
            <iframe
              className="w-full h-full absolute inset-0"
              src="https://www.youtube.com/embed/rEgLiaEZ0u4?si=ksTRVeEUkUfLajG8"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>

            {/* CAPA DE TEXTO: pointer-events-none es clave para poder darle play al video */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-center justify-center pointer-events-none">
              <span className="text-white text-2xl sm:text-4xl font-black uppercase italic tracking-widest"></span>
            </div>
          </div>
        </div>

        {/* FILA DE 3 VIDEOS (ABAJO DEL PRINCIPAL) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {[
            { id: 1, cargo: "Ximena Melchor", vid: "E-tbBfSyWwU" },
            { id: 2, cargo: "Yadira Orihuela", vid: "fOhn5eylCxQ" },
            { id: 3, cargo: "Jaime Ccanto", vid: "h8grbM4Cv18" },
          ].map((item) => (
            <div
              key={item.id}
              className="relative h-[300px] sm:h-[400px] rounded-[2rem] overflow-hidden shadow-xl group hover:scale-[1.02] transition-transform duration-500"
            >
              {/* FILA DE 3 VIDEOS (ABAJO DEL PRINCIPAL) */}
              <iframe
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                src={`https://www.youtube.com/embed/${item.vid}`}
                title={item.cargo}
                frameBorder="0"
                allowFullScreen
              ></iframe>

              <source src={item.vid} type="video/mp4" />

              <div className="absolute inset-0 bg-gradient-to-t from-[#7422ff]/80 to-transparent flex items-end p-6 pointer-events-none">
                <p className="text-white font-black uppercase italic text-lg">
                  {item.cargo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* TESTIMONIOS: GRID DE 4 (2 ARRIBA, 2 ABAJO) */}
      {/* CORRECCIÓN: Padding lateral px-6 para asegurar espacio en móviles */}
      <section className="pb-24 pt-10 px- md:px-10 lg:px-20">
        <div className="max-w-6xl mx-auto">
          {/* CORRECCIÓN: Ajuste de tamaño de fuente en móviles */}
          <h2 className="text-4xl md:text-6xl font-black text-[#3b0f52] mb-16 italic text-center leading-tight">
            Gente joven <span className="text-[#7e1d91]">rompiéndola</span>
          </h2>

          {/* CORRECCIÓN: Gap ajustado para mejor respiración */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Card 1 */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border-b-[12px] border-[#25d3c9] transform hover:-rotate-1 transition-transform">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 bg-[#7e1d91] rounded-2xl flex items-center justify-center text-white font-black">
                  R
                </div>
                <div>
                  <h4 className="font-black text-2xl text-[#3b0f52]">Renzo</h4>
                  <p className="text-[#7e1d91] font-bold italic">Dev Junior</p>
                </div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                "Entré sin saber mucho de Firebase y hoy manejo la base de datos
                de miles de usuarios. ¡Aquí se aprende volando!"
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border-b-[12px] border-[#3b0f52] transform hover:rotate-1 transition-transform">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 bg-[#25d3c9] rounded-2xl flex items-center justify-center text-[#3b0f52] font-black">
                  A
                </div>
                <div>
                  <h4 className="font-black text-2xl text-[#3b0f52]">Andrea</h4>
                  <p className="text-[#7e1d91] font-bold italic">Diseño UX</p>
                </div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                "Lo que más me gusta es la flexibilidad. Puedo estudiar y
                trabajar sin morir en el intento, y el equipo es genial."
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border-b-[12px] border-[#7e1d91] transform hover:-rotate-1 transition-transform">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 bg-[#3b0f52] rounded-2xl flex items-center justify-center text-white font-black">
                  M
                </div>
                <div>
                  <h4 className="font-black text-2xl text-[#3b0f52]">Mateo</h4>
                  <p className="text-[#25d3c9] font-bold italic">Soporte</p>
                </div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                "Mi primer empleo y ya siento que crecí un montón. El ambiente
                es súper joven y todos nos ayudamos entre todos."
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border-b-[12px] border-[#25d3c9] transform hover:rotate-1 transition-transform">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 bg-[#7e1d91] rounded-2xl flex items-center justify-center text-white font-black">
                  L
                </div>
                <div>
                  <h4 className="font-black text-2xl text-[#3b0f52]">
                    Luciana
                  </h4>
                  <p className="text-[#7e1d91] font-bold italic">Marketing</p>
                </div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                "En Yape las ideas locas se escuchan. Si tienes una iniciativa,
                te dan el espacio para hacerla realidad."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CARRUSEL INFORMATIVO CON LINK */}
      {/* CORRECCIÓN: Padding lateral px-6 para asegurar espacio en móviles */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Swiper
            spaceBetween={30}
            autoplay={{ delay: 4500 }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            className="rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl"
          >
            {/* Slide 1 */}
            <SwiperSlide>
              {/* CORRECCIÓN: Estructura flex revisada para móvil y p-8 adicional */}
              <div className="flex flex-col lg:flex-row bg-[#7e1d91] min-h-[500px]">
                <div className="lg:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col justify-center">
                  <h3 className="text-4xl md:text-5xl font-black text-[#25d3c9] mb-6 italic leading-tight">
                    Cero floro, puro talento
                  </h3>
                  <p className="text-white text-xl md:text-2xl mb-10 leading-relaxed font-light">
                    Buscamos gente con chispa. No nos importa de dónde vienes,
                    sino a dónde quieres llegar con nosotros.
                  </p>
                  <a
                    href="/productos"
                    className="text-white text-xl font-black underline decoration-[#25d3c9] decoration-[8px] underline-offset-8 hover:text-[#25d3c9] transition-all"
                  >
                    VER VACANTES →
                  </a>
                </div>
                <div className="lg:w-1/2 bg-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000"
                    alt="Trabajo en equipo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 2 */}
            <SwiperSlide>
              {/* CORRECCIÓN: Estructura flex revisada para móvil y p-8 adicional */}
              <div className="flex flex-col lg:flex-row bg-[#25d3c9] min-h-[500px]">
                <div className="lg:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col justify-center">
                  <h3 className="text-4xl md:text-5xl font-black text-[#3b0f52] mb-6 italic leading-tight">
                    Beneficios nivel Pro
                  </h3>
                  <p className="text-[#3b0f52] text-xl md:text-2xl mb-10 leading-relaxed font-medium">
                    Línea de carrera, capacitaciones constantes y el mejor
                    ambiente laboral para que nunca dejes de aprender.
                  </p>
                  <a
                    href="/beneficios"
                    className="text-[#3b0f52] text-xl font-black underline decoration-white decoration-[8px] underline-offset-8 hover:text-white transition-all"
                  >
                    CONOCE LOS BENEFICIOS →
                  </a>
                </div>
                <div className="lg:w-1/2 bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000"
                    alt="Oficinas"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      <div className="h-24"></div>
    </div>
  );
}
