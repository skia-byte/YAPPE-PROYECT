import React from 'react';
import { FaStar } from "react-icons/fa";

const RatingSummary = ({ averageRating, totalReviews, starCounts, variant = "full" }) => {
  // Colores de tu marca
  const PINK_COLOR = "#d16170";
  const GRAY_COLOR = "#e4e5e9";

  // Valores seguros
  const safeAverage = averageRating ?? 0;
  const safeTotalReviews = totalReviews ?? 0;
  const safeStarCounts = starCounts || {};

  // Función auxiliar para calcular el porcentaje de la barra
  const getPercentage = (count) => {
    if (!safeTotalReviews || safeTotalReviews === 0) return 0;
    return (count / safeTotalReviews) * 100;
  };

  // 🔹 VARIANTE COMPACT: solo estrellas + texto
  if (variant === "compact") {
    return (
      <div className="bg-white p-4 rounded-2xl w-full flex items-center justify-between gap-4">
        {/* Izquierda: texto de calificaciones */}
        <span className="text-gray-700 text-sm md:text-base font-medium">
          {safeTotalReviews} calificaciones
        </span>

        {/* Derecha: promedio + estrellas */}
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-bold text-[#8f2133]">
            {safeAverage.toFixed(1)}
          </span>
          <div className="flex text-xl md:text-2xl gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                color={i < Math.round(safeAverage) ? PINK_COLOR : GRAY_COLOR}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 🔹 VARIANTE FULL: resumen completo (para inicio/listados)
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mb-12 border border-rose-100 w-full">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        
        {/* LADO IZQUIERDO: Promedio Gigante */}
        <div className="flex flex-col items-center justify-center md:border-r-2 border-rose-100 md:pr-12 min-w-[200px]">
          <span className="text-7xl font-bold text-[#8f2133]">
            {safeAverage.toFixed(1)}
          </span>
          
          <div className="flex text-2xl my-3 gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                color={i < Math.round(safeAverage) ? PINK_COLOR : GRAY_COLOR}
              />
            ))}
          </div>
          
          <span className="text-gray-500 text-lg font-medium">
            {safeTotalReviews} calificaciones
          </span>
        </div>

        {/* LADO DERECHO: Barras de Progreso */}
        <div className="flex-1 w-full space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = safeStarCounts[star] || 0;
            const percent = getPercentage(count);

            return (
              <div key={star} className="flex items-center gap-4">
                {/* Texto "5 estrellas" */}
                <span className="text-sm font-bold text-gray-700 w-20 whitespace-nowrap">
                  {star} {star === 1 ? 'estrella' : 'estrellas'}
                </span>

                {/* Barra Gris de Fondo */}
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  {/* Barra Rosa de Relleno */}
                  <div
                    className="h-full bg-[#d16170] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Porcentaje numérico */}
                <span className="text-sm font-bold text-gray-500 w-10 text-right">
                  {Math.round(percent)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
