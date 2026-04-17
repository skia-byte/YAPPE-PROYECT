import React, { useState, useEffect } from 'react';
import { db } from "../lib/firebase"; 
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { Send, BookOpen, HelpCircle, PlusCircle, Trash2, ChevronDown, ChevronUp, LayoutGrid } from "lucide-react";

const AdminCentroAyuda = () => {
  // --- ESTADOS FAQs ---
  const [categorias, setCategorias] = useState(['General', 'Soporte']);
  const [nuevaCat, setNuevaCat] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [preguntaFAQ, setPreguntaFAQ] = useState('');
  const [respuestaFAQ, setRespuestaFAQ] = useState('');
  const [catSeleccionada, setCatSeleccionada] = useState('General');
  const [mostrarEditor, setMostrarEditor] = useState(false);

  // --- ESTADOS CONSULTAS ---
  const [consultas, setConsultas] = useState([]);
  const [respuestasUser, setRespuestasUser] = useState({});

  useEffect(() => {
    const unsubFaqs = onSnapshot(query(collection(db, "preguntas"), orderBy("createdAt", "desc")), (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setFaqs(docs);
      const cats = [...new Set(docs.map(d => d.categoria))];
      setCategorias(prev => [...new Set(['General', 'Soporte', ...cats])]);
    });

    const unsubConsultas = onSnapshot(query(collection(db, "consultas"), orderBy("createdAt", "desc")), (snap) => {
      setConsultas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubFaqs(); unsubConsultas(); };
  }, []);

  const agregarFAQ = async (e) => {
    e.preventDefault();
    if(!preguntaFAQ || !respuestaFAQ) return;
    try {
      await addDoc(collection(db, "preguntas"), {
        categoria: catSeleccionada,
        pregunta: preguntaFAQ,
        respuesta: respuestaFAQ,
        createdAt: serverTimestamp()
      });
      setPreguntaFAQ(''); setRespuestaFAQ('');
      alert("¡FAQ Guardada!");
    } catch (e) { console.error(e); }
  };

  const enviarRespuestaUser = async (id) => {
    if (!respuestasUser[id]?.trim()) return;
    await updateDoc(doc(db, "consultas", id), {
      respuesta: respuestasUser[id],
      estado: "resuelto"
    });
    setRespuestasUser({ ...respuestasUser, [id]: "" });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 font-sans text-[#3b0f52]">
      
      {/* --- SECCIÓN 1: EDITOR DESPLEGABLE --- */}
      <section className="bg-white rounded-[35px] shadow-2xl shadow-purple-200/50 border border-purple-50 overflow-hidden">
        <button 
          onClick={() => setMostrarEditor(!mostrarEditor)}
          className="w-full flex items-center justify-between p-8 bg-gradient-to-r from-[#7e1d91] to-[#4f2f7a] text-white transition-all hover:brightness-110"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <BookOpen size={28} />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-black uppercase tracking-tight">Editor de FAQ</h2>
              <p className="text-white/70 text-xs font-bold">Crea y organiza el contenido oficial</p>
            </div>
          </div>
          {mostrarEditor ? <ChevronUp size={30} /> : <ChevronDown size={30} />}
        </button>

        {mostrarEditor && (
          <div className="p-8 grid lg:grid-cols-12 gap-10 animate-in slide-in-from-top-5 duration-300">
            
            {/* Gestión de Categorías (Col 4) */}
            <div className="lg:col-span-4 space-y-6 border-r border-gray-100 pr-6">
              <div className="bg-purple-50/50 p-6 rounded-[2rem]">
                <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <LayoutGrid size={14} /> Categorías
                </h3>
                <div className="flex gap-2 mb-6">
                  <input 
                    type="text" value={nuevaCat} onChange={e => setNuevaCat(e.target.value)}
                    placeholder="Nueva..." className="flex-1 p-3 rounded-xl bg-white border-none ring-1 ring-purple-100 focus:ring-2 focus:ring-[#00d1c4] outline-none text-sm"
                  />
                  <button 
                    onClick={() => {
                      if(nuevaCat && !categorias.includes(nuevaCat)) {
                        setCategorias([...categorias, nuevaCat]);
                        setNuevaCat('');
                      }
                    }}
                    className="bg-[#bd6fe4] text-white p-3 rounded-xl hover:bg-[#7e1d91] transition-colors"
                  >
                    <PlusCircle size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categorias.map(cat => (
                    <span key={cat} className="px-4 py-2 bg-white rounded-full text-[11px] font-black border border-purple-100 shadow-sm flex items-center gap-2">
                      {cat}
                      {cat !== 'General' && <button onClick={() => setCategorias(categorias.filter(c => c !== cat))} className="text-red-400">×</button>}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulario de Pregunta/Respuesta (Col 8) */}
            <form onSubmit={agregarFAQ} className="lg:col-span-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 text-gray-400">Seleccionar Categoría</label>
                  <select 
                    value={catSeleccionada} onChange={e => setCatSeleccionada(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-purple-100 font-bold text-sm focus:ring-2 focus:ring-[#7e1d91] outline-none"
                  >
                    {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 text-gray-400">Título de la Pregunta</label>
                  <input 
                    type="text" placeholder="¿Cómo puedo...?" required
                    value={preguntaFAQ} onChange={e => setPreguntaFAQ(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-purple-100 text-sm focus:ring-2 focus:ring-[#7e1d91] outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase ml-2 text-gray-400">Cuerpo de la Respuesta (Espacio Ampliado)</label>
                <textarea 
                  placeholder="Describe la solución paso a paso..." required
                  value={respuestaFAQ} onChange={e => setRespuestaFAQ(e.target.value)}
                  className="w-full p-6 rounded-[2rem] bg-gray-50 border-none ring-1 ring-purple-100 text-sm h-64 focus:ring-2 focus:ring-[#00d1c4] outline-none leading-relaxed"
                />
              </div>

              <button type="submit" className="w-full py-5 bg-[#00d1c4] text-[#3b0f52] rounded-2xl font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[#00d1c4]/20 transition-all active:scale-[0.98]">
                Publicar en el Centro de Ayuda
              </button>
            </form>
          </div>
        )}
      </section>

      {/* --- SECCIÓN 2: LISTADO DE PREGUNTAS (VISTA PREVIA) --- */}
      <section className="grid lg:grid-cols-12 gap-10">
        
        {/* FAQs Existentes (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-lg font-black flex items-center gap-3">
            <span className="w-2 h-8 bg-[#bd6fe4] rounded-full"></span>
            FAQs Publicadas
          </h3>
          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-4">
            {categorias.map(cat => {
              const items = faqs.filter(f => f.categoria === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} className="space-y-3">
                  <h4 className="text-[10px] font-black text-[#bd6fe4] uppercase tracking-[0.3em] pl-2">{cat}</h4>
                  {items.map(faq => (
                    <div key={faq.id} className="group p-6 bg-white rounded-[2rem] border border-purple-50 shadow-sm hover:shadow-md transition-all relative">
                      <button onClick={async () => { if(window.confirm("¿Borrar?")) await deleteDoc(doc(db, "preguntas", faq.id)) }} 
                        className="absolute top-4 right-4 text-gray-200 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                      <p className="font-black text-[#4f2f7a] text-sm mb-2 pr-8">{faq.pregunta}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{faq.respuesta}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Consultas de Usuarios (Col 5) - Bandeja de entrada */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-lg font-black flex items-center gap-3">
            <span className="w-2 h-8 bg-[#00d1c4] rounded-full"></span>
            Bandeja de Consultas
          </h3>
          <div className="space-y-4">
            {consultas.map(item => (
              <div key={item.id} className={`p-6 rounded-[2.5rem] border-2 transition-all ${item.estado === 'resuelto' ? 'bg-gray-50/50 border-gray-100 opacity-60' : 'bg-white border-purple-100 shadow-xl shadow-purple-500/5'}`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center text-white font-black text-[10px]">
                      {item.usuarioNombre?.charAt(0)}
                    </div>
                    <span className="text-[11px] font-black uppercase text-gray-400">{item.usuarioNombre}</span>
                  </div>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full ${item.estado === 'pendiente' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                    {item.estado}
                  </span>
                </div>
                <p className="font-bold text-[#3b0f52] text-sm mb-4">"{item.pregunta}"</p>
                
                {item.estado === 'pendiente' ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Responder..." 
                      className="flex-1 p-3 bg-gray-50 rounded-xl border-none ring-1 ring-purple-100 text-xs outline-none focus:ring-2 focus:ring-[#00d1c4]"
                      value={respuestasUser[item.id] || ""}
                      onChange={e => setRespuestasUser({...respuestasUser, [item.id]: e.target.value})}
                    />
                    <button onClick={() => enviarRespuestaUser(item.id)} className="bg-[#7e1d91] text-white p-3 rounded-xl hover:scale-105 transition-transform">
                      <Send size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-gray-500 bg-gray-100/50 p-3 rounded-xl border border-dashed border-gray-200">
                    <span className="font-black uppercase text-[8px] block mb-1">Tu respuesta:</span>
                    {item.respuesta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
};

export default AdminCentroAyuda;