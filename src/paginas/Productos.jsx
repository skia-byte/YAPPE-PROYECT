import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import Filtros from "../componentes/Filtros";
import ProductoCard from "../componentes/ProductoCard";
import incono from "../componentes/img/Bom.png";
// Importamos los iconos necesarios para la paginación
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; 

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState({
    nombre: "",
    categoria: "",
    min: "",
    max: "",
  });

  // --- Estados para la Paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // Cantidad de productos por página (puedes cambiar este número)

  // --- Carga de Productos ---
  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("fechaCreacion", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() }));
      setProductos(lista);
    });
    return () => unsubscribe();
  }, []);

  // --- Filtrado de Productos ---
  const productosFiltrados = productos.filter((p) => {
    return (
      (filtro.nombre === "" || p.nombre.toLowerCase().includes(filtro.nombre.toLowerCase())) &&
      (filtro.categoria === "" || p.categoria === filtro.categoria) &&
      (filtro.min === "" || p.precio >= parseFloat(filtro.min)) &&
      (filtro.max === "" || p.precio <= parseFloat(filtro.max))
    );
  });

  // Resetear a la página 1 cuando se cambia un filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [filtro]);

  // --- Lógica de Paginación ---
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productosFiltrados.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(productosFiltrados.length / productsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Opcional: Scrollear hacia arriba al cambiar de página
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const postresNombres = productos.map(p => p.nombre);

  return (
    <div className="bg-[#fff3f0] min-h-screen pb-20">
      {/* --- Header -- */}
      <section className="w-full flex flex-col md:flex-row items-center justify-center bg-[#d16170] text-white">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center py-16 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">Haz tu pedido favorito</h1>
          <p className="text-[#fff3f0] text-lg leading-relaxed max-w-lg px-4">
            En <span className="font-semibold text-[#f5bfb2]">BomBocado</span> cada postre está hecho con dedicación, frescura y amor.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center py-10">
          <img src={incono} alt="Torta decorada" className="w-4/5 md:w-[53%] h-auto object-contain" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12">
        {/* --- Filtros y Título -- */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
          <h2 className="text-3xl font-bold text-[#9c2007] border-b-2 border-[#f5bfb2] pb-2 text-center md:text-left">
            Explora Nuestros Postres
          </h2>
          <div className="shrink-0 w-full md:w-auto">
            <Filtros filtro={filtro} setFiltro={setFiltro} postresNombres={postresNombres} />
          </div>
        </div>

        {/* --- Grid de Productos (Renderizamos currentProducts en lugar de todos) -- */}
        <div className="mt-10">
          {productosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {currentProducts.map((p) => (
                <div key={p.id} className="relative group">
                  <ProductoCard producto={p} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-16 text-lg">
              No se encontraron productos con esos filtros
            </p>
          )}
        </div>

        {/* --- Paginación Solicitada --- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            <button 
              onClick={() => changePage(currentPage - 1)} 
              disabled={currentPage === 1}
              className="p-3 rounded-full bg-white text-[#d16170] shadow hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <FaChevronLeft />
            </button>

            <div className="flex bg-white rounded-full shadow px-4 py-2 gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => changePage(i + 1)}
                  className={`w-10 h-10 rounded-full font-bold transition duration-300 ${
                    currentPage === i + 1 
                    ? "bg-[#d16170] text-white shadow-lg scale-110" 
                    : "text-gray-500 hover:bg-rose-50 hover:text-[#d16170]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => changePage(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="p-3 rounded-full bg-white text-[#d16170] shadow hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}