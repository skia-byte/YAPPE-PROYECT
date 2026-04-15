import React, { useState, useEffect } from 'react';
import { db } from "../lib/firebase"; 
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy,
  deleteDoc,
  doc 
} from "firebase/firestore";

const Preguntas = () => {
  const [categorias, setCategorias] = useState(['General', 'Soporte']);
  const [nuevaCat, setNuevaCat] = useState('');
  const [datos, setDatos] = useState([]);
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [catSeleccionada, setCatSeleccionada] = useState('General');

  useEffect(() => {
    const q = query(collection(db, "preguntas"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setDatos(docs);
      
      const catsExistentes = [...new Set(docs.map(d => d.categoria))];
      setCategorias(prev => [...new Set(['General', 'Soporte', ...catsExistentes])]);
    });
    return () => unsubscribe();
  }, []);

  const crearCategoria = (e) => {
    e.preventDefault();
    if (nuevaCat.trim() && !categorias.includes(nuevaCat)) {
      setCategorias([...categorias, nuevaCat.trim()]);
      setCatSeleccionada(nuevaCat.trim());
      setNuevaCat('');
    }
  };

  // --- NUEVAS FUNCIONES DE ELIMINAR ---
  
  const eliminarPregunta = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta pregunta?")) {
      try {
        await deleteDoc(doc(db, "preguntas", id));
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const eliminarCategoriaLocal = (catAEliminar) => {
    // Solo permite eliminar si no hay preguntas asociadas a esa categoría
    const tienePreguntas = datos.some(d => d.categoria === catAEliminar);
    if (tienePreguntas) {
      alert("No puedes eliminar una categoría que tiene preguntas. Elimina primero las preguntas.");
      return;
    }
    setCategorias(categorias.filter(c => c !== catAEliminar));
    if (catSeleccionada === catAEliminar) setCatSeleccionada('General');
  };

  const agregarPregunta = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "preguntas"), {
        categoria: catSeleccionada,
        pregunta,
        respuesta,
        createdAt: new Date()
      });
      setPregunta('');
      setRespuesta('');
    } catch (error) {
      console.error("Error al subir:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        
        <div className="space-y-6">
          {/* Gestión de Categorías */}
          <section className="bg-white p-5 rounded-3xl border border-[#e6d7ff] shadow-sm text-[#4f2f7a]">
            <h3 className="font-bold mb-3 text-sm">1. Gestionar Categorías</h3>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Nueva categoría..." 
                value={nuevaCat}
                onChange={(e) => setNuevaCat(e.target.value)}
                className="flex-1 p-2 rounded-xl border border-[#ece0ff] text-sm focus:outline-none focus:ring-2 focus:ring-[#bd6fe4]"
              />
              <button onClick={crearCategoria} className="bg-[#bd6fe4] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#8f3cbf]">Añadir</button>
            </div>
            {/* Lista de categorías con opción de borrar */}
            <div className="flex flex-wrap gap-2">
              {categorias.map(cat => (
                <span key={cat} className="flex items-center gap-1 bg-[#f7efff] px-3 py-1 rounded-full text-[11px] font-semibold border border-[#ece0ff]">
                  {cat}
                  {cat !== 'General' && (
                    <button onClick={() => eliminarCategoriaLocal(cat)} className="text-red-400 hover:text-red-600 ml-1 font-bold">×</button>
                  )}
                </span>
              ))}
            </div>
          </section>

          {/* Form Subir Pregunta */}
          <section className="bg-[#f7efff] p-6 rounded-3xl border border-[#e6d7ff] shadow-md">
            <h3 className="text-[#4f2f7a] font-bold mb-4">2. Subir Pregunta</h3>
            <form onSubmit={agregarPregunta} className="space-y-4">
              <select 
                value={catSeleccionada}
                onChange={(e) => setCatSeleccionada(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#ece0ff] text-sm bg-white focus:outline-none"
              >
                {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input 
                type="text" 
                placeholder="Pregunta..." 
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#ece0ff] text-sm focus:outline-none"
                required
              />
              <textarea 
                placeholder="Respuesta..." 
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#ece0ff] text-sm h-28 focus:outline-none"
                required
              />
              <button type="submit" className="w-full bg-[#7e1d91] text-white py-3 rounded-xl font-bold hover:bg-[#8f3cbf] transition-all shadow-lg active:scale-95">Guardar en la Nube</button>
            </form>
          </section>
        </div>

        {/* Listado con botón de Eliminar */}
        <div className="bg-white p-6 rounded-4xl border border-[#f0e6ff] min-h-[400px]">
          <h3 className="text-[#4f2f7a] font-bold mb-6">Preguntas Registradas</h3>
          <div className="space-y-6">
            {categorias.map(cat => {
              const preguntasCat = datos.filter(d => d.categoria === cat);
              if (preguntasCat.length === 0) return null;

              return (
                <div key={cat}>
                  <h4 className="text-[#7e1d91] font-bold text-[10px] uppercase tracking-[0.2em] mb-3 bg-[#f7efff] inline-block px-2 py-1 rounded">{cat}</h4>
                  <div className="space-y-3">
                    {preguntasCat.map(item => (
                      <div key={item.id} className="group relative p-4 bg-gray-50 border-l-4 border-[#bd6fe4] rounded-r-2xl hover:bg-white transition-all shadow-sm">
                        <button 
                          onClick={() => eliminarPregunta(item.id)}
                          className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                        >
                          Eliminar
                        </button>
                        <p className="font-bold text-[#4f2f7a] text-sm pr-14">{item.pregunta}</p>
                        <p className="text-gray-600 text-xs mt-2 leading-relaxed">{item.respuesta}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preguntas;