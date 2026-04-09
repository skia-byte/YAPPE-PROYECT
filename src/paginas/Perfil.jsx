import { useState } from "react";
import { useAuth } from "../context/authContext";
import PerfilForm from '../componentes/PerfilForm';
import ComprasList from '../componentes/ComprasList';
import FavoritosList from '../componentes/FavoritosList';

export default function Perfil() {
  const { usuarioActual, cargandoAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (cargandoAuth || !usuarioActual) {
    return (
      <div className="min-h-screen bg-[#fff3f0] flex items-center justify-center">
        <p className="text-[#7a1a0a] font-semibold">Cargando tu perfil...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'perfil', label: 'Gestionar Perfil' },
    { id: 'favoritos', label: 'Mis Favoritos' },
    { id: 'compras', label: 'Mis Compras' },
  ];

  const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label;

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return <PerfilForm user={usuarioActual} />;
      case 'favoritos':
        return <FavoritosList />;
      case 'compras':
        return <ComprasList />;
      default:
        return <PerfilForm user={usuarioActual} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fff3f0] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Banner de Bienvenida */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#7a1a0a]">
            ¡Bienvenido a tu Perfil, {usuarioActual.nombre || usuarioActual.username}!
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/4 lg:w-1/5">
            {/* --- Botón de Menú para Móviles --- */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-full flex justify-between items-center text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 bg-[#d16170] text-white shadow-md"
              >
                <span>{activeTabLabel}</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${isMenuOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* --- Navegación --- */}
            <nav className={`flex-col space-y-2 ${isMenuOpen ? 'flex' : 'hidden'} md:flex`}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMenuOpen(false); // Cierra el menú al seleccionar
                  }}
                  className={`text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 w-full ${activeTab === tab.id ? 'bg-[#d16170] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-[#f5bfb2] hover:text-[#9c2007]'}`}>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="md:w-3/4 lg:w-4/5">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}