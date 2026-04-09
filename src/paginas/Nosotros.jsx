import React from "react";

// Importando imágenes existentes
import Bom from "../componentes/img/Bom.png";
import Buscamos from "../componentes/img/Buscamos.png";
import Centro from "../componentes/img/Centro.png";
import Centro2 from "../componentes/img/Centro2.png";
import Mision from "../componentes/img/Mision.png";
import Vision from "../componentes/img/Vision.jpg";

// Componente para formas decorativas
const Shape = ({ className }) => <div className={`absolute ${className}`}></div>;

export default function Nosotros() {
  return (
    <div className="bg-[#fff3f0] overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[50vh] flex items-center justify-center text-center px-4 py-10 bg-[#d16170] text-white overflow-hidden">
        <Shape className="bg-[#f5bfb2]/30 w-24 h-24 top-20 left-10 animate-pulse-slow" />
        <Shape className="bg-white/20 w-48 h-48 bottom-10 right-10 animate-spin-slow" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
          <div className="hidden lg:block bg-transparent p-3">
            <img
              src={Bom}
              alt="Logo Bom Bocado"
              className="w-64 h-64 md:w-80 md:h-80 object-contain"
            />
          </div>
          <div className="max-w-lg text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-tight" style={{ fontFamily: 'serif' }}>
              Haciendo lo <br />
              <span className="text-[#f5bfb2]">cotidiano</span> mágico.
            </h1>
            <p className="mt-6 text-lg text-[#fff3f0] leading-relaxed">
              En <span className="font-semibold text-white">Bom Bocado</span>, cada postre se prepara con amor, dedicación y los ingredientes más frescos para crear momentos inolvidables.
            </p>
          </div>
        </div>
      </section>

      {/* CINTA DECORATIVA */}
      <div className="bg-[#ee708d] text-white py-4 px-4 text-center text-md md:text-lg font-semibold tracking-widest shadow-inner-strong">
        <p>PASIÓN • CREATIVIDAD • TRADICIÓN • AMOR</p>
      </div>

      {/* NUESTRA HISTORIA */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <h2 className="text-4xl font-bold text-[#df345c] mb-4" style={{ fontFamily: 'serif' }}>Bom Bocado</h2>
            <p className="text-gray-700 text-lg leading-loose">
              Desde nuestros inicios, en <span className="font-semibold text-[#d8718c]">Bom Bocado</span> nos enfocamos en crear postres artesanales que transformen momentos cotidianos en experiencias inolvidables. Cada receta está hecha con pasión, tradición y una pizca de creatividad.
            </p>
             <p className="mt-4 text-lg text-gray-700 leading-loose">
              Únete a nuestra familia de amantes del dulce y descubre por qué cada bocado es un recuerdo especial.
            </p>
          </div>
          <div className="order-1 lg:order-2 h-96 relative group">
             <div className="absolute -top-4 -left-4 w-full h-full bg-[#f5bfb2] rounded-3xl transform rotate-3 transition-transform duration-500 group-hover:rotate-0"></div>
            <img 
              src={Centro2} 
              alt="Nuestra Historia" 
              className="absolute w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* MISIÓN, VISIÓN Y VALORES */}
      <section className="bg-[#d16170] py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold text-[#f5bfb2]" style={{ fontFamily: 'serif' }}>Nuestros Pilares</h2>
            <p className="text-lg text-white mt-4 max-w-2xl mx-auto">Los principios que guían cada una de nuestras creaciones.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {/* MISIÓN CARD */}
            <div className="bg-white rounded-3xl shadow-lg p-6 text-center transform hover:-translate-y-2 transition-transform duration-300 border border-[#f5bfb2] flex flex-col">
              <img src={Mision} alt="Misión" className="w-full h-56 object-cover rounded-2xl mb-5"/>
              <h3 className="text-2xl font-bold text-[#d8718c] mb-3">Nuestra Misión</h3>
              <p className="text-gray-600 leading-relaxed grow">Alegrar a nuestros clientes con postres artesanales, frescos y deliciosos, preparados con pasión, amor y cuidado.</p>
            </div>

            {/* VISIÓN CARD */}
            <div className="bg-white rounded-3xl shadow-lg p-6 text-center transform md:scale-105 hover:scale-110 transition-transform duration-300 border-2 border-[#d8718c] flex flex-col">
              <img src={Vision} alt="Visión" className="w-full h-56 object-cover rounded-2xl mb-5"/>
              <h3 className="text-2xl font-bold text-[#d8718c] mb-3">Nuestra Visión</h3>
              <p className="text-gray-600 leading-relaxed grow">Ser la pastelería peruana que más transmite amor y dedicación en cada creación, llevando el dulce a todos los rincones del país.</p>
            </div>

            {/* VALORES CARD */}
            <div className="bg-white rounded-3xl shadow-lg p-6 text-center transform hover:-translate-y-2 transition-transform duration-300 border border-[#f5bfb2] flex flex-col">
              <img src={Buscamos} alt="Valores" className="w-full h-56 object-cover rounded-2xl mb-5"/>
              <h3 className="text-2xl font-bold text-[#d8718c] mb-3">Nuestros Valores</h3>
              <p className="text-gray-600 leading-relaxed grow">Compromiso, creatividad y pasión en cada detalle. Mantener la esencia artesanal y crear momentos dulces memorables.</p>
            </div>
          </div>
        </div>
      </section>

       {/* GALLERY PREVIEW */}
       <section className="py-20 md:py-28 px-4">
         <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#df345c] mb-4" style={{ fontFamily: 'serif' }}>Un Vistazo a Nuestra Pasión</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">Algunos de los momentos y creaciones que nos llenan de orgullo.</p>
            <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-cover bg-center rounded-2xl shadow-md border-4 border-white" style={{backgroundImage: `url(${Centro})`}}></div>
                <div className="aspect-square bg-cover bg-center rounded-2xl shadow-md border-4 border-white" style={{backgroundImage: `url(${Mision})`}}></div>
                <div className="aspect-square bg-cover bg-center rounded-2xl shadow-md border-4 border-white" style={{backgroundImage: `url(${Buscamos})`}}></div>
                <div className="aspect-square bg-cover bg-center rounded-2xl shadow-md border-4 border-white" style={{backgroundImage: `url(${Centro2})`}}></div>
            </div>
         </div>
       </section>

    </div>
  );
}