import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/authContext";
import { format } from 'date-fns';
import { Edit2, Loader } from 'lucide-react';

const getInitials = (name) => {
    if (!name) return "?";
    const words = name.split(' ');
    if (words.length > 1) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

export default function PerfilForm() {
  const { usuarioActual, actualizarPerfil, cargando: cargandoAuth } = useAuth();

  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (usuarioActual) {
      setNombre(usuarioActual.nombre || '');
      setUsername(usuarioActual.username || '');
      setImagePreview(usuarioActual.fotoURL || null);
    }
  }, [usuarioActual]);

  const handleFileSelect = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Límite de 5MB
    if (file.size > 5 * 1024 * 1024) {
        alert("La imagen es muy grande. El límite es de 5MB.");
        return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await actualizarPerfil({ nombre, username, imageFile });
    } catch (error) {
      // El contexto ya se encarga de mostrar el toast de error
      console.error("Error capturado en el formulario:", error);
    } finally {
      setIsSubmitting(false);
      // Reseteamos el input de archivo para poder seleccionar el mismo otra vez si se desea
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
    }
  };

  if (cargandoAuth || !usuarioActual) {
    return <div className="text-center p-10"><Loader className="animate-spin mx-auto text-rose-500" /></div>;
  }

  const fechaFormateada = usuarioActual.fechaCreacion?.toDate ? format(usuarioActual.fechaCreacion.toDate(), 'dd/MM/yyyy') : 'No disponible';

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col sm:flex-row items-center gap-6 border border-rose-200">
        
        <div className="relative group w-24 h-24 flex-shrink-0">
            {imagePreview ? (
                 <img src={imagePreview} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg" />
            ) : (
                <div className="w-full h-full rounded-full bg-[#d16170] flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white text-4xl font-bold">{getInitials(nombre)}</span>
                </div>
            )}
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
            
            <button 
                type="button" 
                onClick={handleFileSelect}
                disabled={isSubmitting}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               {isSubmitting ? <Loader className="animate-spin"/> : <Edit2 size={24}/>}
            </button>
        </div>

        <div className="text-center sm:text-left w-full overflow-hidden">
          <h2 className="text-xl sm:text-2xl font-bold text-[#7a1a0a] break-words">{usuarioActual.nombre || 'Usuario'}</h2>
          <p className="text-gray-600 break-all">{usuarioActual.correo}</p>
          <div className="text-gray-400 text-sm mt-2 space-y-1">
             <p className="break-all">UID: {usuarioActual.uid}</p>
             <p>Miembro desde: {fechaFormateada}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#f5bfb2] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#7a1a0a] mb-4">Editar perfil</h2>
        <form onSubmit={handleGuardar} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-left">
          
          <div>
            <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-white border border-[#f5bfb2] px-4 py-2.5 rounded-xl"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border border-[#f5bfb2] px-4 py-2.5 rounded-xl"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">Correo</label>
            <input
              type="email"
              value={usuarioActual.correo}
              disabled
              className="w-full bg-gray-100 border border-[#f5bfb2] px-4 py-2.5 rounded-xl cursor-not-allowed"
            />
          </div>

          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#d16170] text-white py-2.5 rounded-xl hover:bg-[#b84c68] transition-colors disabled:bg-gray-400">
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
