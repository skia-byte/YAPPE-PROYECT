import React, { useState, useEffect } from "react";
import MascotChat from "./MascotChat";
// Importamos la imagen que ya tienes configurada
import mascotaYapeImg from "../img/yape-mascot.png";

const YapeMascot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Función para mostrar la viñeta y ocultarla después de un tiempo
    const mostrarVinieta = () => {
      if (!isOpen) {
        setShowTooltip(true);
        // La oculta automáticamente después de 6 segundos para que no estorbe
        setTimeout(() => setShowTooltip(false), 6000);
      }
    };

    // 1. Sale la primera vez a los 3 segundos de cargar la página
    const primerVistazo = setTimeout(mostrarVinieta, 3000);

    // 2. Se repite ocasionalmente (cada 30 segundos / 30000ms)
    const repetidor = setInterval(mostrarVinieta, 30000);

    return () => {
      clearTimeout(primerVistazo);
      clearInterval(repetidor);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
      {/* 1. DEFINICIÓN DE LAS ANIMACIONES (CSS Puro) */}
      <style>
        {`
          /* Animación de flotar suave (Solo para el Bot + Punto Rosa) */
          @keyframes floatMascot {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); } /* Flotación un poco más sutil */
          }
          .animate-float-mascot {
            animation: floatMascot 3s ease-in-out infinite;
          }

          /* Animación de flotar sincronizada para la burbuja de texto (Misma duración y easing) */
          @keyframes floatTextBubble {
            0%, 100% { transform: scale(1) translateY(0); }
            50% { transform: scale(1) translateY(-12px); } /* Misma distancia que el bot */
          }

          /* Animación de aparición con rebote que luego sigue flotando */
          .balloon-float-pop {
            animation: 
              popIn 0.5s cubic-bezier(0.26, 0.53, 0.74, 1.48) forwards,
              floatTextBubble 3s ease-in-out 0.5s infinite; /* Comienza a flotar 0.5s después */
          }
          
          @keyframes popIn {
            0% { opacity: 0; transform: scale(0.5) translateY(20px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}
      </style>

      {/* Ventana de Chat: Aparece sobre el botón */}
      {isOpen && (
        <div className="mb-4 pointer-events-auto animate-in fade-in zoom-in duration-300 origin-bottom-right">
          <MascotChat onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* --- EL BOTÓN DEL CHAT (SÍNTESIS SIN FONDO CYAN) --- */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false); // Cerramos la viñeta inmediatamente al abrir el chat
        }}
        className="pointer-events-auto flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 bg-transparent border-none p-0 relative"
      >
        {!isOpen && (
          /* 2. CONTENEDOR PADRE RELATIVO (Sin animación de flotar aquí) */
          <div className="relative flex flex-col items-end gap-1">
            {/* 3. VIÑETA DE DIÁLOGO (Tooltip con animación sincronizada) */}
            {showTooltip && (
              <div className="balloon-float-pop bg-white text-[#7422ff] border-2 border-[#b8ffde] px-4 py-2 rounded-2xl rounded-br-none shadow-xl mb-1 mr-4 relative">
                <p className="text-xs font-bold whitespace-nowrap">
                  ¿Buscas tu primera chamba? 💜
                </p>
                {/* Triangulito de la viñeta (bocadillo) */}
                <div className="absolute -bottom-2 right-0 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-white"></div>
              </div>
            )}
            {/* 4. CONTENEDOR DEL BOT + PUNTO ROSA (Aquí va la animación de flotar) */}

            <div className="relative animate-float-mascot">
              {/* Imagen de la Mascota */}
              <img
                src={mascotaYapeImg}
                alt="Mascota de Yape"
                className="w-28 h-28 object-contain"
              />

              {/* CÍRCULO ROSADO DE NOTIFICACIÓN (Anidado en el bot) */}
              <span className="absolute top-2 right-2 flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-pink-500 border-2 border-white"></span>
              </span>
            </div>
          </div>
        )}

        {isOpen && (
          /* Icono X para cerrar (Mismo estilo que tenías) */
          <div className="bg-[#24c091] w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
      </button>

      {/* Sombra de apoyo en el suelo (opcional, para realismo) */}
      {!isOpen && (
        <div className="mr-8 mt-1 w-14 h-2 bg-black/10 rounded-[100%] blur-sm pointer-events-none opacity-80 animate-pulse"></div>
      )}
    </div>
  );
};

export default YapeMascot;
