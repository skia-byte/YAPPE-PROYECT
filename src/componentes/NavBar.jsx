import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Login from "./Login";
import yapeLogo from "./img/Yape-icon.png";
import { useAuth } from "../context/authContext";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { usuarioActual } = useAuth();
  const location = useLocation();

  const puedeVerIntranet =
    usuarioActual?.rol === "admin" || usuarioActual?.rol === "editor";

  const isHome = location.pathname === "/";

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const isWhite = isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isWhite
            ? "bg-white border-b border-slate-200 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div
          className={`max-w-6xl mx-auto px-4 ${
            isHome ? (isScrolled ? "py-1.5" : "py-4") : "py-1.5"
          } flex items-center justify-between`}
        >
          {/* LOGO */}
          <Link to="/" className="flex items-center p-2">
            <img
              src={yapeLogo}
              alt="Yape"
              className={`${
                isHome
                  ? isScrolled
                    ? "w-12 h-12"
                    : "w-20 h-20"
                  : "w-12 h-12"
              } object-contain transition-all duration-300`}
            />
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden lg:flex items-center gap-3 ml-2">
            <Link
              to="/"
              className={`${
                isWhite
                  ? "text-[#42346c] hover:text-[#7e1d91] hover:bg-slate-100"
                  : "text-white hover:bg-white/20"
              } font-semibold py-2 px-4 rounded-full transition`}
            >
              Inicio
            </Link>

            <Link
              to="/productos"
              className={`${
                isWhite
                  ? "text-[#42346c] hover:text-[#7e1d91] hover:bg-slate-100"
                  : "text-white hover:bg-white/20"
              } font-semibold py-2 px-4 rounded-full transition`}
            >
              Productos
            </Link>

            <Link
              to="/nosotros"
              className={`${
                isWhite
                  ? "text-[#42346c] hover:text-[#7e1d91] hover:bg-slate-100"
                  : "text-white hover:bg-white/20"
              } font-semibold py-2 px-4 rounded-full transition`}
            >
              Nosotros
            </Link>

            {puedeVerIntranet && (
              <Link
                to="/intranet"
                className={`${
                  isWhite
                    ? "text-[#42346c] hover:text-[#7e1d91] hover:bg-slate-100"
                    : "text-white hover:bg-white/20"
                } font-semibold py-2 px-4 rounded-full transition`}
              >
                Intranet
              </Link>
            )}
          </nav>

          {/* LOGIN + MENU */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <Login isScrolled={isWhite} />
            </div>

            <button
              onClick={() => setMenuOpen(true)}
              className={`${
                isWhite ? "text-[#42346c]" : "text-white"
              } text-2xl lg:hidden`}
            >
              <FaBars />
            </button>
          </div>
        </div>
      </header>

      {/* overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* menú móvil */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-[#7e1d91] z-50 transform transition ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <img src={yapeLogo} className="w-12" />
            <button onClick={() => setMenuOpen(false)}>
              <FaTimes className="text-white text-2xl" />
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            <Link to="/" className="text-white">Inicio</Link>
            <Link to="/productos" className="text-white">Productos</Link>
            <Link to="/nosotros" className="text-white">Nosotros</Link>

            {puedeVerIntranet && (
              <Link to="/intranet" className="text-white">Intranet</Link>
            )}

            <Login />
          </nav>
        </div>
      </div>
    </>
  );
}