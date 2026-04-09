import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/authContext';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ComprasList() {
  const { usuarioActual } = useAuth();
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // --- Estado de Paginación ---
  const [paginaActual, setPaginaActual] = useState(1);
  const COMPRAS_POR_PAGINA = 2;

  useEffect(() => {
    if (!usuarioActual) {
      setCargando(false);
      return;
    }

    setCargando(true);
    const q = query(collection(db, 'pedidos'), where("userId", "==", usuarioActual.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pedidos = [];
      querySnapshot.forEach((doc) => {
        pedidos.push({ 
          id: doc.id, 
          ...doc.data(),
          fechaCreacion: doc.data().fechaCreacion?.toDate() || null
        });
      });
      setCompras(pedidos.sort((a, b) => b.fechaCreacion - a.fechaCreacion));
      setCargando(false);
    }, (error) => {
      console.error("Error al cargar las compras: ", error);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [usuarioActual]);

  const handleCancelarPedido = async (pedidoId) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar este pedido? No podrás deshacer esta acción.")) {
      try {
        const pedidoRef = doc(db, 'pedidos', pedidoId);
        await updateDoc(pedidoRef, { estado: 'cancelada' });
      } catch (error) {
        console.error("Error al cancelar el pedido:", error);
        alert("Hubo un error al cancelar el pedido.");
      }
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente": return "bg-yellow-100 text-yellow-800";
      case "finalizada": return "bg-green-100 text-green-800";
      case "cancelada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // --- Lógica de Paginación ---
  const totalPaginas = Math.ceil(compras.length / COMPRAS_POR_PAGINA);
  const comprasEnPagina = compras.slice(
    (paginaActual - 1) * COMPRAS_POR_PAGINA,
    paginaActual * COMPRAS_POR_PAGINA
  );

  const Paginacion = () => {
    if (totalPaginas <= 1) return null;

    const handlePrevious = () => paginaActual > 1 && setPaginaActual(paginaActual - 1);
    const handleNext = () => paginaActual < totalPaginas && setPaginaActual(paginaActual + 1);

    const renderPageNumbers = () => {
      const pageNumbers = [];
      const maxPagesToShow = 3;

      let startPage = Math.max(1, paginaActual - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPaginas, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => setPaginaActual(i)}
            className={`mx-1 h-10 w-10 rounded-full font-semibold transition-colors duration-200 ${
              paginaActual === i
                ? 'bg-[#d16170] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-[#f5bfb2] hover:text-[#9c2007]'
            }`}
          >
            {i}
          </button>
        );
      }
      return pageNumbers;
    };

    return (
      <div className="flex items-center justify-center space-x-2 py-8">
        <button onClick={handlePrevious} disabled={paginaActual === 1} className="p-2 rounded-full bg-white text-[#d16170] hover:bg-[#f5bfb2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center bg-white rounded-full px-4 py-1 shadow-inner">
          {renderPageNumbers()}
        </div>
        <button onClick={handleNext} disabled={paginaActual === totalPaginas} className="p-2 rounded-full bg-white text-[#d16170] hover:bg-[#f5bfb2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow">
          <ChevronRight size={24} />
        </button>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-[#9c2007] mb-8 border-b-2 border-[#f5bfb2] pb-4">Mis Compras</h2>

      {cargando ? (
        <p className="text-center text-gray-500">Cargando tus compras...</p>
      ) : compras.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Aún no has realizado ninguna compra.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {comprasEnPagina.map((compra) => {
              const delivery = (compra.totalFinal - compra.subtotal) || 0;
              return (
                <div key={compra.id} className="bg-white rounded-2xl border border-[#f5bfb2] p-4 sm:p-6 shadow-sm transition-all hover:shadow-md">
                   <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-200 pb-3 mb-4">
                     <div>
                       <h3 className="font-bold text-lg text-gray-800">Pedido #{compra.id.substring(0, 7).toUpperCase()}</h3>
                       <p className="text-sm text-gray-500">{compra.fechaCreacion ? format(compra.fechaCreacion, "dd 'de' MMMM, yyyy, h:mm a", { locale: es }) : "Fecha no disponible"}</p>
                     </div>
                     <div className="text-left sm:text-right mt-2 sm:mt-0">
                       <p className="text-xl font-bold text-[#d16170]">Total: S/ {compra.totalFinal?.toFixed(2)}</p>
                       <p className="text-sm text-gray-500">Delivery: S/ {delivery.toFixed(2)}</p>
                     </div>
                   </div>
                   <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 py-2 text-sm">
                     <div className="flex items-center gap-2">
                       <span className="font-medium text-gray-800">Estado:</span>
                       <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${getEstadoColor(compra.estado)}`}>{compra.estado}</span>
                     </div>
                     <p className="text-gray-600"><span className="font-medium text-gray-800">Pago:</span> {compra.metodoPago}</p>
                   </div>
                   <div className="border-t border-gray-200 pt-4 mt-2">
                     <h4 className="font-semibold text-gray-700 mb-3">Productos</h4>
                     <div className="space-y-3">
                       {(compra.items || []).map((item, index) => (
                         <div key={index} className="flex justify-between items-center text-sm">
                           <div className="flex items-center gap-3">
                             {item.imagen && <img src={item.imagen} alt={item.nombre} className="w-12 h-12 rounded-lg object-cover shrink-0"/>}
                             <div>
                               <p className="font-semibold text-gray-800">{item.nombre}</p>
                               <p className="text-xs text-gray-500">Cantidad: {item.cantidad} · Precio: S/ {item.precio?.toFixed(2)}</p>
                             </div>
                           </div>
                           <p className="font-semibold text-gray-800">S/ {(item.cantidad * item.precio).toFixed(2)}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                   {compra.estado === 'pendiente' && (
                     <div className="mt-4 border-t border-[#f5bfb2] pt-4 text-right">
                       <button onClick={() => handleCancelarPedido(compra.id)} className="border border-red-500 text-red-500 bg-transparent px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50">Cancelar Pedido</button>
                     </div>
                   )}
                </div>
              );
            })}
          </div>
          <Paginacion />
        </>
      )}
    </div>
  );
}
