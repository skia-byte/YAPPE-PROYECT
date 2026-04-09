import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ProductoCard from './ProductoCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductosRecomendados = () => {
  const { id } = useParams();
  const [productosRecomendados, setProductosRecomendados] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState('');
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchProductoActual = async () => {
      if (id) {
        const productoRef = doc(db, "productos", id);
        const productoSnap = await getDoc(productoRef);
        if (productoSnap.exists()) {
          setCategoriaActual(productoSnap.data().categoria);
        }
      }
    };
    fetchProductoActual();
  }, [id]);

  useEffect(() => {
    const fetchProductosRecomendados = async () => {
      if (categoriaActual) {
        const q = query(
          collection(db, "productos"),
          where("categoria", "==", categoriaActual)
        );
        const querySnapshot = await getDocs(q);
        const productos = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(producto => producto.id !== id);
        setProductosRecomendados(productos);
      }
    };

    fetchProductosRecomendados();
  }, [categoriaActual, id]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  if (productosRecomendados.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">También te podría gustar...</h2>
      <div className="relative">
        {/* Botón Izquierdo */}
        <button 
          onClick={() => handleScroll('left')} 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-opacity duration-300 opacity-75 hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={28} className="text-[#d8718c]" />
        </button>

        {/* Contenedor del carrusel */}
        <div 
          ref={scrollContainerRef} 
          className="flex overflow-x-auto gap-6 scrollbar-hide px-4 py-2 scroll-smooth"
        >
          {productosRecomendados.map(producto => (
            <div key={producto.id} className="shrink-0 w-64">
              <ProductoCard producto={producto} />
            </div>
          ))}
        </div>

        {/* Botón Derecho */}
        <button 
          onClick={() => handleScroll('right')} 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-opacity duration-300 opacity-75 hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
        >
          <ChevronRight size={28} className="text-[#d8718c]" />
        </button>
      </div>
    </div>
  );
};

export default ProductosRecomendados;
