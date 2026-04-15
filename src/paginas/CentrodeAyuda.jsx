import React, { useState, useEffect } from 'react';
import { db } from "../lib/firebase"; 
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Search, ChevronDown, MessageCircle } from "lucide-react"; // Usando lucide que ya vi que tienes

export default function CentrodeAyuda() {
  const [preguntas, setPreguntas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [catActiva, setCatActiva] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [abiertoId, setAbiertoId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "preguntas"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPreguntas(docs);
      const cats = ['Todas', ...new Set(docs.map(p => p.categoria))];
      setCategorias(cats);
    });
    return () => unsubscribe();
  }, []);

  const filtrados = preguntas.filter(p => {
    const matchBusqueda = p.pregunta?.toLowerCase().includes(busqueda.toLowerCase());
    const matchCat = catActiva === 'Todas' || p.categoria === catActiva;
    return matchBusqueda && matchCat;
  });

  return (
    <div className="bg-[#fcfaff] min-h-screen font-sans">
      {/* BANNER DINÁMICO */}
      <section className="bg-gradient-to-r from-[#3b0f52] to-[#7e1d91] py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d1c4] opacity-10 rounded-full -mr-20 -mt-20"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter">
            Centro de <span className="text-[#00d1c4]">Ayuda</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">¿Tienes dudas? Estamos aquí para que todo fluya.</p>
          
          <div className="max-w-2xl mx-auto relative px-4">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-[#7e1d91]" size={20} />
            <input 
              type="text"
              placeholder="Escribe tu duda aquí..."
              className="w-full py-4 pl-14 pr-6 rounded-2xl bg-white shadow-xl focus:ring-4 focus:ring-[#00d1c4]/30 outline-none text-[#3b0f52]"
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto py-12 px-4">
        {/* CATEGORÍAS */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCatActiva(cat)}
              className={`px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                catActiva === cat 
                ? 'bg-[#00d1c4] text-[#3b0f52] shadow-lg shadow-cyan-200' 
                : 'bg-white text-[#7e1d91] border border-purple-100 hover:bg-purple-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LISTA DE PREGUNTAS */}
        <div className="space-y-4">
          {filtrados.length > 0 ? (
            filtrados.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-[24px] border border-purple-50 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <button 
                  onClick={() => setAbiertoId(abiertoId === item.id ? null : item.id)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className="font-black text-[#3b0f52] text-lg pr-4">{item.pregunta}</span>
                  <ChevronDown 
                    className={`text-[#7e1d91] transition-transform duration-300 ${abiertoId === item.id ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {abiertoId === item.id && (
                  <div className="px-6 pb-6 text-[#6b4a88] font-medium leading-relaxed animate-in fade-in slide-in-from-top-2">
                    <div className="h-[2px] bg-[#fcfaff] mb-4"></div>
                    {item.respuesta}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 opacity-50">
              <Search size={48} className="mx-auto mb-4 text-[#7e1d91]" />
              <p className="font-black uppercase tracking-widest text-sm">No hay resultados</p>
            </div>
          )}
        </div>

        {/* CONTACTO EXTRA */}
        <div className="mt-16 bg-[#3b0f52] rounded-[32px] p-8 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
                <MessageCircle size={40} className="mx-auto mb-4 text-[#00d1c4]" />
                <h3 className="text-2xl font-black mb-2">¿No encuentras lo que buscas?</h3>
                <p className="mb-6 text-white/70">Escríbenos y un Yaper te ayudará en breve.</p>
                <button className="bg-[#00d1c4] text-[#3b0f52] px-8 py-4 rounded-2xl font-black uppercase text-sm hover:scale-105 transition-transform">
                    Contactar ahora
                </button>
            </div>
        </div>
      </main>
    </div>
  );
}