import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { db, storage } from "../lib/firebase";
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useAuth } from "../context/authContext";
import toast from 'react-hot-toast';
import { Camera, Send, AlertTriangle, Loader, ArrowLeft } from 'lucide-react';

const inputStyles = "w-full bg-white/70 border-2 border-[#fdd2d7] rounded-lg px-4 py-2.5 text-gray-800 transition-all duration-300 focus:outline-none focus:border-[#d8718c] focus:ring-2 focus:ring-[#d8718c]/50";
const labelStyles = "block text-sm font-semibold text-[#8a152e] mb-1.5";

const CATEGORIAS_PRODUCTOS = ["Pasteles", "Tartas", "Donas", "Cupcakes", "Bombones", "Macarons", "Galletas", "Postres fríos", "Temporada", "Otros"];

export default function FormProductos({ idProductoEditar }) {
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    frase: '',
    precio: '',
    categoria: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const esModoEdicion = !!idProductoEditar;
  const tienePermiso = usuarioActual?.rol === "admin" || usuarioActual?.rol === "editor";

  useEffect(() => {
    const fetchProduct = async () => {
      if (esModoEdicion && tienePermiso) {
        try {
          const docRef = doc(db, "productos", idProductoEditar);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const productData = docSnap.data();
            setFormData({
              nombre: productData.nombre || '',
              descripcion: productData.descripcion || '',
              frase: productData.frase || '',
              precio: productData.precio || '',
              categoria: productData.categoria || '',
            });
            setImagePreview(productData.imagen || '');
          } else {
            toast.error("El producto que intentas editar no existe.");
            navigate('/intranet');
          }
        } catch (err) {
          console.error("Error al cargar el producto:", err);
          toast.error("No se pudo cargar el producto para editar.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [idProductoEditar, navigate, esModoEdicion, tienePermiso]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!tienePermiso) return toast.error("No tienes permiso para realizar esta acción.");
    if (!imagePreview) return setError("Por favor, selecciona una imagen.");
    if (!formData.categoria) return setError("Por favor, selecciona una categoría.");

    setIsSubmitting(true);
    setError(null);
    const toastId = toast.loading(esModoEdicion ? 'Actualizando producto...' : 'Agregando producto...');

    try {
      let imageUrl = imagePreview;
      let oldImageUrl = null;

      if (imageFile) { // Solo si se ha seleccionado UN ARCHIVO NUEVO
        if (esModoEdicion) {
            // Guardamos la URL antigua para borrarla después si la subida es exitosa
            const docRef = doc(db, "productos", idProductoEditar);
            const currentDoc = await getDoc(docRef);
            if (currentDoc.exists()) oldImageUrl = currentDoc.data().imagen;
        }
        const storageRef = ref(storage, `productos/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      
      const dataToSave = { ...formData, precio: Number(formData.precio), imagen: imageUrl };

      if (esModoEdicion) {
        const docRef = doc(db, "productos", idProductoEditar);
        await updateDoc(docRef, { ...dataToSave, fechaActualizacion: serverTimestamp() });
        toast.success("¡Producto actualizado con éxito!", { id: toastId });

        // Si la actualización fue exitosa y se subió una nueva imagen, borramos la antigua
        if (oldImageUrl && oldImageUrl.includes('firebasestorage')) {
            try {
                const oldImageRef = ref(storage, oldImageUrl);
                await deleteObject(oldImageRef);
            } catch (deleteError) {
                console.warn("No se pudo borrar la imagen antigua:", deleteError);
                toast.error("No se pudo borrar la imagen antigua. Puede que ya no exista.", { duration: 5000 });
            }
        }

      } else {
        await addDoc(collection(db, "productos"), { ...dataToSave, fechaCreacion: serverTimestamp(), creadoPor: usuarioActual.uid, disponible: true });
        toast.success("¡Producto agregado con éxito!", { id: toastId });
      }

      navigate('/intranet');

    } catch (err) {
      console.error("Error durante el proceso:", err);
      setError("Hubo un error al guardar el producto.");
      toast.error("Hubo un error al guardar el producto.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tienePermiso) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 border border-rose-100 text-center">
        <h3 className="text-xl font-bold text-[#d16170]">Acceso Denegado</h3>
        <p className="text-gray-600 mt-2">No tienes los permisos necesarios para esta función.</p>
      </div>
    );
  }

  if (isLoading) {
      return <div className="flex justify-center items-center py-10"><Loader className="animate-spin text-[#d16170]" size={32} /> <p className="ml-3">Cargando datos...</p></div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-rose-100">
        <button onClick={() => navigate('/intranet')} className="flex items-center gap-2 text-[#9c2007] font-semibold mb-6 hover:text-[#d16170]">
            <ArrowLeft size={20} />
            Volver a la lista
        </button>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <label className={labelStyles}>Imagen del Producto*</label>
            <div className="aspect-square w-full bg-rose-50 rounded-lg border-2 border-dashed border-[#fdd2d7] flex flex-col items-center justify-center cursor-pointer hover:border-[#d8718c] transition-all overflow-hidden" onClick={() => fileInputRef.current.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-[#d8718c] p-4">
                  <Camera size={40} className="mx-auto" />
                  <p className="text-sm font-semibold mt-2">Haz clic para elegir una imagen</p>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div className="sm:col-span-2">
              <label htmlFor="nombre" className={labelStyles}>Nombre del Producto*</label>
              <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className={inputStyles} placeholder="Ej: Pastel de Chocolate" required />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="frase" className={labelStyles}>Frase Corta*</label>
              <input type="text" id="frase" name="frase" value={formData.frase} onChange={handleChange} className={inputStyles} placeholder="Ej: El clásico que nunca falla" required />
            </div>

            <div>
              <label htmlFor="precio" className={labelStyles}>Precio (S/)*</label>
              <input type="number" id="precio" name="precio" step="0.01" value={formData.precio} onChange={handleChange} className={inputStyles} placeholder="Ej: 45.50" required />
            </div>

            <div>
              <label htmlFor="categoria" className={labelStyles}>Categoría*</label>
              <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} className={inputStyles} required>
                <option value="" disabled>Selecciona una categoría</option>
                {CATEGORIAS_PRODUCTOS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="descripcion" className={labelStyles}>Descripción Detallada*</label>
              <textarea id="descripcion" name="descripcion" rows="5" value={formData.descripcion} onChange={handleChange} className={`${inputStyles} min-h-[120px]`} placeholder="Describe el producto, sus ingredientes, etc." required></textarea>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-3 text-red-700 bg-red-100/80 p-4 rounded-lg border border-red-300">
            <AlertTriangle size={24} />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <div className="mt-10 text-right">
          <button type="submit" disabled={isSubmitting || isLoading} className="inline-flex items-center justify-center gap-2 bg-[#d16170] text-white font-bold py-3 px-10 rounded-lg hover:bg-[#b84c68] transition-colors shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:shadow-none">
            <Send size={18} />
            {isSubmitting ? (esModoEdicion ? 'Actualizando...' : 'Agregando...') : (esModoEdicion ? 'Actualizar Producto' : 'Agregar Producto')}
          </button>
        </div>
      </form>
    </div>
  );
}
