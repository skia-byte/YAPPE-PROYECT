import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Modal from '../componentes/Modal';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Usamos useCallback para que la función no se recree innecesariamente
  const mostrarModal = useCallback((newTitle, newContent) => {
    setTitle(newTitle);
    setContent(newContent);
    setIsOpen(true);
  }, []);

  const cerrarModal = () => {
    setIsOpen(false);
    // Reseteamos el contenido para la próxima vez
    setTitle('');
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{ mostrarModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={cerrarModal} title={title}>
        {content}
      </Modal>
    </ModalContext.Provider>
  );
};

// Hook personalizado para un uso más sencillo
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal debe ser usado dentro de un ModalProvider');
  }
  return context;
};
