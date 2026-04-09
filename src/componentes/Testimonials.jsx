import React, { useEffect, useState, useMemo } from "react";
import { db, storage } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  addDoc,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  FaStar,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
  FaReply,
} from "react-icons/fa";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

import FiltroComentarios from "./FiltroComentarios";
import RatingSummary from "./RatingSummary";
import FormularioResena from "./FormularioResena";

const PINK_COLOR = "#d16170";
const GRAY_COLOR = "#e4e5e9";
const ITEMS_PER_PAGE = 5;

// --- Componente para el Formulario de Edición (Unificado) ---
const FormularioEdicion = ({ testimonio, onSave, onCancel, onImageAction }) => {
  const [mensaje, setMensaje] = useState(testimonio.mensaje);
  const [estrellas, setEstrellas] = useState(testimonio.estrellas || 0);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingUrls, setExistingUrls] = useState(testimonio.imageUrls || []);
  const [uploading, setUploading] = useState(false);

  const esRespuesta = !!testimonio.parentId;

  const handleSave = async () => {
    if (!mensaje.trim()) return toast.error("El mensaje no puede estar vacío.");
    if (!esRespuesta && estrellas === 0)
      return toast.error("Debes seleccionar una calificación.");

    setUploading(true);
    const loadingToast = toast.loading("Actualizando...");

    try {
      await onSave(
        { ...testimonio, mensaje, estrellas },
        imageFiles,
        existingUrls
      );
      toast.success("Comentario editado", { id: loadingToast });
      onCancel();
    } catch (error) {
      toast.error("Error al actualizar", { id: loadingToast });
      console.error("Error al guardar edición:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSetImageFiles = (files) => {
    setImageFiles(files);
  };

  const handleSetExistingUrls = (urls) => {
    setExistingUrls(urls);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="bg-rose-50 p-4 rounded-xl">
      <h4 className="font-bold text-[#d16170] mb-2">Editando...</h4>
      <textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border border-rose-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#d8718c] bg-white resize-none"
        rows={esRespuesta ? "2" : "3"}
      />

      {!esRespuesta && (
        <>
          <div className="mt-2 flex my-2 justify-center text-3xl">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className="cursor-pointer hover:scale-110"
                color={i < estrellas ? PINK_COLOR : GRAY_COLOR}
                onClick={() => setEstrellas(i + 1)}
              />
            ))}
          </div>
          <div className="my-4 flex flex-wrap gap-2">
            {existingUrls.map((url, i) => (
              <div key={i} className="relative w-16 h-16">
                <img
                  src={url}
                  alt="adjunto"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={() =>
                    onImageAction("remove_existing", url, handleSetExistingUrls)
                  }
                  className="absolute -top-1 -right-1 bg-[#8f2133] text-white rounded-full p-1"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            ))}
            {imageFiles.map((file, i) => (
              <div key={i} className="relative w-16 h-16">
                <img
                  src={URL.createObjectURL(file)}
                  alt="nuevo adjunto"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={() =>
                    setImageFiles((p) => p.filter((_, idx) => i !== idx))
                  }
                  className="absolute -top-1 -right-1 bg-[#8f2133] text-white rounded-full p-1"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            ))}
            <label className="w-16 h-16 flex items-center justify-center bg-white border border-dashed border-rose-300 text-rose-400 rounded-md cursor-pointer hover:bg-rose-100">
              <FaCamera />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  onImageAction("add_new", e.target.files, handleSetImageFiles)
                }
                className="hidden"
              />
            </label>
          </div>
        </>
      )}

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onCancel}
          className="text-gray-600 px-3 py-1 hover:bg-gray-200 rounded"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={uploading}
          className="bg-[#a34d5f] text-white px-4 py-1 rounded hover:bg-[#d16170]"
        >
          {uploading ? "..." : "Guardar"}
        </button>
      </div>
    </div>
  );
};

