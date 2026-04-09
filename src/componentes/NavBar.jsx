import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { ShoppingCart } from "lucide-react";
import Login from "./Login";
import { useAuth } from "../context/authContext";
import { useCarrito } from "../context/CarritoContext";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { usuarioActual } = useAuth();
  const { totalProductos, setMostrarCarrito } = useCarrito();
  const location = useLocation();

  const puedeVerIntranet = usuarioActual?.rol === "admin" || usuarioActual?.rol === "editor";

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <>
      <header className="bg-[#fdd2d7] border-b border-[#f5bfb2] shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold tracking-wide text-[#da6786]">
            BOM<span className="text-[#8a152e]">BOCADO</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-[#9c2007] font-semibold py-2 hover:text-[#e46945] transition-colors">Inicio</Link>
            <Link to="/productos" className="text-[#9c2007] font-semibold py-2 hover:text-[#e46945] transition-colors">Productos</Link>
            <Link to="/nosotros" className="text-[#9c2007] font-semibold py-2 hover:text-[#e46945] transition-colors">Nosotros</Link>
            <Link to="/novedades" className="text-[#9c2007] font-semibold py-2 hover:text-[#e46945] transition-colors">Novedades</Link>
            {puedeVerIntranet && (
              <Link to="/intranet" className="text-[#9c2007] font-semibold py-2 hover:text-[#e46945] transition-colors">Intranet</Link>
            )}
            <div className="md:mt-0">
              <Login />
            </div>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Ícono de Carrito para Móvil */}
            <button
                onClick={() => setMostrarCarrito(true)}
                className="relative text-[#9c2007]"
                aria-label="Abrir carrito"
            >
                <ShoppingCart size={28} />
                {totalProductos > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#d16170] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#fdd2d7]">
                    {totalProductos}
                </span>
                )}
            </button>

            {/* Botón de Menú Móvil */}
            <button
                onClick={() => setMenuOpen(true)}
                className="text-[#9c2007] text-2xl"
                aria-label="Abrir menú"
            >
                <FaBars size={28} />
            </button>
          </div>
        </div>
      </header>
      
      {/* --- Menú lateral móvil --- */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-[#fff3f0] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
            <div className="flex justify-between items-center mb-8">
                 <Link to="/" className="text-2xl font-extrabold tracking-wide text-[#da6786]">
                    BOM<span className="text-[#8a152e]">BOCADO</span>
                </Link>
                <button
                    onClick={() => setMenuOpen(false)}
                    className="text-[#9c2007] text-2xl"
                    aria-label="Cerrar menú"
                >
                    <FaTimes />
                </button>
            </div>
          
            <nav className="flex flex-col gap-2 text-left">
                <Link to="/" className="text-[#9c2007] font-semibold p-3 rounded-md hover:bg-[#ffe5e0] transition-colors">Inicio</Link>
                <Link to="/productos" className="text-[#9c2007] font-semibold p-3 rounded-md hover:bg-[#ffe5e0] transition-colors">Productos</Link>
                <Link to="/nosotros" className="text-[#9c2007] font-semibold p-3 rounded-md hover:bg-[#ffe5e0] transition-colors">Nosotros</Link>
                <Link to="/novedades" className="text-[#9c2007] font-semibold p-3 rounded-md hover:bg-[#ffe5e0] transition-colors">Novedades</Link>
                {puedeVerIntranet && (
                    <Link to="/intranet" className="text-[#9c2007] font-semibold p-3 rounded-md hover:bg-[#ffe5e0] transition-colors">Intranet</Link>
                )}
                <div className="border-t border-[#f5bfb2] pt-4 mt-4">
                    <Login />
                </div>
            </nav>
        </div>
      </div>
    </>
  );
}
