import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MascotContext = createContext();

export const useMascot = () => useContext(MascotContext);

export const MascotProvider = ({ children }) => {
  // Estados: 'idle', 'happy', 'thinking', 'reading', 'excited'
  const [mood, setMood] = useState('idle');
  const [message, setMessage] = useState('¿Qué se te antoja hoy?');
  const [isVisible, setIsVisible] = useState(true);
  
  const location = useLocation();

  // Reaccionar automáticamente al cambiar de ruta
  useEffect(() => {
    setMood('idle');
    const path = location.pathname;
    
    if (path === '/novedades') {
      triggerAction('thinking', '¿Qué cosita nueva probaremos? 🤔');
    } else if (path === '/productos') {
       triggerAction('happy', '¡Uff, cuántas opciones ricas! 🍰');
    } else if (path === '/checkout') {
       triggerAction('happy', '¡Ya casi es tuyo! 🛒');
    } else if (path.includes('/productos/')) {
       triggerAction('reading', 'Mira los detalles y opiniones 👀');
    } else if (path === '/nosotros') {
       setMessage('¡Conoce nuestra dulce historia! 📖');
    } else {
      setMessage('¿Qué se te antoja hoy?');
    }
  }, [location]);

  const triggerAction = (actionType, customMessage = null) => {
    setMood(actionType);

    if (customMessage) {
        setMessage(customMessage);
    } else {
        switch (actionType) {
            case 'excited': setMessage('¡Siii! ¡Pedido en camino! 🎉'); break;
            case 'reading': setMessage('Interesante... 🤔'); break;
            case 'thinking': setMessage('Déjame pensar...'); break;
            case 'happy': setMessage('¡Qué rico!'); break;
            default: setMessage('¿Qué se te antoja hoy?');
        }
    }

    if (actionType !== 'reading') {
        setTimeout(() => {
          setMood('idle');
          setMessage('¿Qué se te antoja hoy?');
        }, 4000);
    }
  };

  return (
    <MascotContext.Provider value={{ mood, message, isVisible, setIsVisible, triggerAction }}>
      {children}
    </MascotContext.Provider>
  );
};