// --- Componente para un solo Comentario/Testimonio ---
const Comentario = ({
  testimonio,
  onReply,
  onEdit,
  onDelete,
  esModerador,
  usuarioActual,
  onImageClick,
}) => {
  const esAutor = (t) => usuarioActual && usuarioActual.uid === t.userUid;
  const puedeEditarEliminar = (t) => esModerador || esAutor(t);

  return (
    <div
      className={`flex gap-4 sm:gap-6 items-start ${
        testimonio.parentId ? "pt-4" : ""
      }`}
    >
      <div className="shrink-0">
        <img
          src={
            testimonio.fotoURL ||
            `https://ui-avatars.com/api/?name=${testimonio.nombre}&background=f5bfb2&color=9c2007`
          }
          alt={testimonio.nombre}
          className="w-12 h-12 rounded-full object-cover shadow-sm"
        />
      </div>
      <div className="w-full">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-lg text-[#8f2133]">
              {testimonio.nombre}
            </h4>
            <div className="flex items-center gap-3 mt-1">
              {!testimonio.parentId && (
                <div className="flex text-xl">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      color={i < testimonio.estrellas ? PINK_COLOR : GRAY_COLOR}
                    />
                  ))}
                </div>
              )}
              <span className="text-xs text-gray-400">
                {testimonio.createdAt
                  ? new Date(
                      testimonio.createdAt.seconds * 1000
                    ).toLocaleDateString("es-PE")
                  : ""}
              </span>
            </div>
          </div>
          {puedeEditarEliminar(testimonio) && (
            <div className="hidden sm:flex gap-2 shrink-0 ml-4">
              <button
                onClick={() => onEdit(testimonio.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-800 transition-colors text-sm font-semibold"
                title="Editar comentario"
              >
                <FaEdit />
                <span className="hidden sm:inline">Editar</span>
              </button>
              <button
                onClick={() => onDelete(testimonio.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors text-sm font-semibold"
                title="Eliminar comentario"
              >
                <FaTrash />
                <span className="hidden sm:inline">Eliminar</span>
              </button>
            </div>
          )}
        </div>
        <p className="text-gray-700 leading-relaxed mt-3">
          {testimonio.mensaje}
        </p>
        {testimonio.imageUrls && testimonio.imageUrls.length > 0 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {testimonio.imageUrls.map((url, i) => (
              <img
                key={i}
                onClick={() => onImageClick(testimonio.imageUrls, i)}
                src={url}
                alt={`Imagen de testimonio ${i + 1}`}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
              />
            ))}
          </div>
        )}
        {!testimonio.parentId && (
          <div className="mt-3 flex items-center gap-4 sm:block">
            {puedeEditarEliminar(testimonio) && (
              <div className="flex gap-4 sm:hidden">
                <button
                  onClick={() => onEdit(testimonio.id)}
                  className="flex items-center justify-center px-2 py-2 rounded-lg 
                 bg-yellow-100 hover:bg-yellow-200 
                 text-yellow-800 transition-colors"
                  title="Editar"
                  aria-label="Editar"
                >
                  <FaEdit size={14} />
                </button>

                <button
                  onClick={() => onDelete(testimonio.id)}
                  className="flex items-center justify-center px-2 py-2 rounded-lg 
                 bg-red-100 hover:bg-red-200 
                 text-red-700 transition-colors"
                  title="Eliminar"
                  aria-label="Eliminar"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            )}
            <button
              onClick={() => onReply(testimonio.id)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#d16170]"
            >
              <FaReply /> Responder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Componente para el Formulario de Respuesta ---
const FormularioRespuesta = ({
  parentId,
  onCancel,
  onReplied,
  usuarioActual,
}) => {
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return toast.error("Escribe una respuesta.");
    setEnviando(true);
    try {
      await addDoc(collection(db, "testimonios"), {
        mensaje,
        parentId,
        userUid: usuarioActual.uid,
        nombre: usuarioActual.displayName || "Anónimo",
        fotoURL: usuarioActual.fotoURL,
        createdAt: serverTimestamp(),
      });
      toast.success("Respuesta publicada");
      onReplied();
    } catch (error) {
      toast.error("Error al responder");
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form.requestSubmit();
    }
  };

  return (
    <div className="my-4 ml-12 pl-4 border-l-2 border-rose-100">
      <form onSubmit={handleSubmit}>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border border-rose-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#d8718c] bg-white resize-none"
          rows="2"
          placeholder={`Respondiendo...`}
          required
        />
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 px-3 py-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={enviando}
            className="bg-[#a34d5f] text-white px-4 py-1 rounded"
          >
            {enviando ? "..." : "Publicar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default function Testimonials() {
  const { usuarioActual } = useAuth();
  const [testimonios, setTestimonios] = useState([]);
  const [editId, setEditId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [filtro, setFiltro] = useState("recientes");
  const [currentPage, setCurrentPage] = useState(1);
  const [imageViewer, setImageViewer] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  useEffect(() => {
    const q = query(
      collection(db, "testimonios"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) =>
      setTestimonios(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);

  const { nestedTestimonials, ratingSummary } = useMemo(() => {
    const commentMap = {};
    testimonios.forEach((c) => (commentMap[c.id] = { ...c, replies: [] }));
    const nested = [];
    testimonios.forEach((c) => {
      c.parentId && commentMap[c.parentId]
        ? commentMap[c.parentId].replies.push(commentMap[c.id])
        : nested.push(commentMap[c.id]);
    });

    const mainComments = nested.filter((c) => !c.parentId);
    const total = mainComments.length;
    const avg =
      total > 0
        ? mainComments.reduce((acc, t) => acc + t.estrellas, 0) / total
        : 0;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    mainComments.forEach((t) => {
      if (t.estrellas >= 1) counts[t.estrellas]++;
    });
    return {
      nestedTestimonials: nested,
      ratingSummary: {
        totalReviews: total,
        averageRating: avg,
        starCounts: counts,
      },
    };
  }, [testimonios]);

  const testimoniosFiltrados = useMemo(
    () =>
      filtro === "mis-comentarios"
        ? nestedTestimonials.filter(
            (t) => t.userUid === usuarioActual?.uid && !t.parentId
          )
        : nestedTestimonials.filter((t) => !t.parentId),
    [nestedTestimonials, filtro, usuarioActual]
  );
  const paginatedTestimonials = useMemo(
    () =>
      testimoniosFiltrados.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [testimoniosFiltrados, currentPage]
  );
  const totalPages = Math.ceil(testimoniosFiltrados.length / ITEMS_PER_PAGE);

  const esModerador =
    usuarioActual && ["admin", "editor"].includes(usuarioActual.rol);

  const eliminar = async (id) => {
    if (
      !window.confirm(
        "¿Seguro? Si es un comentario, sus respuestas también se borrarán."
      )
    )
      return;
    try {
      const q = query(
        collection(db, "testimonios"),
        where("parentId", "==", id)
      );
      const replies = await getDocs(q);
      const batch = replies.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(batch);
      await deleteDoc(doc(db, "testimonios", id));
      toast.success("Eliminado correctamente");
    } catch {
      toast.error("No se pudo eliminar");
    }
  };

  const guardarEdicion = async (testimonio, newFiles, existingUrls) => {
    const docRef = doc(db, "testimonios", testimonio.id);
    const updateData = {
      mensaje: testimonio.mensaje,
      updatedAt: serverTimestamp(),
    };

    if (!testimonio.parentId) {
      // Es comentario principal
      updateData.estrellas = testimonio.estrellas;
      let finalImageUrls = [...existingUrls];
      if (newFiles.length > 0) {
        for (const file of newFiles) {
          const imgRef = ref(
            storage,
            `testimonios/${testimonio.id}/${Date.now()}-${file.name}`
          );
          await uploadBytes(imgRef, file);
          finalImageUrls.push(await getDownloadURL(imgRef));
        }
      }
      updateData.imageUrls = finalImageUrls;
    }
    await updateDoc(docRef, updateData);
  };

  const handleImageActions = async (action, payload, stateUpdater) => {
    if (action === "remove_existing") {
      if (!window.confirm("¿Eliminar imagen?")) return;
      try {
        await deleteObject(ref(storage, payload));
        const docSnap = await getDoc(doc(db, "testimonios", editId));
        const updatedUrls = docSnap
          .data()
          .imageUrls.filter((u) => u !== payload);
        await updateDoc(doc(db, "testimonios", editId), {
          imageUrls: updatedUrls,
        });
        toast.success("Imagen eliminada");
        stateUpdater(updatedUrls);
      } catch {
        toast.error("Error al eliminar");
      }
    }
    if (action === "add_new") {
      const fileList = Array.from(payload);
      const docSnap = await getDoc(doc(db, "testimonios", editId));
      const currentCount = docSnap.data().imageUrls.length;
      if (currentCount + fileList.length > 5) {
        toast.error("Máximo 5 imágenes.");
        return;
      }
      stateUpdater((prev) => [...prev, ...fileList]);
    }
  };

  // --- Funciones para el Visor de Imágenes ---
  const openImageViewer = (images, index) => {
    document.body.style.overflow = "hidden"; // Evitar scroll del fondo
    setImageViewer({ isOpen: true, images, currentIndex: index });
  };

  const closeImageViewer = () => {
    document.body.style.overflow = "auto";
    setImageViewer({ isOpen: false, images: [], currentIndex: 0 });
  };

  const handleViewerPrev = (e) => {
    e.stopPropagation();
    setImageViewer((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex === 0
          ? prev.images.length - 1
          : prev.currentIndex - 1,
    }));
  };

  const handleViewerNext = (e) => {
    e.stopPropagation();
    setImageViewer((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex === prev.images.length - 1
          ? 0
          : prev.currentIndex + 1,
    }));
  };

  const renderComentarioConAnidacion = (testimonio) => (
    <div
      key={testimonio.id}
      className="bg-white rounded-2xl p-6 shadow-md border-rose-100"
    >
      {editId === testimonio.id ? (
        <FormularioEdicion
          testimonio={testimonio}
          onSave={guardarEdicion}
          onCancel={() => setEditId(null)}
          onImageAction={handleImageActions}
        />
      ) : (
        <Comentario
          testimonio={testimonio}
          onReply={setReplyingTo}
          onEdit={setEditId}
          onDelete={eliminar}
          esModerador={esModerador}
          usuarioActual={usuarioActual}
          onImageClick={openImageViewer}
        />
      )}

      {replyingTo === testimonio.id && (
        <FormularioRespuesta
          parentId={testimonio.id}
          onCancel={() => setReplyingTo(null)}
          onReplied={() => setReplyingTo(null)}
          usuarioActual={usuarioActual}
        />
      )}

      {testimonio.replies && testimonio.replies.length > 0 && (
        <div className="ml-8 border-l-2 border-rose-100 space-y-2">
          {testimonio.replies.map(renderComentarioConAnidacion)}
        </div>
      )}
    </div>
  );

  return (
    <section className="px-6 md:px-12 py-12 bg-[#fff3f0] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-[#8f2133] mb-8 text-center">
          Opiniones de nuestros clientes
        </h2>
        <FormularioResena />
        {ratingSummary.totalReviews > 0 && <RatingSummary {...ratingSummary} />}
        <FiltroComentarios setFiltro={setFiltro} />

        <div id="lista-comentarios" className="space-y-6 mt-6">
          {paginatedTestimonials.map(renderComentarioConAnidacion)}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            {" "}
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-full bg-white text-[#d16170] shadow disabled:opacity-50"
            >
              <FaChevronLeft />
            </button>{" "}
            <div className="flex bg-white rounded-full shadow px-4 py-2 gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-full font-bold transition duration-300 ${
                    currentPage === i + 1
                      ? "bg-[#d16170] text-white"
                      : "text-gray-500"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>{" "}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-full bg-white text-[#d16170] shadow disabled:opacity-50"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* --- Visor de Imágenes --- */}
      {imageViewer.isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={closeImageViewer}
        >
          <button
            onClick={closeImageViewer}
            className="absolute top-6 right-6 text-white text-5xl transition-transform transform hover:scale-110 z-50 filter-[drop-shadow(0_2px_2px_rgb(0_0_0/0.5))] "
            aria-label="Cerrar"
          >
            <FaTimes />
          </button>

          {imageViewer.images.length > 1 && (
            <button
              onClick={handleViewerPrev}
              className="absolute left-4 sm:left-10 text-white text-5xl transition-transform transform hover:scale-110 z-50 filter-[drop-shadow(0_2px_2px_rgb(0_0_0/0.5))]"
              aria-label="Anterior"
            >
              <FaChevronLeft />
            </button>
          )}

          <img
            src={imageViewer.images[imageViewer.currentIndex]}
            alt="Vista ampliada"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {imageViewer.images.length > 1 && (
            <button
              onClick={handleViewerNext}
              className="absolute right-4 sm:right-10 text-white text-5xl transition-transform transform hover:scale-110 z-50 filter-[drop-shadow(0_2px_2px_rgb(0_0_0/0.5))]"
              aria-label="Siguiente"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
