// Nombre sugerido: FormularioResena.jsx (antes Contacto.jsx)
import React, { useState, useEffect } from "react";
import { FaEnvelope, FaUser, FaCommentDots, FaStar, FaCamera, FaTimes } from "react-icons/fa";
import { db, storage } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/authContext";
import toast from 'react-hot-toast';

export default function FormularioResena() {
  const { usuarioActual } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  useEffect(() => {
    if (usuarioActual) {
      setFormData((prev) => ({
        ...prev,
        nombre: usuarioActual.displayName || "",
        correo: usuarioActual.email || "",
      }));
    }
  }, [usuarioActual]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      if (images.length + fileList.length > 5) {
        toast.error("Puedes subir un máximo de 5 imágenes.");
        return;
      }
      setImages(prev => [...prev, ...fileList]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mensaje") {
      e.target.style.height = "auto";
      e.target.style.height = `${Math.min(e.target.scrollHeight, 250)}px`;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Por favor, selecciona una calificación de estrellas.");
      return;
    }
    if (!formData.nombre || !formData.correo || !formData.mensaje) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading('Enviando tu comentario...');

    try {
      const docRef = await addDoc(collection(db, "testimonios"), {
        nombre: formData.nombre,
        correo: formData.correo,
        mensaje: formData.mensaje,
        estrellas: rating,
        createdAt: serverTimestamp(),
        userUid: usuarioActual?.uid || null,
        fotoURL: usuarioActual?.fotoURL || null, 
        userCorreo: usuarioActual?.email || null,
        imageUrls: [],
      });

      let imageUrls = [];
      if (images.length > 0) {
        toast.loading('Subiendo imágenes...', { id: loadingToast });
        for (const imageFile of images) {
          const imageRef = ref(storage, `testimonios/${docRef.id}/${Date.now()}-${imageFile.name}`);
          await uploadBytes(imageRef, imageFile);
          const url = await getDownloadURL(imageRef);
          imageUrls.push(url);
        }
        await updateDoc(doc(db, "testimonios", docRef.id), { imageUrls });
      }

      toast.success('¡Gracias por tu opinión!', { id: loadingToast });

      setFormData({ nombre: "", correo: "", mensaje: "" });
      setRating(0);
      setHover(0);
      setImages([]);
      const fileInput = document.getElementById("imagenes-testimonio");
      if(fileInput) fileInput.value = null;

    } catch (error) {
      console.error("Error al enviar testimonio:", error);
      toast.error('No se pudo enviar tu comentario.', { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full mb-12">
        <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-[#9c2007]">¿Qué te pareció el producto?</h3>
            <p className="text-gray-600">Déjanos tu opinión para ayudarnos a mejorar.</p>
        </div>

        <form
          aria-label="Formulario de calificación"
          onSubmit={handleSubmit}
          className="bg-white border border-[#f5bfb2] rounded-3xl shadow-xl p-6 md:p-8 space-y-5"
        >
          {/* Fila superior: Nombre y Correo */}
          <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <FaUser className="absolute left-3 top-3.5 text-[#d8718c]" />
                <input type="text" id="nombre" name="nombre" placeholder="Tu nombre" required value={formData.nombre} onChange={handleChange} className="w-full border border-rose-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d8718c] transition" />
              </div>

              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3.5 text-[#d8718c]" />
                <input type="email" id="correo" name="correo" placeholder="Tu correo electrónico" required value={formData.correo} onChange={handleChange} className="w-full border border-rose-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d8718c] transition" />
              </div>
          </div>

          {/* Mensaje */}
          <div className="relative">
            <FaCommentDots className="absolute left-3 top-3.5 text-[#d8718c]" />
            <textarea id="mensaje" name="mensaje" rows="3" placeholder="Escríbenos un mensaje..." required value={formData.mensaje} onChange={handleChange} className="w-full border border-rose-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d8718c] resize-none transition"></textarea>
          </div>

          {/* Calificación y Botón en la misma fila para ahorrar espacio vertical */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
             {/* Imágenes */}
             <div className="w-full md:w-auto">
                 <label htmlFor="imagenes-testimonio" className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 border border-dashed border-rose-200 text-rose-400 rounded-xl cursor-pointer hover:bg-rose-100 hover:text-[#d16170] transition-colors">
                     <FaCamera />
                     <span className="font-semibold text-sm">Añadir fotos</span>
                 </label>
                 <input type="file" id="imagenes-testimonio" multiple accept="image/*" onChange={handleImageChange} className="hidden"/>
             </div>

             {/* Estrellas */}
             <div className="flex items-center gap-2">
                <span className="font-semibold text-[#9c2007]">Tu calificación:</span>
                <div className="flex text-3xl text-gray-300 cursor-pointer">
                {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                    <label key={index}>
                        <input type="radio" name="rating" value={ratingValue} onClick={() => setRating(ratingValue)} className="hidden" />
                        <FaStar color={ratingValue <= (hover || rating) ? "#d16170" : "#e4e5e9"} onMouseEnter={() => setHover(ratingValue)} onMouseLeave={() => setHover(0)} className="transition-transform duration-200 hover:scale-110" />
                    </label>
                    );
                })}
                </div>
             </div>

             {/* Botón */}
             <button type="submit" disabled={uploading} className="w-full md:w-auto bg-[#a34d5f] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#9c2007] transition duration-300 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
              {uploading ? 'Enviando...' : 'Publicar Opinión'}
            </button>
          </div>

          {/* Previsualización de imágenes */}
          {images.length > 0 && (
             <div className="flex flex-wrap gap-3 mt-4">
                 {images.map((file, i) => (
                    <div key={i} className="relative group">
                        <img src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover rounded-lg shadow-md"/>
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <FaTimes size={10}/>
                        </button>
                    </div>
                 ))}
             </div>
           )}
        </form>
    </div>
  );
}