import React, { useState } from "react";

export default function Filtros({ filtro, setFiltro, postresNombres = [] }) {
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));

    if (name === "nombre" && value.length > 0) {
      const sugerenciasFiltradas = postresNombres.filter((nombre) =>
        nombre.toLowerCase().includes(value.toLowerCase())
      );
      setSugerencias(sugerenciasFiltradas);
      setMostrarSugerencias(true);
    } else {
      setMostrarSugerencias(false);
    }
  };

  const handleSugerenciaClick = (nombreSugerido) => {
    setFiltro((prev) => ({ ...prev, nombre: nombreSugerido }));
    setMostrarSugerencias(false);
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-end mt-6">
      <div className="relative">
        <input
          type="text"
          name="nombre"
          placeholder="Buscar por nombre..."
          value={filtro.nombre}
          onChange={handleChange}
          onBlur={() => setTimeout(() => setMostrarSugerencias(false), 150)} // Delay para permitir el click
          autoComplete="off"
          className="rounded-lg border border-[#f5bfb2] bg-white p-2 w-56 font-medium text-[#9c2007] placeholder:text-[#d8718c] focus:outline-none focus:ring-2 focus:ring-[#d16170]"
        />
        {mostrarSugerencias && sugerencias.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-[#f5bfb2] rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
            {sugerencias.map((sug, index) => (
              <li
                key={index}
                onMouseDown={() => handleSugerenciaClick(sug)} // onMouseDown para que se dispare antes del onBlur
                className="px-4 py-2 cursor-pointer hover:bg-[#fff3f0] text-[#9c2007]"
              >
                {sug}
              </li>
            ))}
          </ul>
        )}
      </div>

      <select
        name="categoria"
        value={filtro.categoria}
        onChange={handleChange}
        className="cursor-pointer rounded-lg border border-[#f5bfb2] bg-white p-2 font-medium text-[#9c2007] focus:border-[#d16170] focus:outline-none focus:ring-2 focus:ring-[#d16170]"
      >
        <option value="">Todas las categorías</option>
        {[
          "Pasteles",
          "Tartas",
          "Donas",
          "Cupcakes",
          "Bombones",
          "Macarons",
          "Galletas",
          "Postres fríos",
          "Otros",
          "Temporada"
        ].map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="min"
        placeholder="Precio mín."
        value={filtro.min}
        onChange={handleChange}
        className="rounded-lg border border-[#f5bfb2] bg-white p-2 w-32 font-medium text-[#9c2007] placeholder:text-[#d8718c] focus:outline-none focus:ring-2 focus:ring-[#d16170]"
      />

      <input
        type="number"
        name="max"
        placeholder="Precio máx."
        value={filtro.max}
        onChange={handleChange}
        className="rounded-lg border border-[#f5bfb2] bg-white p-2 w-32 font-medium text-[#9c2007] placeholder:text-[#d8718c] focus:outline-none focus:ring-2 focus:ring-[#d16170]"
      />
    </div>
  );
}
