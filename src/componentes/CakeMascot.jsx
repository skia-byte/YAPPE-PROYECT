import React, { useState, useRef } from 'react';
import { useMascot } from '../context/MascotContext';
import MascotChat from './MascotChat';

const CakeMascot = () => {
  const { mood, message, isVisible, triggerAction } = useMascot();
  
  // Estado para abrir/cerrar el chat
  const [isChatOpen, setIsChatOpen] = useState(false);

  // --- LÓGICA DE ARRASTRE MEJORADA ---
  const [position, setPosition] = useState(null); 
  const [isDragging, setIsDragging] = useState(false);
  const isClick = useRef(true); 

  if (!isVisible) return null;

  // --- LÓGICA DE POSICIONAMIENTO DEL CHAT Y ARRASTRE RESTRINGIDO (4 VIAS) ---
  const CHAT_WIDTH = 300; 
  const CHAT_HEIGHT = 420; 
  const MASCOT_WIDTH = 90; 
  const MASCOT_HEIGHT = 100; // Altura aproximada de la mascota
  const MARGIN = 20;      // Margen de seguridad desde los bordes

  // Obtenemos la posición actual o la inicial por defecto
  const currentLeft = position?.left ?? 40; 
  const currentTop = position?.top ?? (window.innerHeight - 20 - MASCOT_HEIGHT); 

  // --- Lógica Horizontal ---
  let horizontalAnchor = 'anchor-left'; // Default: centrado/ligeramente a la izquierda
  
  // 1. Si está cerca del borde IZQUIERDO, anclar a la DERECHA
  if (currentLeft < (CHAT_WIDTH - MARGIN)) {
    horizontalAnchor = 'anchor-right';
  } 
  
  // 2. Si está cerca del borde DERECHO, anclar a la IZQUIERDA
  // Si la distancia desde el borde derecho es menor que el ancho del chat + margen
  if ((window.innerWidth - (currentLeft + MASCOT_WIDTH)) < (CHAT_WIDTH + MARGIN)) {
    horizontalAnchor = 'anchor-left';
  }


  // --- Lógica Vertical ---
  let verticalAnchor = 'anchor-top'; // Default: arriba

  // 1. Si está cerca del borde SUPERIOR, anclar ABAJO
  if (currentTop < (CHAT_HEIGHT + MARGIN)) {
    verticalAnchor = 'anchor-bottom';
  } 
  
  // 2. Si está cerca del borde INFERIOR, anclar ARRIBA
  // Si la distancia desde el top es mayor que la altura de la ventana menos la altura del chat + margen
  if (currentTop > (window.innerHeight - CHAT_HEIGHT - MARGIN - MASCOT_HEIGHT)) {
    verticalAnchor = 'anchor-top';
  }


  // Clase de anclaje final: Combina anclaje horizontal y vertical
  const chatAnchorClass = `${horizontalAnchor} ${verticalAnchor}`;
  // ------------------------------------------

  // --- Animaciones ---
  let containerAnim = "mascot-float"; 
  let eyeClass = "";
  let mouthClass = "mouth-smile";

  if (isDragging) {
      containerAnim = ""; 
  } else {
      switch (mood) {
        case 'excited': containerAnim = "mascot-jump"; mouthClass = "mouth-open"; break;
        case 'happy': containerAnim = "mascot-bounce"; break;
        case 'thinking': eyeClass = "eyes-look-up"; mouthClass = "mouth-small"; break;
        case 'reading': containerAnim = "mascot-lean"; eyeClass = "eyes-look-right"; break;
        default: break;
      }
  }

  // --- MANEJADORES DE MOUSE (PC) ---
  const handleMouseDown = (e) => {
    e.preventDefault(); 
    isClick.current = true;
    
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const currentMascotWidth = element.offsetWidth;
    const currentMascotHeight = element.offsetHeight;

    setPosition({ left: rect.left, top: rect.top });
    setIsDragging(true);

    const handleMouseMove = (ev) => {
      let newLeft = ev.clientX - offsetX;
      let newTop = ev.clientY - offsetY;
      
      // CLAMPING: Restringir a los límites de la pantalla
      const maxX = window.innerWidth - currentMascotWidth;
      const maxY = window.innerHeight - currentMascotHeight;

      newLeft = Math.max(0, Math.min(newLeft, maxX));
      newTop = Math.max(0, Math.min(newTop, maxY));
      
      setPosition({ left: newLeft, top: newTop });
      isClick.current = false;
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // --- MANEJADORES TÁCTILES (Móvil) ---
  const handleTouchStart = (e) => {
    isClick.current = true;
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const touch = e.touches[0];
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    const currentMascotWidth = element.offsetWidth;
    const currentMascotHeight = element.offsetHeight;

    setPosition({ left: rect.left, top: rect.top });
    setIsDragging(true);

    const handleTouchMove = (ev) => {
      if (ev.cancelable) ev.preventDefault();
      const t = ev.touches[0];

      let newLeft = t.clientX - offsetX;
      let newTop = t.clientY - offsetY;
      
      // CLAMPING: Restringir a los límites de la pantalla
      const maxX = window.innerWidth - currentMascotWidth;
      const maxY = window.innerHeight - currentMascotHeight;

      newLeft = Math.max(0, Math.min(newLeft, maxX));
      newTop = Math.max(0, Math.min(newTop, maxY));

      setPosition({ left: newLeft, top: newTop });
      isClick.current = false;
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
    
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };

  // --- CLIC EN LA MASCOTA ---
  const handleClick = () => {
    if (isClick.current && !isDragging) {
        if (!isChatOpen) {
            setIsChatOpen(true);
        }
    }
  };

  const dynamicStyle = position 
    ? { left: `${position.left}px`, top: `${position.top}px`, bottom: 'auto', right: 'auto', transform: 'none' } 
    : {};

  return (
    <>
      <style>{`
        /* ANIMACIONES */
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        @keyframes jump { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.1); } }
        @keyframes blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.8) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }

        /* CONTENEDOR */
        .mascot-container { 
            position: fixed; bottom: 20px; left: 40px; z-index: 9999; 
            display: flex; flex-direction: column; align-items: center; 
            user-select: none; touch-action: none; 
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2)); cursor: grab;
            transition: transform 0.3s ease;
        }
        .mascot-container:active { cursor: grabbing; }

        .mascot-anim-wrapper { transition: transform 0.3s ease; }
        .mascot-float .mascot-anim-wrapper { animation: float 3s ease-in-out infinite; }
        .mascot-jump .mascot-anim-wrapper { animation: jump 0.6s ease-in-out infinite; }
        .mascot-bounce .mascot-anim-wrapper { animation: float 1s ease-in-out infinite; }
        .mascot-lean .mascot-anim-wrapper { transform: rotate(5deg) translateX(5px); }

        .mascot-bubble {
            background: white; border: 2px solid #e17a8d; color: #8f2133;
            padding: 8px 12px; border-radius: 15px; font-size: 13px; font-weight: bold;
            text-align: center; margin-bottom: 8px; max-width: 160px;
            position: relative; animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 2px 5px rgba(0,0,0,0.1); pointer-events: auto; 
        }
        .mascot-bubble::after {
            content: ''; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);
            border-width: 8px 8px 0; border-style: solid; border-color: #e17a8d transparent transparent transparent;
        }

        /* DIBUJO TORTA */
        .cake-body { width: 90px; height: 75px; position: relative; }
        .cake-body:hover { transform: scale(1.05); }
        .frosting { background: #ffe4e8; height: 35px; width: 100%; border-radius: 10px 10px 0 0; position: absolute; top: 0; z-index: 2; border-bottom: 4px solid #fff; }
        .sponge { background: #e89ba6; height: 40px; width: 100%; border-radius: 0 0 12px 12px; position: absolute; bottom: 0; z-index: 1; border-top: 3px solid #d47f8c; }
        .eyes-container { position: absolute; top: 16px; width: 100%; display: flex; justify-content: center; gap: 14px; z-index: 3; transition: all 0.3s; }
        .eye { width: 8px; height: 8px; background: #5c3a3a; border-radius: 50%; animation: blink 4s infinite; }
        .eyes-look-up { transform: translateY(-3px); }
        .eyes-look-right { transform: translateX(4px); }
        .mouth-container { position: absolute; bottom: 18px; width: 100%; display: flex; justify-content: center; z-index: 3; }
        .mouth-smile { width: 14px; height: 8px; border-bottom: 2px solid #5c3a3a; border-radius: 50%; }
        .mouth-open { width: 12px; height: 12px; background: #5c3a3a; border-radius: 50%; }
        .mouth-small { width: 6px; height: 6px; border: 2px solid #5c3a3a; border-radius: 50%; }
        .strawberry { width: 14px; height: 16px; background: #ff4d4d; border-radius: 50% 50% 10% 10%; position: absolute; top: -8px; z-index: 4; border: 1px solid #cc0000; }
        .s-left { left: 20px; transform: rotate(-15deg); }
        .s-center { left: 38px; top: -12px; z-index: 5; }
        .s-right { right: 20px; transform: rotate(15deg); }
        .cream-dot { width: 10px; height: 10px; background: white; border-radius: 50%; position: absolute; top: -2px; z-index: 3; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
      `}</style>

      <div 
        className={`mascot-container ${containerAnim} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={dynamicStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
      >
        <div className="mascot-anim-wrapper">
            
            {/* RENDERIZADO CONDICIONAL: CHAT O GLOBO */}
            {isChatOpen ? (
                <MascotChat 
                    onClose={() => setIsChatOpen(false)} 
                    triggerAction={triggerAction} 
                    anchorClass={chatAnchorClass} // 👈 Pasa la clase combinada
                />
            ) : (
                <div className="mascot-bubble">
                    {message}
                </div>
            )}

            {/* CUERPO DE LA TORTA */}
            <div className="cake-body">
                <div className="strawberry s-left"></div>
                <div className="strawberry s-center"></div>
                <div className="strawberry s-right"></div>
                <div className="cream-dot" style={{left: '10px'}}></div>
                <div className="cream-dot" style={{right: '10px'}}></div>
                <div className="frosting">
                    <div className={`eyes-container ${eyeClass}`}>
                        <div className="eye"></div>
                        <div className="eye"></div>
                    </div>
                </div>
                <div className="sponge">
                    <div className="mouth-container">
                        <div className={mouthClass}></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default CakeMascot;