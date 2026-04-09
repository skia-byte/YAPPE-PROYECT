import React from 'react';
import { useMascot } from '../context/MascotContext';

const Mascot = () => {
  const { mood, message, isVisible } = useMascot();

  if (!isVisible) return null;

  // Clases dinámicas según el estado de ánimo
  let animationClass = "animate-bounce-slow"; // Default: respirando
  let eyeClass = "";
  let mouthClass = "rounded-b-full"; // Sonrisa normal

  switch (mood) {
    case 'excited':
      animationClass = "animate-bounce-fast"; // Saltando rápido
      mouthClass = "h-4 rounded-full"; // Boca abierta :D
      break;
    case 'happy':
      animationClass = "animate-bounce"; 
      break;
    case 'thinking':
      animationClass = "animate-pulse"; 
      eyeClass = "translate-y-[-2px]"; // Mirando arriba
      mouthClass = "w-2 h-2 rounded-full ml-2"; // Boca pequeña 'o'
      break;
    case 'reading':
      animationClass = "rotate-6 translate-x-2"; // Inclinado leyendo
      eyeClass = "translate-x-1"; // Mirando de lado
      break;
    default:
      break;
  }

  return (
    <div className={`fixed bottom-5 right-5 z-[9999] flex flex-col items-center transition-all duration-300 ${animationClass}`}>
      
      {/* Globo de Texto */}
      <div className="mb-2 relative bg-white border-2 border-[#d16170] text-[#7a1a0a] px-4 py-2 rounded-2xl shadow-lg text-sm font-bold text-center max-w-[150px] animate-fade-in-up">
        {message}
        {/* Triangulito del globo */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#d16170]"></div>
      </div>

      {/* --- LA TORTA (Dibujada con CSS) --- */}
      <div className="relative w-24 h-20 cursor-pointer hover:scale-110 transition-transform" onClick={() => alert("¡Hola! Soy Torti 🍰")}>
        
        {/* Decoración: Fresas/Crema arriba */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
            <div className="w-4 h-5 bg-[#ff4d4d] rounded-full border border-[#9c2007]"></div>
            <div className="w-5 h-6 bg-[#fff] rounded-full -mt-1 shadow-sm"></div>
            <div className="w-4 h-5 bg-[#ff4d4d] rounded-full border border-[#9c2007]"></div>
        </div>

        {/* Capa Superior (Glaseado Rosa) */}
        <div className="absolute top-0 w-full h-10 bg-[#ffbfcd] rounded-t-xl z-10 border-b-4 border-[#fff] shadow-sm">
            {/* Ojos */}
            <div className={`absolute top-4 w-full flex justify-center gap-4 ${eyeClass} transition-all`}>
                <div className="w-2 h-2 bg-[#4a3b32] rounded-full animate-blink"></div>
                <div className="w-2 h-2 bg-[#4a3b32] rounded-full animate-blink"></div>
            </div>
            {/* Mejillas */}
            <div className="absolute top-6 w-full flex justify-center gap-8 opacity-40">
                <div className="w-2 h-1 bg-[#ff4d4d] rounded-full"></div>
                <div className="w-2 h-1 bg-[#ff4d4d] rounded-full"></div>
            </div>
        </div>

        {/* Capa Media (Relleno Crema) */}
        <div className="absolute top-8 w-[95%] left-[2.5%] h-6 bg-[#fff3f0] z-0"></div>

        {/* Capa Inferior (Bizcocho) */}
        <div className="absolute bottom-0 w-full h-8 bg-[#f2a6a6] rounded-b-xl border-t-2 border-[#d8718c] flex justify-center items-center">
             {/* Boca */}
             <div className={`w-4 h-2 border-b-2 border-[#4a3b32] transition-all duration-300 ${mouthClass}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Mascot;