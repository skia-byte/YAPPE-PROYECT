import { useEffect } from 'react';
import ReactDOM from 'react-dom';

// El "portal" donde se renderizarán los modales
const modalRoot = document.getElementById('modal-root');

export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  // Efecto para deshabilitar el scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Usamos ReactDOM.createPortal para renderizar el modal en el div 'modal-root'
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
      // Cierra el modal si se hace clic en el fondo
      onClick={onClose}
    >
      <div
        // Evita que el clic dentro del modal lo cierre
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#fff3f0] rounded-2xl shadow-2xl w-full max-w-md p-8 text-center border border-[#f5bfb2] animate-scale-in"
      >
        {/* Botón para cerrar el modal */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-4 text-3xl text-[#d16170] hover:text-[#b84c68] transition-transform duration-200 hover:scale-110"
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        
        {/* Título del Modal */}
        {title && <h2 className="text-3xl font-bold text-[#8f2133] mb-6">{title}</h2>}
        
        {/* Contenido del Modal */}
        <main className="text-gray-700">
          {children}
        </main>
      </div>

      {/* Animación para la entrada */}
      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
      `}</style>
    </div>,
    modalRoot
  );
}
