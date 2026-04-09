import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { AlertTriangle, Loader, Mail, Phone, MapPin, User, FileText, DollarSign, Tag, Eye, ChevronDown, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';

const InfoItem = ({ icon, label, children }) => (
  <div className="bg-white p-3 rounded-lg border border-rose-100/80 flex items-start gap-3 shadow-sm">
    <div className="flex-shrink-0 text-[#d16170]">{icon}</div>
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{children}</p>
    </div>
  </div>
);

export default function GestionReclamos() {
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReclamo, setSelectedReclamo] = useState(null);
  const [sortBy, setSortBy] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const reclamosPorPagina = 10;

  useEffect(() => {
    const fetchReclamos = async () => {
      try {
        setLoading(true);
        setError(null);
        const reclamosCollection = collection(db, 'reclamos');
        const q = query(reclamosCollection, orderBy('fechaCreacion', sortBy));
        const reclamosSnapshot = await getDocs(q);
        const reclamosList = reclamosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaCreacion: doc.data().fechaCreacion.toDate(),
        }));
        setReclamos(reclamosList);
      } catch (err) {
        console.error("Error fetching reclamos:", err);
        setError('Hubo un problema al cargar los reclamos.');
      } finally {
        setLoading(false);
      }
    };
    fetchReclamos();
  }, [sortBy]);

  if (loading) {
    return <div className="flex justify-center items-center py-10"><Loader className="animate-spin text-[#d16170]" size={40} /><p className="ml-4 text-lg font-semibold text-gray-700">Cargando Reclamos...</p></div>;
  }

  if (error) {
    return <div className="flex items-center gap-3 text-red-700 bg-red-100/80 p-4 rounded-lg border border-red-300"><AlertTriangle size={24} /><p className="font-semibold">{error}</p></div>;
  }

  const totalPaginas = Math.ceil(reclamos.length / reclamosPorPagina);
  const reclamosPaginados = reclamos.slice((currentPage - 1) * reclamosPorPagina, currentPage * reclamosPorPagina);

  const ReclamoDetailModal = ({ reclamo, onClose }) => {
    if (!reclamo) return null;
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-[#fffcfc] rounded-3xl shadow-2xl border border-rose-100/50 max-w-2xl w-full relative animate-slide-up" onClick={e => e.stopPropagation()}>
          <div className="p-8 relative">
            <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-white hover:bg-red-400 rounded-full p-1.5 transition-all duration-300" aria-label="Cerrar modal"><X size={20} /></button>
            <h2 className="text-2xl font-bold text-[#8f2133] mb-1">Detalle del Reclamo</h2>
            <p className="text-xs text-gray-500">Recibido el: {new Intl.DateTimeFormat('es-ES', { dateStyle: 'full', timeStyle: 'short' }).format(reclamo.fechaCreacion)}</p>
          </div>
          <div className="max-h-[70vh] overflow-y-auto space-y-6 px-8 pb-8 scrollbar-thin scrollbar-thumb-rose-200 scrollbar-track-rose-50">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2">Datos del Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoItem icon={<User size={18} />} label="Nombre Completo">{reclamo.nombres} {reclamo.apellidos}</InfoItem>
                <InfoItem icon={<FileText size={18} />} label="Documento">{reclamo.documento}</InfoItem>
                <InfoItem icon={<Mail size={18} />} label="Email">{reclamo.email}</InfoItem>
                <InfoItem icon={<Phone size={18} />} label="Teléfono">{reclamo.telefono}</InfoItem>
              </div>
              <InfoItem icon={<MapPin size={18} />} label="Ubicación">{`${reclamo.ubicacion.direccion}, ${reclamo.ubicacion.distrito}, ${reclamo.ubicacion.provincia}, ${reclamo.ubicacion.departamento}`}</InfoItem>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2">Detalles del Reclamo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoItem icon={<Tag size={18} />} label="Tipo de Reclamo"><span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${ reclamo.tipo === 'producto' ? 'bg-pink-100 text-pink-800' : 'bg-red-100 text-red-800' }`}>{reclamo.tipo}</span></InfoItem>
                  <InfoItem icon={<DollarSign size={18} />} label="Monto Reclamado">S/ {reclamo.montoReclamado || '0.00'}</InfoItem>
              </div>
            </div>
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Mensaje del Cliente</h3>
                <div className="bg-white border border-rose-100/80 rounded-lg p-4"><p className="text-gray-700 text-sm italic leading-relaxed">"{reclamo.comentario}"</p></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#8f2133]">Historial de Reclamos</h3>
          <p className="text-sm text-gray-600">Total: {reclamos.length} reclamos</p>
        </div>
        <div className="relative">
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }} className="appearance-none w-full sm:w-auto bg-white border-2 border-[#f5bfb2] text-gray-700 font-semibold py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-[#d16170] focus:ring-1 focus:ring-[#d16170] transition-colors">
            <option value="desc">Más Recientes</option>
            <option value="asc">Más Antiguos</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {reclamos.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No se han encontrado reclamos.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {reclamosPaginados.map((reclamo) => (
              <div key={reclamo.id} className="bg-white rounded-2xl border-2 border-[#f5bfb2] p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {/* --- LÓGICA DE AVATAR --- */}
                    {reclamo.fotoURL ? (
                      <img src={reclamo.fotoURL} alt={`Foto de ${reclamo.nombres}`} className="w-10 h-10 rounded-full object-cover"/>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={22} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-800">{reclamo.nombres} {reclamo.apellidos}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5"><Clock size={12}/> {new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(reclamo.fechaCreacion)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${ reclamo.tipo === 'producto' ? 'bg-pink-100 text-pink-800' : 'bg-red-100 text-red-800' }`}>{reclamo.tipo}</span>
                </div>
                <p className="text-sm text-gray-600 italic border-t border-gray-100 pt-3">"{reclamo.comentario.substring(0, 100)}..."</p>
                <button onClick={() => setSelectedReclamo(reclamo)} className="w-full mt-2 bg-[#d16170] text-white p-2 rounded-lg hover:bg-[#b94a5b] transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 font-semibold">
                  <Eye size={16} /> Ver Detalles
                </button>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto bg-white rounded-lg border-2 border-[#f5bfb2]">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-[#d16170] text-xs text-white uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">Cliente</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Tipo</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Resumen</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Fecha</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reclamosPaginados.map((reclamo) => (
                  <tr key={reclamo.id} className="border-b border-[#f5bfb2] last:border-b-0 hover:bg-[#fff3f0]/60">
                    <td className="px-6 py-4">{reclamo.nombres} {reclamo.apellidos}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${reclamo.tipo === 'producto' ? 'bg-pink-100 text-pink-800' : 'bg-red-100 text-red-800'}`}>{reclamo.tipo}</span></td>
                    <td className="px-6 py-4 max-w-sm truncate" title={reclamo.comentario}>{reclamo.comentario}</td>
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">{new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(reclamo.fechaCreacion)}</td>
                    <td className="px-6 py-4 text-center"><button onClick={() => setSelectedReclamo(reclamo)} className="bg-[#d16170] text-white p-2 rounded-lg hover:bg-[#b94a5b] transition-colors duration-200 shadow-sm" title="Ver Detalles del Reclamo"><Eye size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center pt-6 gap-2">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-3 rounded-full bg-white text-[#d16170] shadow-md hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300" aria-label="Página Anterior"><ChevronLeft size={20} /></button>
          <div className="flex bg-white rounded-full shadow-md px-4 py-2 gap-2">
            {[...Array(totalPaginas)].map((_, i) => (<button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-full font-bold transition-all duration-300 ${currentPage === i + 1 ? "bg-[#d16170] text-white scale-110 shadow-lg" : "text-gray-500 hover:bg-rose-50 hover:text-[#d16170]"}`}>{i + 1}</button>))}
          </div>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPaginas} className="p-3 rounded-full bg-white text-[#d16170] shadow-md hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300" aria-label="Página Siguiente"><ChevronRight size={20} /></button>
        </div>
      )}

      <ReclamoDetailModal reclamo={selectedReclamo} onClose={() => setSelectedReclamo(null)} />
    </div>
  );
}

const animationStyles = `
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
.animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
`;

if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = animationStyles;
  document.head.appendChild(styleSheet);
}
