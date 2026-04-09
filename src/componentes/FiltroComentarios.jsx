import React from 'react';
import { FaFilter } from 'react-icons/fa';

const FiltroComentarios = ({ setFiltro, filtroActual }) => {
  return (
    <div className="my-6 flex justify-center sm:justify-end items-center gap-3">
      <label htmlFor="filtro" className="font-medium text-gray-600 flex items-center gap-2 text-sm">
        <FaFilter className="text-gray-400" />
        <span>Filtrar:</span>
      </label>
      <select
        id="filtro"
        value={filtroActual}
        onChange={(e) => setFiltro(e.target.value)}
        className="bg-white border border-gray-300 rounded-full px-4 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f5bfb2] transition duration-200 ease-in-out shadow-sm hover:border-gray-400 cursor-pointer appearance-none"
      >
        <option value="recientes">Recientes</option>
        <option value="mis-comentarios">Mis Comentarios</option>
      </select>
    </div>
  );
};

export default FiltroComentarios;
