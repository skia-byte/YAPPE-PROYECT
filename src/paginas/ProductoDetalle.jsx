import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc, collection, query, where, onSnapshot, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/authContext';
import { useCarrito } from '../context/CarritoContext';
import { ArrowLeft, Edit, Trash2, ShoppingCart, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import RatingSummary from '../componentes/RatingSummary';
import DejarComentario from '../componentes/DejarComentario';
import ProductosRecomendados from '../componentes/ProductosRecomendados';

const COMENTARIOS_PER_PAGE = 4;

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuarioActual: usuario } = useAuth();
  const { agregarAlCarrito, carrito } = useCarrito();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);

  const [comentarios, setComentarios] = useState([]);
  const [loadingComentarios, setLoadingComentarios] = useState(true);
  const [ratingPromedio, setRatingPromedio] = useState(0);
  const [starCounts, setStarCounts] = useState({});
  
  const [editingComment, setEditingComment] = useState({ id: null, texto: '' });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [id]);

  // Cargar producto
  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'productos', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProducto({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('Producto no encontrado');
          setProducto(null);
        }
      } catch (error) {
        console.error('Error al obtener producto:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  // Cargar comentarios
  useEffect(() => {
    if (!id) return;
    setLoadingComentarios(true);
    const q = query(collection(db, 'comentarios'), where('productoId', '==', id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      const sortedComments = commentsData.sort((a, b) => (b.fecha?.toDate() || 0) - (a.fecha?.toDate() || 0));
      setComentarios(sortedComments);

      if (sortedComments.length > 0) {
        const totalRating = sortedComments.reduce((acc, curr) => acc + (curr.rating || 0), 0);
        setRatingPromedio(totalRating / sortedComments.length);
        const counts = sortedComments.reduce((acc, c) => {
          const r = Math.round(c.rating || 0);
          if (r >= 1 && r <= 5) acc[r] = (acc[r] || 0) + 1;
          return acc;
        }, {});
        setStarCounts(counts);
      } else {
        setRatingPromedio(0);
        setStarCounts({});
      }
      setLoadingComentarios(false);
    }, (error) => {
      console.error('Error al obtener comentarios:', error);
      setLoadingComentarios(false);
    });

    return () => unsubscribe();
  }, [id]);
  
  const { paginatedComentarios, totalPages } = useMemo(() => {
    const total = Math.ceil(comentarios.length / COMENTARIOS_PER_PAGE);
    const paginated = comentarios.slice(
        (currentPage - 1) * COMENTARIOS_PER_PAGE,
        currentPage * COMENTARIOS_PER_PAGE
    );
    return { paginatedComentarios: paginated, totalPages: total };
  }, [comentarios, currentPage]);

  const handleAgregarAlCarrito = () => {
    if (producto) agregarAlCarrito(producto, cantidad);
  };
  
  const handleEliminarComentario = async (comentarioId) => {
    if (window.confirm('¿Seguro que quieres eliminar tu comentario?')) {
      try {
        await deleteDoc(doc(db, 'comentarios', comentarioId));
      } catch (error) { console.error('Error al eliminar comentario:', error); }
    }
  };

  const handleActualizarComentario = async () => {
    if (editingComment.texto.trim() === '') return;
    try {
      const comentarioRef = doc(db, 'comentarios', editingComment.id);
      await updateDoc(comentarioRef, { texto: editingComment.texto, editado: serverTimestamp() });
      setEditingComment({ id: null, texto: '' });
    } catch (error) { console.error('Error al actualizar comentario:', error); }
  };

  const cambiarCantidad = (delta) => setCantidad((prev) => Math.max(1, prev + delta));

  if (loading) return <div className="flex justify-center items-center h-screen bg-[#fff9f8]"><Loader className="animate-spin text-[#d16170]" size={40}/></div>;
  if (!producto) return <div className="text-center py-20 bg-[#fff9f8] min-h-screen">Producto no encontrado.</div>;

  const cantidadEnCarrito = carrito.find((item) => item.id === producto.id)?.cantidad || 0;
  const precioFinal = producto.descuento ? producto.precio - (producto.precio * producto.descuento / 100) : producto.precio;

  return (
    <div className="bg-[#fff9f8] min-h-screen">
      <div className="container mx-auto px-4 py-12 sm:py-20">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#d16170] font-semibold mb-8 transition-colors">
          <ArrowLeft size={20} />
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 border border-[#fdeff2] aspect-square overflow-hidden">
            <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover rounded-2xl" />
          </div>

          <div className="flex flex-col gap-5">
            <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-[#8f2133]">{producto.nombre}</h1>
                {producto.frase && <p className="text-lg text-gray-500 mt-2">"{producto.frase}"</p>}
            </div>

            <RatingSummary averageRating={ratingPromedio} totalReviews={comentarios.length} starCounts={starCounts} variant="compact" />
            <p className="text-gray-600 text-base leading-relaxed">{producto.descripcion}</p>
            
            <div className="flex items-baseline gap-4">
                <p className="text-[#d16170] font-bold text-5xl">S/{precioFinal.toFixed(2)}</p>
                {producto.descuento > 0 && <p className="text-gray-400 line-through text-2xl">S/{producto.precio.toFixed(2)}</p>}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <div className="flex items-center justify-center gap-3 bg-white rounded-full px-4 py-2 border-2 border-[#fdeff2]">
                <button onClick={() => cambiarCantidad(-1)} className="text-3xl font-bold text-[#d16170] hover:text-[#b04a5f] transition disabled:opacity-50" disabled={cantidad <= 1}>-</button>
                <span className="text-2xl font-bold text-gray-800 w-10 text-center select-none">{cantidad}</span>
                <button onClick={() => cambiarCantidad(1)} className="text-3xl font-bold text-[#d16170] hover:text-[#b04a5f] transition">+</button>
              </div>
              <button onClick={handleAgregarAlCarrito} className="w-full sm:w-auto flex-grow flex items-center justify-center gap-3 bg-[#8f2133] hover:bg-[#7a1a2e] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-[#d16170]/50">
                <ShoppingCart size={22}/>
                Añadir al Carrito
              </button>
            </div>
            {cantidadEnCarrito > 0 && <p className="text-center sm:text-left text-green-700 font-semibold bg-green-100/80 px-4 py-2 rounded-lg">Ya tienes {cantidadEnCarrito} en tu carrito.</p>}
          </div>
        </div>

        <ProductosRecomendados currentProductId={id} />

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-[#8f2133] mb-8">Opiniones del Producto</h2>
          <DejarComentario productoId={id} />
          <div className="space-y-6 mt-8">
            {loadingComentarios ? <p>Cargando comentarios...</p> : comentarios.length > 0 ? (
              paginatedComentarios.map((comentario) => {
                const puedeGestionar = usuario && (usuario.rol === 'admin' || usuario.uid === comentario.autorId);
                const isEditing = editingComment.id === comentario.id;
                return (
                  <div key={comentario.id} className="bg-white p-5 rounded-2xl shadow-sm border border-[#fdeff2] flex gap-4 items-start">
                    <div className="shrink-0 pt-1">
                       {comentario.autorFotoURL ? <img src={comentario.autorFotoURL} alt={comentario.autorNombre} className="w-11 h-11 rounded-full object-cover"/> : <div className="w-11 h-11 rounded-full bg-[#f4a1a7] flex items-center justify-center text-white font-bold text-xl">{comentario.autorNombre?.charAt(0).toUpperCase() || '#'}</div>}
                    </div>
                    <div className="grow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                        <div>
                          <p className="font-bold text-gray-800">{comentario.autorNombre}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-400">{comentario.fecha?.toDate().toLocaleDateString('es-ES')}</p>
                            {comentario.editado && <p className="text-xs text-gray-400 italic">(editado)</p>}
                          </div>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">{[...Array(5)].map((_, i) => <svg key={i} className={`w-5 h-5 ${i < comentario.rating ? 'text-[#d16170]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.175 0l-3.366 2.446c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" /></svg>)}</div>
                      </div>
                      {isEditing ? (
                        <div>
                          <textarea value={editingComment.texto} onChange={(e) => setEditingComment({ ...editingComment, texto: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg mt-1" rows="3"/>
                          <div className="flex gap-2 mt-2">
                            <button onClick={handleActualizarComentario} className="bg-[#8f2133] text-white px-3 py-1 rounded-md text-sm font-semibold">Guardar</button>
                            <button onClick={() => setEditingComment({ id: null, texto: '' })} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-semibold">Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 mt-2 text-justify italic">"{comentario.texto}"</p>
                      )}
                    </div>
                    {puedeGestionar && !isEditing && (
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => setEditingComment({ id: comentario.id, texto: comentario.texto })} className="text-gray-400 hover:text-blue-600"><Edit size={18}/></button>
                        <button onClick={() => handleEliminarComentario(comentario.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={18}/></button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : <p className="text-center text-gray-500 py-8">Aún no hay opiniones. ¡Sé el primero en comentar!</p>}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 gap-2">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="p-3 rounded-full bg-white text-[#d16170] shadow-md border border-transparent hover:border-[#fdeff2] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex bg-white rounded-full shadow-md border border-[#fdeff2] px-4 py-2 gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-full font-bold transition-colors duration-300 ${
                                currentPage === i + 1
                                ? "bg-[#d16170] text-white"
                                : "text-gray-600 hover:bg-rose-50"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-full bg-white text-[#d16170] shadow-md border border-transparent hover:border-[#fdeff2] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={20} />
                </button>
            </div>
        )}
        </div>
      </div>
    </div>
  );
}
