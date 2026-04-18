import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

// IMÁGENES
import mujer1 from "../componentes/img/mujer1.png";
import mujer2 from "../componentes/img/mujer2.png";
import mujer3 from "../componentes/img/mujer3.png";
import mujer4 from "../componentes/img/mujer4.png";
import mujer5 from "../componentes/img/mujer5.png";
import uno1 from "../componentes/img/uno1.png";
import dos2 from "../componentes/img/dos2.png";

export default function NosotrosYape() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showHistoryDetail, setShowHistoryDetail] = useState(false);
  const scrollMujeresRef = useRef(null);

  // CARRUSEL INFINITO Y AUTOPLAY (3 SEGUNDOS)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!expandedIndex && scrollMujeresRef.current) {
        handleScroll("right");
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [expandedIndex]);

  const mujeresYape = [
    { id: 1, nombre: "Lucía Barrantes", rol: "Experiencia", img: mujer1, detalle: "Product Owner de Experiencia. Enfocada en diseñar soluciones digitales centradas en el usuario peruano." },
    { id: 2, nombre: "Natalia Prieto", rol: "Estrategia de Personas", img: mujer2, detalle: "Líder de Estrategia de Personas. Impulsa la cultura ágil y el bienestar del talento." },
    { id: 3, nombre: "Shen Tay Wo Chong", rol: "Tecnología", img: mujer3, detalle: "Staff Engineer. Lidera la arquitectura técnica para asegurar escalabilidad y rendimiento en la app." },
    { id: 4, nombre: "Claudia Silva", rol: "Pagos", img: mujer4, detalle: "Gerente de Pagos y Recargas. Transforma el ecosistema financiero con soluciones de pago digitales." },
    { id: 5, nombre: "Daniella Olivares", rol: "Estrategia de Personas", img: mujer5, detalle: "Chapter Lead de Atracción de Talento. Conecta el mejor talento tecnológico con el propósito Yape." }
  ];

  const handleScroll = (direction) => {
    if (scrollMujeresRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollMujeresRef.current;
      const cardWidth = 320;
      let newScroll = direction === "left" ? scrollLeft - cardWidth : scrollLeft + cardWidth;

      if (newScroll < 0) {
        newScroll = scrollWidth - clientWidth;
      } else if (newScroll >= scrollWidth - clientWidth + 10) {
        newScroll = 0;
      }

      scrollMujeresRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#fcfaff] min-h-screen font-sans overflow-x-hidden">

      {/* HERO (BANNER) */}
      <section className="relative w-full h-[450px] md:h-[550px] flex items-center overflow-hidden bg-[#3b0f52]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7e1d91] via-[#3b0f52] to-[#1a0624]" />
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#25d3c9] rounded-full blur-[120px] opacity-20" />
        </div>
        <div className="max-w-7xl mx-auto w-full px-6 md:px-20 relative z-10 pt-20">
          <span className="inline-block px-4 py-1.5 bg-[#25d3c9] text-[#3b0f52] text-[10px] font-black uppercase rounded-lg mb-4">#TALENTOYAPE</span>
          <h1 className="text-4xl md:text-6xl font-black text-white italic mb-4 leading-tight">Únete y haz que tu <br /><span className="text-[#25d3c9]">carrera fluya</span></h1>
          <p className="text-white/80 text-lg max-w-xl mb-8">No buscamos experiencia, buscamos talento con ganas de crecer.</p>
          <Link to="/productos" className="px-10 py-4 bg-[#25d3c9] text-[#3b0f52] font-black rounded-xl hover:scale-105 transition inline-block">¡Postula ahora!</Link>
        </div>
      </section>

      {/* HISTORIA INTERACTIVA */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[400px]">
          <img
            src={uno1}
            onClick={() => setShowHistoryDetail(false)}
            className={`absolute top-0 left-0 w-3/4 h-3/4 object-cover rounded-[2.5rem] shadow-2xl cursor-pointer transition-all duration-500 z-20 ${showHistoryDetail ? 'scale-90 opacity-40 blur-sm' : 'scale-100 rotate-[-5deg] border-4 border-white'}`}
            alt="Yape 2016"
          />
          <img
            src={dos2}
            onClick={() => setShowHistoryDetail(true)}
            className={`absolute bottom-0 right-0 w-3/4 h-3/4 object-cover rounded-[2.5rem] shadow-2xl cursor-pointer transition-all duration-500 z-10 ${!showHistoryDetail ? 'scale-90 opacity-40 blur-sm' : 'scale-100 rotate-[5deg] z-30 border-4 border-white'}`}
            alt="Yape Actual"
          />
        </div>
        <div className="animate-fadeIn">
          <h2 className="text-4xl font-black text-[#3b0f52] italic mb-6">Nuestra <span className="text-[#7422ff]">Historia</span></h2>
          <div className="text-gray-600 text-lg leading-relaxed space-y-4">
            {!showHistoryDetail ? (
              <>
                <p>En 2016, Yape nació como una respuesta a la necesidad de digitalizar el efectivo en el Perú. Surgió en el centro de innovación del BCP con solo un grupo de yaperos soñadores.</p>
                <p>Nuestra meta era clara: transacciones gratuitas, inmediatas y solo usando el número de celular.</p>
              </>
            ) : (
              <>
                <p>Hoy somos más de 15 millones de usuarios y hemos evolucionado para ser mucho más que una app de pagos.</p>
                <p>Desde recargas y créditos hasta "Yape Promos", seguimos transformando el ecosistema digital peruano para simplificar tu día a día.</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* DATOS DE EMPLEABILIDAD YAPE */}
      <section className="py-16 bg-[#f0ebff]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-black text-[#7422ff]">+1,000</p>
            <p className="text-gray-500 text-sm font-bold uppercase mt-2">Colaboradores</p>
          </div>
          <div>
            <p className="text-4xl font-black text-[#00d1b2]">95%</p>
            <p className="text-gray-500 text-sm font-bold uppercase mt-2">Cultura Ágil</p>
          </div>
          <div>
            <p className="text-4xl font-black text-[#7422ff]">75%</p>
            <p className="text-gray-500 text-sm font-bold uppercase mt-2">Remoto/Híbrido</p>
          </div>
          <div>
            <p className="text-4xl font-black text-[#00d1b2]">+50</p>
            <p className="text-gray-500 text-sm font-bold uppercase mt-2">Nuevas vacantes</p>
          </div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-b-[10px] border-[#7422ff]">
          <h3 className="text-3xl font-black text-[#7422ff] uppercase mb-4 italic">Misión</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            Simplificar la vida de todos los peruanos a través de una plataforma digital inclusiva que permita realizar transacciones rápidas, seguras y sin costo.
          </p>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-b-[10px] border-[#00d1b2]">
          <h3 className="text-3xl font-black text-[#00d1b2] uppercase mb-4 italic">Visión</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            Consolidarnos como el super-app líder del Perú y referente en la región, siendo la herramienta principal de inclusión financiera.
          </p>
        </div>
      </section>

      {/* TEAM YAPE */}
      <section className="py-24 px-6 md:px-20 text-center relative">
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#7422ff] rounded-full blur-[120px] opacity-10 -z-10" />
        <h2 className="text-5xl font-black text-[#7422ff] mb-10 italic">Conoce al <span className="text-[#00d1b2]">Team Yape</span></h2>
        <div className="relative max-w-4xl mx-auto aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#7422ff]/30 mb-10">
          <iframe className="w-full h-full" src="https://www.youtube.com/embed/rEgLiaEZ0u4" title="Team Yape" allowFullScreen />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { id: 1, cargo: "Ximena Melchor", vid: "E-tbBfSyWwU" },
            { id: 2, cargo: "Yadira Orihuela", vid: "fOhn5eylCxQ" },
            { id: 3, cargo: "Jaime Ccanto", vid: "h8grbM4Cv18" },
          ].map((item) => (
            <div key={item.id} className="relative h-[300px] sm:h-[400px] rounded-[2rem] overflow-hidden shadow-xl group hover:scale-[1.02] transition">
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${item.vid}`} title={item.cargo} allowFullScreen />
              <div className="absolute inset-0 bg-gradient-to-t from-[#7422ff]/80 to-transparent flex items-end p-6 pointer-events-none">
                <p className="text-white font-black uppercase italic tracking-tighter">{item.cargo}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN: MUJERES EN YAPE (CARRUSEL) */}
      <section className="pt-24 pb-0 bg-white overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 italic tracking-tighter">
            MUJERES EN <span className="text-[#18dbc1]">YAPE</span>
          </h2>
          <div className="w-20 h-1.5 bg-[#7422ff] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 md:px-12">
          <button onClick={() => handleScroll("left")} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white text-[#7422ff] w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center text-xl md:text-2xl border border-gray-100">‹</button>
          <button onClick={() => handleScroll("right")} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white text-[#7422ff] w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center text-xl md:text-2xl border border-gray-100">›</button>

         
          <div ref={scrollMujeresRef} className="flex gap-6 md:gap-8 overflow-x-auto pb-8 hide-scrollbar scroll-smooth px-6 md:px-10">
            {mujeresYape.map((mujer, index) => (
              <div
                key={mujer.id}
                className={`flex-shrink-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 
                ${expandedIndex === index ? 'w-[85vw] md:w-[500px] h-auto md:h-[450px]' : 'w-[260px] md:w-[300px] h-[400px] md:h-[450px]'}`}
              >
                <div className={`flex flex-col md:flex-row h-full`}>
                  {/* Lado imagen */}
                  <div className={`${expandedIndex === index ? 'h-[300px] md:h-full md:min-w-[250px]' : 'h-full w-full'} relative group transition-all duration-700`}>
                    <img src={mujer.img} alt={mujer.nombre} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3b0f52]/90 via-transparent to-transparent" />
                    <div className="absolute bottom-0 p-4 md:p-6 w-full">
                      <h4 className="text-white font-black text-lg md:text-xl leading-tight">{mujer.nombre}</h4>
                      <p className="text-[#18dbc1] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1">{mujer.rol}</p>
                      {expandedIndex !== index && (
                        <button onClick={() => setExpandedIndex(index)} className="mt-4 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/30 text-white text-[8px] md:text-[9px] font-black rounded-full uppercase">Ver más +</button>
                      )}
                    </div>
                  </div>

                  {/* Lado detalle (Responsive: Abajo, Desktop: Derecha) */}
                  {expandedIndex === index && (
                    <div className="p-6 md:p-8 flex flex-col justify-center bg-white animate-slide-in-right w-full relative">
                      <button onClick={() => setExpandedIndex(null)} className="absolute top-4 right-4 text-gray-300"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
                      <h4 className="text-[#7422ff] font-black text-base md:text-xl mb-2 md:mb-3 italic underline decoration-[#18dbc1] decoration-4 underline-offset-4">Su Historia</h4>
                      <p className="text-gray-500 text-xs md:text-base leading-snug font-medium mb-4 md:mb-5">"{mujer.detalle}"</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-[2px] bg-[#18dbc1]"></div>
                        <span className="text-[#3b0f52] font-black text-[9px] md:text-[10px] uppercase italic">Talento Yape</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DATOS GRÁFICOS SOBRE MUJERES (Pegado al carrusel) */}
      <section className="py-12 bg-[#e9fbf9]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-8 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-black text-[#18dbc1]">42%</p>
            <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase mt-2 italic leading-tight">Liderazgo <br className="md:hidden" /> Femenino</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-[#7422ff]">38%</p>
            <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase mt-2 italic leading-tight">Mujeres <br className="md:hidden" /> en Tech</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-[#18dbc1]">50%</p>
            <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase mt-2 italic leading-tight">Equidad <br className="md:hidden" /> en Squads</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-[#7422ff]">+120</p>
            <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase mt-2 italic leading-tight">Roles de <br className="md:hidden" /> Gestión</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS (2x2) */}
      <section className="py-20 bg-[#3b0f52]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-16 italic">Voces del <span className="text-[#25d3c9]">Ecosistema</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {[
              { n: "Andrea V.", r: "Developer", c: "Construimos inclusión financiera real para millones de peruanos." },
              { n: "Ricardo M.", r: "Data Analyst", c: "Los datos aquí cuentan historias que ayudan a los negocios a crecer." },
              { n: "Sofia L.", r: "UX Designer", c: "Diseñar para 15 millones es un reto que motiva a cualquiera." },
              { n: "Mateo S.", r: "Product Owner", c: "La agilidad en Yape no es floro, es nuestra forma de vivir el código." }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10">
                <p className="text-white text-lg md:text-xl leading-relaxed mb-8 italic">"{t.c}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-[#7422ff] to-[#25d3c9] rounded-2xl flex items-center justify-center text-white font-black">{t.n[0]}</div>
                  <div>
                    <p className="text-white font-black text-lg">{t.n}</p>
                    <p className="text-[#25d3c9] text-[10px] font-bold uppercase tracking-widest">{t.r}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out forwards; }

        @media (max-width: 768px) {
          @keyframes slide-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-in-right { animation: slide-in-up 0.5s ease-out forwards; }
        }
      `}} />
    </div>
  );
}