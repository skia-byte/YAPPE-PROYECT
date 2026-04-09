import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import ProductoCard from "../componentes/ProductoCard";
import incono from "../componentes/img/Bom.png";

const proximamente = [
  {
    id: "p1",
    imagen:
      "https://i.pinimg.com/736x/73/4b/2b/734b2bddac1c16fa597681ed83d17b53.jpg",
  },
  {
    id: "p2",
    imagen:
      "https://i.pinimg.com/736x/de/82/3e/de823e28d3007eda4e34344e53aaf915.jpg",
  },
  {
    id: "p3",
    imagen:
      "https://i.pinimg.com/736x/b5/4b/82/b54b82799dabc0c3b13455e0c51e46c5.jpg",
  },
  {
    id: "p4",
    imagen:
      "https://i.pinimg.com/736x/59/fe/65/59fe65e34318652d0ebeb6cba6b801f0.jpg",
  },
];

const Shape = ({ className }) => (
  <div className={`absolute ${className}`}></div>
);

export default function Novedades() {
  const [productos, setProductos] = useState([]);
  const [postreDelMes, setPostreDelMes] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "productos"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(lista);

      const postre = lista.find((p) => p.postreDelMes === true);
      setPostreDelMes(postre);
    });

    return () => unsubscribe();
  }, []);

  /* --------- 1️⃣ TEMPORADA (NO TOCAR) --------- */
  const productosTemporada = productos.filter(
    (p) => p.categoria === "Temporada"
  );

  /* --------- 2️⃣ FAVORITOS EXACTOS DESDE FIREBASE --------- */
  const nombresFavoritos = [
    "StrawCookie",
    "Tarta Mix",
    "BearPizz",
    "DonaBox",
    "KittyCakes",
  ];

  const favoritos = productos.filter((p) =>
    nombresFavoritos.includes(p.nombre)
  );

  /* --------- RENDER --------- */
  const renderProductos = (
    items,
    { mostrarBoton = true, mostrarFavoritos = true, esEnlace = true } = {}
  ) =>
    items.map((item) => (
      <ProductoCard
        key={item.id}
        producto={item}
        mostrarBoton={mostrarBoton}
        mostrarFavoritos={mostrarFavoritos}
        esEnlace={esEnlace}
      />
    ));

  const renderCarrusel = (
    items,
    { mostrarBoton = true, mostrarFavoritos = true, esEnlace = true } = {}
  ) => (
    <div className="overflow-hidden relative">
      <div className="flex gap-8 animate-scroll">
        {items.concat(items).map((item, index) => (
          <div key={`${item.id}-${index}`} className="w-80 shrink-0">
            <ProductoCard
              producto={item}
              mostrarBoton={mostrarBoton}
              mostrarFavoritos={mostrarFavoritos}
              esEnlace={esEnlace}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute top-0 left-0 w-20 h-full bg-linear-to-r from-[#fff3f0] to-transparent z-10" />
      <div className="pointer-events-none absolute top-0 right-0 w-20 h-full bg-linear-to-l from-[#fff3f0] to-transparent z-10" />
    </div>
  );

  return (
    <div className="bg-[#fff3f0] min-h-screen pb-20">
      <section className="relative w-full min-h-[60vh] md:min-h-[75vh] flex items-center justify-center text-center px-4 py-20 bg-[#d16170] text-white overflow-hidden">
        <Shape className="bg-[#f5bfb2]/30 w-24 h-24 top-20 left-10 animate-pulse-slow" />
        <Shape className="bg-white/20 w-48 h-48 bottom-10 right-10 animate-spin-slow" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
          <div className="hidden lg:block bg-transparent p-3">
            <img
              src={incono}
              alt="Logo Bom Bocado"
              className="w-48 h-48 md:w-64 md:h-64 object-contain"
            />
          </div>
          <div className="max-w-lg text-center lg:text-left">
            <h1
              className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-tight"
              style={{ fontFamily: "serif" }}
            >
              Descubre lo <br />
              <span className="text-[#f5bfb2]">Nuevo</span> y delicioso.
            </h1>
            <p className="mt-6 text-lg text-[#fff3f0] leading-relaxed">
              En <span className="font-semibold text-white">Bom Bocado</span>,
              nos encanta sorprenderte. Explora nuestras últimas creaciones y
              los postres de temporada que hemos preparado con mucho cariño para
              ti.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- POSTRE DEL MES ---------- */}
      {postreDelMes && (
        <section className="py-20 bg-[#fdecdf]">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-12">
            <div>
              <h2 className="text-xl font-semibold text-[#d16170]">
                Postre del Mes
              </h2>
              <h3 className="text-4xl font-bold text-[#9c2007] mt-2">
                {postreDelMes.nombre}
              </h3>
              <p className="mt-4 text-lg text-gray-600">
                {postreDelMes.descripcion}
              </p>

              <Link
                to={`/productos/${postreDelMes.id}`}
                className="inline-block mt-6 bg-[#9c2007] text-white px-8 py-3 rounded-lg"
              >
                Ver más
              </Link>
            </div>

            <img
              src={postreDelMes.imagen}
              alt={postreDelMes.nombre}
              className="rounded-2xl shadow-lg"
            />
          </div>
        </section>
      )}

      {/* ---------- CARRUSELES ---------- */}
      <main className="py-16">
        <div className="max-w-7xl mx-auto space-y-16 px-12">
          {/* 1️⃣ TEMPORADA */}
          <section>
            <h2 className="text-3xl font-bold text-[#9c2007] mb-8">
              Productos de Temporada
            </h2>
            {productosTemporada.length > 4 ? (
              renderCarrusel(productosTemporada)
            ) : (
              <div className="grid grid-cols-4 gap-8">
                {renderProductos(productosTemporada)}
              </div>
            )}
          </section>

          {/* 2️⃣ FAVORITOS EXACTOS */}
          <section>
            <h2 className="text-3xl font-bold text-[#9c2007] mb-8">
              Los favoritos de la casa ♡
            </h2>
            {renderCarrusel(favoritos)}
          </section>

          {/* 3️⃣ PRÓXIMAMENTE (SOLO IMÁGENES) */}
          <section>
            <h2 className="text-3xl font-bold text-[#9c2007] mb-8">
              Próximamente
            </h2>
            {renderCarrusel(proximamente, {
              mostrarBoton: false,
              mostrarFavoritos: false,
              esEnlace: false,
            })}
          </section>
        </div>
      </main>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
}
