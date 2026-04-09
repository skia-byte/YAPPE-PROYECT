import React from 'react';
import { useFavoritos } from '../context/FavoritosContext';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const FavoritosList = () => {
  const { favoritos, loading, removerDeFavoritos } = useFavoritos();

  if (loading) {
    return <p className="text-center text-gray-500">Cargando favoritos...</p>;
  }

  if (favoritos.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-[#9c2007] mb-4">Mis Favoritos</h2>
        <p className="text-gray-600">Aún no has añadido ningún postre a tus favoritos.</p>
        <Link 
          to="/productos" 
          className="mt-6 inline-block bg-[#d16170] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a34d5f] transition-colors"
        >
          Explorar Postres
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-[#9c2007] mb-8 border-b-2 border-[#f5bfb2] pb-4">
        Mis Favoritos
      </h2>
      {/* --- Rejilla de Favoritos Actualizada --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {favoritos.map(producto => (
          <div key={producto.id} className="relative group bg-white border border-[#f5bfb2] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <Link to={`/productos/${producto.id}`} className="block">
              <div className="w-full aspect-square overflow-hidden rounded-t-2xl">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-semibold text-base md:text-lg text-[#9c2007] truncate">{producto.nombre}</h3>
              </div>
            </Link>
            <button
              onClick={() => removerDeFavoritos(producto.id)}
              className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 text-gray-600 hover:bg-red-500 hover:text-white transition-all duration-300 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              title="Eliminar de favoritos"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritosList;