import { useState, useEffect } from 'react';
import { ChevronLeft, Send, PartyPopper, AlertTriangle } from 'lucide-react';
import { db } from '../lib/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { departamentos, provincias as provinciasData, distritos as distritosData } from '../lib/peru-geo';
// --- 1. IMPORTAR useAuth --- 
import { useAuth } from '../context/authContext';

const inputStyles = "w-full bg-white/70 border-2 border-[#fdd2d7] rounded-lg px-4 py-2.5 text-gray-800 transition-all duration-300 focus:outline-none focus:border-[#d8718c] focus:ring-2 focus:ring-[#d8718c]/50";
const labelStyles = "block text-sm font-semibold text-[#8a152e] mb-1.5";

export default function FormularioReclamo({ tipoReclamo, onBack }) {
  // --- 2. OBTENER EL USUARIO ACTUAL ---
  const { usuarioActual } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    menorDeEdad: false, tipoDocumento: 'DNI', numeroDocumento: '', nombres: '', apellidos: '', email: '', telefono: '',
    departamento: '', provincia: '', distrito: '', direccion: '', montoReclamado: '', descripcionReclamo: ''
  });

  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  
  // Rellenar datos del usuario si está logueado
  useEffect(() => {
    if (usuarioActual) {
      setFormData(prev => ({
        ...prev,
        nombres: usuarioActual.displayName?.split(' ')[0] || '',
        apellidos: usuarioActual.displayName?.split(' ').slice(1).join(' ') || '',
        email: usuarioActual.email || ''
      }));
    }
  }, [usuarioActual]);

  useEffect(() => {
    if (formData.departamento) {
      setProvincias(provinciasData[formData.departamento] || []);
      setFormData(prev => ({ ...prev, provincia: '', distrito: '' }));
    } else { setProvincias([]); }
  }, [formData.departamento]);

  useEffect(() => {
    if (formData.provincia) {
      setDistritos(distritosData[formData.provincia] || []);
      setFormData(prev => ({ ...prev, distrito: '' }));
    } else { setDistritos([]); }
  }, [formData.provincia]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const reclamoData = {
        nombres: formData.nombres, apellidos: formData.apellidos, email: formData.email, telefono: formData.telefono,
        documento: `${formData.tipoDocumento} - ${formData.numeroDocumento}`,
        ubicacion: { departamento: formData.departamento, provincia: formData.provincia, distrito: formData.distrito, direccion: formData.direccion },
        comentario: formData.descripcionReclamo, montoReclamado: formData.montoReclamado || 0, tipo: tipoReclamo,
        fechaCreacion: serverTimestamp(),
        // --- 3. AÑADIR FOTO DE PERFIL SI EXISTE ---
        ...(usuarioActual && { autorFotoURL: usuarioActual.photoURL || null }),
      };
      await addDoc(collection(db, 'reclamos'), reclamoData);
      setStep(3);
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudo enviar tu reclamo. Inténtalo de nuevo.");
    } finally { setIsSubmitting(false); }
  };
  
  const StepNavigation = () => (
    <button onClick={step === 1 ? onBack : () => setStep(step - 1)} className='flex items-center gap-2 text-[#d8718c] font-bold mb-6 hover:underline'>
      <ChevronLeft size={20} />
      {step === 1 ? 'Volver a la selección' : 'Ir al paso anterior'}
    </button>
  );

  if (step === 3) {
    return (
      <div className="text-center py-10 bg-white/80 backdrop-blur-sm border border-[#f5bfb2] p-8 rounded-2xl shadow-lg">
        <PartyPopper className="mx-auto text-green-500" size={60} />
        <h2 className="text-3xl font-bold text-[#8a152e] mt-4">¡Reclamo enviado!</h2>
        <p className="text-[#9c2007] mt-2 max-w-md mx-auto">Gracias por tus comentarios. Hemos recibido tu reclamo y te contactaremos a la brevedad.</p>
        <button onClick={onBack} className="mt-8 bg-[#d8718c] text-white font-bold py-3 px-10 rounded-lg hover:bg-[#c25a75] transition-colors">
          Finalizar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-[#f5bfb2] p-6 sm:p-8 rounded-2xl shadow-lg">
      <StepNavigation />

      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <h2 className="text-3xl font-bold text-[#8a152e] mb-2">Paso 1: Identificación del Cliente</h2>
          <p className="text-[#9c2007] mb-8">Completa tus datos para poder registrar tu reclamo de forma correcta.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div><label htmlFor="tipoDocumento" className={labelStyles}>Tipo de Documento</label><select id="tipoDocumento" name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange} className={inputStyles}><option>DNI</option><option>Carnet de Extranjería</option><option>Pasaporte</option></select></div>
            <div><label htmlFor="numeroDocumento" className={labelStyles}>N° de Documento</label><input type="text" id="numeroDocumento" name="numeroDocumento" placeholder="12345678" value={formData.numeroDocumento} onChange={handleChange} className={inputStyles} required /></div>
            <div><label htmlFor="nombres" className={labelStyles}>Nombres</label><input type="text" id="nombres" name="nombres" placeholder="Ej: Ana Lucía" value={formData.nombres} onChange={handleChange} className={inputStyles} required/></div>
            <div><label htmlFor="apellidos" className={labelStyles}>Apellidos</label><input type="text" id="apellidos" name="apellidos" placeholder="Ej: García Pérez" value={formData.apellidos} onChange={handleChange} className={inputStyles} required/></div>
            <div><label htmlFor="email" className={labelStyles}>Correo electrónico</label><input type="email" id="email" name="email" placeholder="email@ejemplo.com" value={formData.email} onChange={handleChange} className={inputStyles} required/></div>
            <div><label htmlFor="telefono" className={labelStyles}>Teléfono</label><input type="tel" id="telefono" name="telefono" placeholder="987654321" value={formData.telefono} onChange={handleChange} className={inputStyles} required/></div>
            
            <div className="md:col-span-2"><hr className="my-3 border-t-2 border-[#f5bfb2]/50"/></div>
            
            <div><label htmlFor="departamento" className={labelStyles}>Departamento</label><select id="departamento" name="departamento" value={formData.departamento} onChange={handleChange} className={inputStyles} required><option value="">Seleccionar...</option>{departamentos.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div><label htmlFor="provincia" className={labelStyles}>Provincia</label><select id="provincia" name="provincia" value={formData.provincia} onChange={handleChange} disabled={!provincias.length} className={`${inputStyles} disabled:bg-gray-200/80`} required><option value="">Seleccionar...</option>{provincias.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
            <div><label htmlFor="distrito" className={labelStyles}>Distrito</label><select id="distrito" name="distrito" value={formData.distrito} onChange={handleChange} disabled={!distritos.length} className={`${inputStyles} disabled:bg-gray-200/80`} required><option value="">Seleccionar...</option>{distritos.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div className="md:col-span-2"><label htmlFor="direccion" className={labelStyles}>Dirección</label><input type="text" id="direccion" name="direccion" placeholder="Ej: Av. El Sol 123, Urb. La Alegría" value={formData.direccion} onChange={handleChange} className={inputStyles} required/></div>
            <div className="md:col-span-2 flex items-center gap-3 mt-2"><input type="checkbox" id="menorDeEdad" name="menorDeEdad" checked={formData.menorDeEdad} onChange={handleChange} className="h-4 w-4 rounded text-[#d8718c] focus:ring-[#d8718c] border-gray-300"/><label htmlFor="menorDeEdad" className="text-gray-700 font-medium">Soy menor de edad</label></div>
          </div>
          <div className="mt-10 text-right"><button type="submit" className="bg-[#d8718c] text-white font-bold py-3 px-10 rounded-lg hover:bg-[#c25a75] transition-colors shadow-md hover:shadow-lg">Continuar al Paso 2</button></div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold text-[#8a152e] mb-2">Paso 2: Detalle del Reclamo</h2>
          <p className="text-[#9c2007] mb-8">Describe el inconveniente sobre tu <span className="font-bold">{tipoReclamo}</span>.</p>
          <div className="space-y-5">
            <div><label htmlFor="montoReclamado" className={labelStyles}>Monto Reclamado en S/ (opcional)</label><input type="number" id="montoReclamado" name="montoReclamado" placeholder="Ej: 25.50" value={formData.montoReclamado} onChange={handleChange} className={inputStyles} /></div>
            <div><label htmlFor="descripcionReclamo" className={labelStyles}>Descripción detallada del reclamo</label><textarea id="descripcionReclamo" name="descripcionReclamo" placeholder="Describe el problema, incluyendo fechas, productos involucrados y qué solución esperas..." rows="6" value={formData.descripcionReclamo} onChange={handleChange} className={`${inputStyles} min-h-[120px]`} required></textarea></div>
          </div>
          {error && <div className="mt-6 flex items-center gap-3 text-red-700 bg-red-100/80 p-4 rounded-lg border border-red-300"><AlertTriangle size={24} /><p className="font-semibold">{error}</p></div>}
          <div className="mt-10 text-right"><button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 bg-[#d8718c] text-white font-bold py-3 px-10 rounded-lg hover:bg-[#c25a75] transition-colors shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:shadow-none"><Send size={18} />{isSubmitting ? 'Enviando Reclamo...' : 'Enviar Reclamo'}</button></div>
        </form>
      )}
    </div>
  );
}
