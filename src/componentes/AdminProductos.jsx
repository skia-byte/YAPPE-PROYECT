import React, { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import {  ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import toast from 'react-hot-toast';
import { Eye, Trash, X, Save, ChevronLeft, ChevronRight, Camera, PlusCircle, AlertTriangle, Send, ChevronDown, Edit } from 'lucide-react';
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";


const CATEGORIAS_PRODUCTOS = ["Pasteles", "Tartas", "Donas", "Cupcakes", "Bombones", "Macarons", "Galletas", "Postres fríos", "Temporada", "Otros"];
const inputStyles = "w-full bg-white/70 border-2 border-[#fdd2d7] rounded-lg px-4 py-2.5 text-gray-800 transition-all duration-300 focus:outline-none focus:border-[#d8718c] focus:ring-2 focus:ring-[#d8718c]/50";
const labelStyles = "block text-sm font-semibold text-[#8a152e] mb-1.5";

const ProductoModal = ({ producto, onClose, onSave, onProductAdded }) => {
  const esNuevo = !producto?.id;
  const [formData, setFormData] = useState(esNuevo ? { nombre: '', descripcion: '', frase: '', precio: '', descuento: '', categoria: '', disponible: true } : { ...producto });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(producto?.imagen || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!esNuevo) {
        setFormData({ ...producto });
        setImagePreview(producto.imagen);
        setImageFile(null);
    }
  }, [producto, esNuevo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (esNuevo && !imageFile) { setError("Debes seleccionar una imagen."); return; }
    if (!formData.categoria) { setError("Debes seleccionar una categoría."); return; }

    setIsSubmitting(true);
    setError(null);
    const toastId = toast.loading(esNuevo ? 'Agregando producto...' : 'Actualizando producto...');

    try {
        let imageUrl = formData.imagen;
        if (imageFile) {
            const storageRef = ref(storage, `productos/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
            if (!esNuevo && producto.imagen) {
                try { 
                    const oldImageRef = ref(storage, producto.imagen);
                    await deleteObject(oldImageRef); 
                } catch (e) { 
                    console.warn("No se pudo borrar imagen antigua (puede que no existiera):", e); 
                }
            }
        }

        const data = {
            ...formData,
            precio: parseFloat(formData.precio) || 0,
            descuento: parseInt(formData.descuento, 10) || 0,
            imagen: imageUrl,
        };

        if (esNuevo) {
            await addDoc(collection(db, 'productos'), { ...data, fechaCreacion: serverTimestamp() });
            toast.success('¡Producto agregado!', { id: toastId });
            if(onProductAdded) onProductAdded();
        } else {
            const { id, ...dataToUpdate } = data;
            await updateDoc(doc(db, "productos", id), dataToUpdate);
            toast.success('Producto actualizado', { id: toastId });
            if(onSave) onSave();
        }
        onClose();
    } catch (err) {
        console.error("Error:", err);
        setError("Ocurrió un error. Inténtalo de nuevo.");
        toast.error('Error al guardar', { id: toastId });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto de forma permanente?')) return;

    const toastId = toast.loading('Eliminando producto...');
    try {
        if (producto.imagen) {
            const imageRef = ref(storage, producto.imagen);
            await deleteObject(imageRef);
        }
        await deleteDoc(doc(db, 'productos', producto.id));
        toast.success('Producto eliminado', { id: toastId });
        onClose();
    } catch (err) {
        console.error("Error al eliminar:", err);
        toast.error('No se pudo eliminar el producto.', { id: toastId });
    }
  };


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-[#fffcfc] rounded-3xl shadow-2xl border border-rose-100/50 max-w-4xl w-full max-h-[95vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 relative border-b-2 border-rose-100/80">
            <h2 className="text-2xl font-bold text-[#8f2133]">{esNuevo ? 'Agregar Nuevo Producto' : 'Editar Producto'}</h2>
            <p className="text-sm text-gray-500">{esNuevo ? 'Rellena los campos para registrar un nuevo ítem.' : 'Modifica los detalles del producto.'}</p>
            <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-white hover:bg-red-400 rounded-full p-1.5 transition-all" aria-label="Cerrar"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-rose-200 scrollbar-track-rose-50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <label className={labelStyles}>Imagen del Producto*</label>
                    <div className="aspect-square w-full bg-white/80 rounded-lg border-2 border-dashed border-[#fdd2d7] flex flex-col items-center justify-center cursor-pointer hover:border-[#d8718c] transition-all relative" onClick={() => fileInputRef.current.click()}>
                        {imagePreview ? <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover rounded-md" /> : <div className="text-center text-[#d8718c]"><Camera size={40} className="mx-auto" /><p className="text-sm font-semibold mt-2">Elegir Imagen</p></div>}
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md"><p className='text-white font-bold flex items-center gap-2'><Camera/> Cambiar</p></div>
                    </div>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="sm:col-span-2"><label htmlFor="nombre" className={labelStyles}>Nombre*</label><input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className={inputStyles} placeholder="Ej: Torta de Chocolate" required /></div>
                    <div><label htmlFor="precio" className={labelStyles}>Precio (S/)*</label><input type="number" id="precio" name="precio" step="0.01" value={formData.precio} onChange={handleChange} className={inputStyles} placeholder="Ej: 45.50" required /></div>
                    <div><label htmlFor="descuento" className={labelStyles}>Descuento (%)</label><input type="number" id="descuento" name="descuento" value={formData.descuento || ''} onChange={handleChange} className={inputStyles} placeholder="Ej: 10" /></div>
                    <div className="sm:col-span-2"><label htmlFor="categoria" className={labelStyles}>Categoría*</label><select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} className={inputStyles} required><option value="" disabled>Selecciona...</option>{CATEGORIAS_PRODUCTOS.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                    <div className="sm:col-span-2"><label htmlFor="frase" className={labelStyles}>Frase</label><input id="frase" name="frase" value={formData.frase} onChange={handleChange} className={inputStyles} placeholder="Ej: 'El más chocolatoso'"/></div>
                    <div className="sm:col-span-2"><label htmlFor="descripcion" className={labelStyles}>Descripción</label><textarea id="descripcion" name="descripcion" rows="4" value={formData.descripcion} onChange={handleChange} className={`${inputStyles} min-h-[100px]`} placeholder="Describe el producto..."></textarea></div>
                    
                </div>
            </div>
            {error && <div className="mt-6 flex items-center gap-3 text-red-700 bg-red-100/80 p-4 rounded-lg border border-red-300"><AlertTriangle size={24} /><p className="font-semibold">{error}</p></div>}
        </form>

        <div className="p-4 bg-white/30 border-t-2 border-rose-100/80 flex justify-between items-center">
            <div>
                {!esNuevo && <button onClick={handleDelete} className="flex items-center gap-2 text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-red-100 transition-colors"><Trash size={16}/> Eliminar</button>}
            </div>
            <div className='flex items-center gap-4'>
                <button onClick={onClose} className="text-gray-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">Cancelar</button>
                <button onClick={handleSubmit} disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 bg-[#d8718c] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#c25a75] transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"><Send size={18} /> {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</button>
            </div>
        </div>
      </div>
    </div>
  );
};

const AdminProductos = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriaFiltro, setCategoriaFiltro] = useState("");
    const productosPorPagina = 10;
  
    useEffect(() => {
      const q = query(collection(db, "productos"), orderBy("nombre", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setProductos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCargando(false);
      }, () => setCargando(false));
      return () => unsubscribe();
    }, []);

    // Efecto para bloquear el scroll del body cuando el modal está abierto
    useEffect(() => {
        if (modalOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        // Función de limpieza para asegurarse de que la clase se elimine si el componente se desmonta
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [modalOpen]);
  
    const openModalForNew = () => { setSelectedProduct(null); setModalOpen(true); };
    const openModalForEdit = (producto) => { setSelectedProduct(producto); setModalOpen(true); };
    const closeModal = () => { setModalOpen(false); setSelectedProduct(null); };

    const handleDelete = async (id, imagenUrl) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    
        const toastId = toast.loading('Eliminando producto...');
        try {
            if (imagenUrl) {
                const imageRef = ref(storage, imagenUrl);
                await deleteObject(imageRef).catch(err => {
                    console.warn("No se pudo eliminar la imagen o no existía:", err);
                });
            }
            await deleteDoc(doc(db, "productos", id));
            toast.success("Producto eliminado.", { id: toastId });
        } catch (error) {
          console.error("Error al eliminar producto:", error);
          toast.error("No se pudo eliminar el producto.", { id: toastId });
        }
    };
  
    const productosFiltrados = productos.filter(p => categoriaFiltro ? p.categoria === categoriaFiltro : true);
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    const indexInicio = (currentPage - 1) * productosPorPagina;
    const indexFin = indexInicio + productosPorPagina;
    const productosPaginados = productosFiltrados.slice(indexInicio, indexFin);

    const Paginacion = () => (
        totalPaginas > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-3 rounded-full bg-white text-[#d16170] shadow-md hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <ChevronLeft />
                </button>
                <div className="flex bg-white rounded-full shadow-md px-4 py-2 gap-2">
                    {[...Array(totalPaginas)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
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
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPaginas}
                    className="p-3 rounded-full bg-white text-[#d16170] shadow-md hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <ChevronRight />
                </button>
            </div>
        )
    );
  
    return (
      <div className="bg-[#fff3f0] rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 border border-[#f5bfb2] min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#9c2007]">Gestión de Productos</h2>
                <p className="text-sm text-gray-600 mt-1">Total: <span className="font-semibold">{productosFiltrados.length}</span> productos</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <select value={categoriaFiltro} onChange={e => { setCategoriaFiltro(e.target.value); setCurrentPage(1); }} className="appearance-none w-full sm:w-auto bg-white border-2 border-[#f5bfb2] text-gray-700 font-semibold py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:border-[#d16170] transition">
                        <option value="">Todas las categorías</option>
                        {CATEGORIAS_PRODUCTOS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <button onClick={openModalForNew} className="shrink-0 flex items-center gap-2 bg-[#d8718c] text-white font-bold py-2.5 px-5 rounded-lg hover:bg-[#c25a75] transition-colors shadow-md"><PlusCircle size={20} /> Agregar</button>
            </div>
        </div>
  
        {cargando ? <div className="py-10 text-center text-gray-500">Cargando productos...</div> : 
        productosPaginados.length === 0 ? <p className="text-center text-gray-500 py-8">No hay productos para mostrar en esta categoría.</p> : 
        <>
            {/* Vista Móvil Mejorada */}
            <div className="lg:hidden space-y-4">
            {productosPaginados.map((producto) => (
                <div key={producto.id} className="bg-white shadow-lg rounded-2xl border-2 border-[#fde5e8] overflow-hidden">
                    <div className="p-4 flex gap-4">
                        <img src={producto.imagen} alt={producto.nombre} className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border-2 border-[#fde5e8] shrink-0"/>
                        <div className="flex-1">
                            <p className="font-bold text-[#9c2007] text-lg leading-tight">{producto.nombre}</p>
                            <p className="text-[#d16170] font-bold text-xl my-1">S/{producto.precio?.toFixed(2)}</p>
                            <div className='flex items-center gap-2 flex-wrap mt-2'>
                               <span className="inline-block bg-[#fff3f0] text-[#9c2007] px-2.5 py-1 rounded-full text-xs font-semibold">{producto.categoria}</span>
                               {producto.descuento > 0 && <span className="inline-block bg-green-200 text-green-800 px-2.5 py-1 rounded-full text-xs font-bold">-{producto.descuento}%</span>}
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50/70 border-t-2 border-[#fde5e8] p-3 flex justify-end items-center gap-3">
                        <button onClick={() => openModalForEdit(producto)} className="flex items-center gap-2 text-sm bg-white border-2 border-[#d16170] text-[#d16170] font-bold py-1.5 px-4 rounded-lg hover:bg-[#d16170] hover:text-white transition-all" title="Editar">
                            <FaEdit /> Editar
                        </button>
                        <button onClick={() => handleDelete(producto.id, producto.imagen)} className="flex items-center gap-2 text-sm bg-red-500 border-2 border-red-500 text-white font-bold py-1.5 px-4 rounded-lg hover:bg-red-600 transition-all" title="Eliminar">
                            <FaTrash /> Eliminar
                        </button>
                    </div>
                </div>
            ))}
            </div>
    
            {/* Vista Desktop (Sin cambios) */}
            <div className="hidden lg:block border-2 border-[#f5bfb2] rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                <table className="min-w-full w-full divide-y divide-[#f5bfb2]">
                    <thead className="bg-[#d16170]/90 text-white sticky top-0 backdrop-blur-sm">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase">Imagen</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase">Nombre</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase">Precio</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase">Descuento</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase">Categoría</th>
                        <th className="px-6 py-4 text-center text-sm font-bold uppercase">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#fde5e8]">
                    {productosPaginados.map((producto) => (
                        <tr key={producto.id} className="hover:bg-[#fff3f0] transition">
                            <td className="px-6 py-3"><img src={producto.imagen} alt={producto.nombre} className="w-14 h-14 rounded-lg object-cover border-2 border-[#f5bfb2]"/></td>
                            <td className="px-6 py-3 text-sm align-middle"><span className="font-semibold text-[#9c2007]">{producto.nombre}</span></td>
                            <td className="px-6 py-3 text-sm align-middle"><span className="font-bold text-[#d16170] text-base">S/{Number(producto.precio || 0).toFixed(2)}</span></td>
                            <td className="px-6 py-3 text-sm align-middle">
                                {producto.descuento > 0 ? <span className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-bold">{producto.descuento}%</span> : <span className="text-gray-400">—</span>}
                            </td>
                            <td className="px-6 py-3 text-sm align-middle"><span className="inline-block bg-[#fff3f0] text-[#9c2007] px-3 py-1 rounded-full text-xs font-semibold">{producto.categoria}</span></td>
                            <td className="px-6 py-3 text-center align-middle">
                                <div className="flex gap-3 justify-center">
                                    <button onClick={() => openModalForEdit(producto)} className="bg-[#d16170] hover:bg-[#b84c68] text-white p-2 rounded-lg transition" title="Editar"><FaEdit /></button>
                                    <button onClick={() => handleDelete(producto.id, producto.imagen)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition" title="Eliminar"><FaTrash /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            <Paginacion />
        </>
        }
  
        {modalOpen && <ProductoModal producto={selectedProduct} onClose={closeModal} onSave={closeModal} onProductAdded={closeModal} />}
  
        {typeof window !== 'undefined' && (
            <style jsx global>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
            `}</style>
        )}
      </div>
    );
  };
  
  export default AdminProductos;
