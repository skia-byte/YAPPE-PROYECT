import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Ajustes({ isOpen, onClose, user }) {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef();

  // Efecto para cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    // Limpieza al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Efecto para cerrar el menú cuando cambia la ruta
  useEffect(() => {
    if(isOpen) {
      onClose();
    }
  }, [location.pathname]); // Se dispara cada vez que la URL cambia

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose(); 
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleCloseAndNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      ref={ref}
      className={`
        absolute top-full right-0 mt-2 w-72 bg-[#fff3f0] shadow-xl border border-[#f5bfb2] rounded-2xl z-50 p-4 text-left 
        transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
      `}
    >
      <div className="flex flex-row items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#d8718c] shadow-md shrink-0">
          <img
            src={user?.photoURL || "/default-user.png"}
            alt="Foto de perfil"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-base font-semibold text-[#8f2133] leading-tight truncate">
            {user?.displayName || "Usuario"}
          </span>
          <span className="text-sm font-semibold text-[#d8718c] truncate">
            @{user?.username || "username"}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => handleCloseAndNavigate(`/perfil/${user.username}`)}
          className="block w-full text-center px-4 py-2 rounded-xl border-2 border-[#f5bfb2] bg-white hover:bg-[#fdecea] transition-all duration-300 font-semibold text-[#8f2133] text-sm shadow-sm"
        >
          Gestionar Perfil
        </button>
        <button
          onClick={handleLogout}
          className="w-full bg-[#d16170] text-white py-2 rounded-xl hover:bg-[#b84c68] transition-all duration-300 font-semibold text-sm shadow-md"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
