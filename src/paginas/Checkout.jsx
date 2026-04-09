
import { useCarrito } from "../context/CarritoContext";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Tag, X, QrCode, UploadCloud, CheckCircle } from "lucide-react";
import qrYape from "../componentes/img/qr-bom-bocado.png";
import qrPlin from "../componentes/img/qr-bom-bocado.png"; // ¡Reemplazar con QR de Plin!
import { departamentos, provincias, distritos } from "../lib/peru-geo";

const COSTO_ENVIO_FIJO = 10.00;

export default function Checkout() {
  const {
    carrito,
    total,
    realizarPago,
    cargandoPago,
    errorPago: errorDePago,
    cambiarCantidad,
    eliminarProducto,
  } = useCarrito();
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [provincia, setProvincia] = useState("");
  const [distrito, setDistrito] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [provinciasDisponibles, setProvinciasDisponibles] = useState([]);
  const [distritosDisponibles, setDistritosDisponibles] = useState([]);
  const [metodoPago, setMetodoPago] = useState("");
  const [mostrarModalYape, setMostrarModalYape] = useState(false);
  const [mostrarModalPlin, setMostrarModalPlin] = useState(false); // <-- Estado para Plin
  const [comprobante, setComprobante] = useState(null);
  const [nombreComprobante, setNombreComprobante] = useState("");
  const [intentoDePago, setIntentoDePago] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (departamento) {
      setProvinciasDisponibles(provincias[departamento] || []);
      setProvincia("");
    } else {
      setProvinciasDisponibles([]);
    }
    setDistrito("");
    setDistritosDisponibles([]);
  }, [departamento]);

  useEffect(() => {
    if (provincia) {
      setDistritosDisponibles(distritos[provincia] || []);
    } else {
      setDistritosDisponibles([]);
    }
    setDistrito("");
  }, [provincia]);

  useEffect(() => {
    if (!usuarioActual) {
      alert("Debes iniciar sesión para continuar.");
      navigate("/productos");
      return;
    }
    if (carrito.length === 0 && !intentoDePago) {
      console.warn("El carrito está vacío, redirigiendo...");
      navigate("/productos");
      return;
    }
    if (usuarioActual) {
      setNombre(usuarioActual.displayName || "");
    }
  }, [usuarioActual, carrito, navigate, intentoDePago]);

  const finalizarCompra = async (e) => {
    e.preventDefault();
    if (!departamento || !provincia || !distrito || !direccion.trim()) {
      alert("Por favor, completa todos los campos de tu dirección.");
      return;
    }
    setIntentoDePago(true);
    const direccionCompleta = `${direccion}, ${distrito}, ${provincia}, ${departamento}`;
    const direccionConReferencia = referencia ? `${direccionCompleta} (Ref: ${referencia})` : direccionCompleta;

    try {
      const idPedido = await realizarPago({
        nombre,
        direccion: direccionConReferencia,
        metodoPago,
        comprobante,
        costoEnvio: COSTO_ENVIO_FIJO,
      });
      navigate(`/gracias?pedido=${idPedido}`);
    } catch (err) {
      console.error("Fallo al finalizar la compra:", err);
      alert(`¡Uy! Hubo un problema al procesar tu pedido. (Error: ${err.message})`);
      setIntentoDePago(false);
    }
  };

  const totalFinal = total + COSTO_ENVIO_FIJO;

  const handleComprobanteChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setComprobante(file);
      setNombreComprobante(file.name);
    }
  };

  if (intentoDePago && cargandoPago) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#fff3f0]">
        <h1 className="text-2xl text-[#9c2007]">Finalizando tu compra...</h1>
        <p className="text-gray-600 mb-4">Espera un momento, registrando tu pedido.</p>
      </div>
    );
  }

  const pagarDesdeModal = () => {
    if (!comprobante) {
      alert("Por favor, sube un comprobante antes de continuar.");
      return;
    }
    setMostrarModalYape(false);
    setMostrarModalPlin(false);
    document.getElementById("formCheckout").requestSubmit();
  };

  // Factorizamos el contenido del modal para no repetir tanto código
  const ContenidoModalPago = ({ titulo, qrImg }) => (
    <>
      <div className="flex-grow overflow-y-auto p-6 text-center space-y-4">
        <p className="text-gray-600">Escanea el código QR para completar tu pago.</p>
        <img src={qrImg} alt={`QR ${titulo}`} className="w-60 mx-auto rounded-xl shadow-lg border-4 border-white"/>
        <div className="bg-rose-50 border-t-2 border-b-2 border-rose-200/80 py-3 px-4">
            <p className="text-sm text-gray-500">Monto a pagar:</p>
            <p className="text-3xl font-bold text-[#8f2133]">S/ {totalFinal.toFixed(2)}</p>
        </div>
        <p className="text-sm text-gray-500 pt-2">Luego, sube tu comprobante de pago.</p>
        <div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleComprobanteChange} className="hidden" required/>
            <div 
                onClick={() => fileInputRef.current.click()} 
                className="bg-white border-2 border-dashed border-[#fdd2d7] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#d8718c] transition-all">
                {nombreComprobante ? (
                    <div className="text-green-600 flex flex-col items-center gap-2">
                        <CheckCircle size={32}/>
                        <p className="font-semibold text-sm">Comprobante Cargado:</p>
                        <p className="text-xs font-mono bg-green-50 rounded-md px-2 py-1">{nombreComprobante}</p>
                    </div>
                ) : (
                    <div className="text-[#d8718c] flex flex-col items-center gap-2">
                        <UploadCloud size={32}/>
                        <p className="font-semibold text-sm">Seleccionar o arrastrar</p>
                    </div>
                )}
            </div>
        </div>
      </div>
      <div className="p-4 bg-white/30 border-t-2 border-rose-100/80 flex justify-end items-center">
        <button onClick={pagarDesdeModal} disabled={!comprobante} className="inline-flex items-center justify-center gap-2 bg-[#d8718c] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#c25a75] transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed">
            <QrCode size={18} /> Confirmar Pago
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* --- Modal Yape --- */}
      {mostrarModalYape && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fade-in" onClick={() => setMostrarModalYape(false)}>
          <div className="bg-[#fffcfc] rounded-3xl shadow-2xl border border-rose-100/50 max-w-md w-full max-h-[95vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="p-6 relative border-b-2 border-rose-100/80">
                <h2 className="text-2xl font-bold text-center text-[#8f2133]">Paga con Yape</h2>
                <button onClick={() => setMostrarModalYape(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white hover:bg-red-400 rounded-full p-1.5 transition-all" aria-label="Cerrar"><X size={20} /></button>
            </div>
            <ContenidoModalPago titulo="Yape" qrImg={qrYape} />
          </div>
        </div>
      )}

      {/* --- Modal Plin --- */}
      {mostrarModalPlin && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fade-in" onClick={() => setMostrarModalPlin(false)}>
          <div className="bg-[#fffcfc] rounded-3xl shadow-2xl border border-rose-100/50 max-w-md w-full max-h-[95vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="p-6 relative border-b-2 border-rose-100/80">
                <h2 className="text-2xl font-bold text-center text-[#8f2133]">Paga con Plin</h2>
                <button onClick={() => setMostrarModalPlin(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white hover:bg-red-400 rounded-full p-1.5 transition-all" aria-label="Cerrar"><X size={20} /></button>
            </div>
            <ContenidoModalPago titulo="Plin" qrImg={qrPlin} />
          </div>
        </div>
      )}

      <div className="bg-[#fff3f0] min-h-screen py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <button onClick={() => navigate("/productos")} className="flex items-center gap-2 text-[#9c2007] font-semibold mb-6 hover:text-[#d16170]">
            <ArrowLeft size={20} />
            Volver a la tienda
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* --- COLUMNA IZQUIERDA (PRINCIPAL) --- */}
            <div className="lg:col-span-2 bg-white/80 p-6 sm:p-8 rounded-2xl shadow-lg border border-[#f5bfb2]">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#9c2007] mb-6">Mi Carrito ({carrito.length})</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rose-200 scrollbar-track-rose-50">
                {carrito.length > 0 ? carrito.map(p => (
                  <div key={p.docId} className="flex items-start gap-4 p-4 border-b border-rose-100/80 last:border-b-0">
                    <img src={p.imagen} alt={p.nombre} className="w-24 h-24 object-cover rounded-lg border-2 border-[#f5bfb2]" />
                    <div className="flex-1">
                      <p className="font-bold text-lg text-[#7a1a0a]">{p.nombre}</p>
                      <p className="text-sm text-gray-500">Precio Unitario: S/{p.precio.toFixed(2)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-sm font-semibold">Cantidad:</p>
                        <button onClick={() => cambiarCantidad(p.docId, -1)} className="px-2.5 py-0.5 bg-[#f5bfb2] hover:bg-[#d8718c]/50 rounded-md transition text-lg font-bold">-</button>
                        <span className="font-semibold w-5 text-center">{p.cantidad}</span>
                        <button onClick={() => cambiarCantidad(p.docId, 1)} className="px-2.5 py-0.5 bg-[#f5bfb2] hover:bg-[#d8718c]/50 rounded-md transition text-lg font-bold">+</button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between h-full">
                      <p className="font-semibold text-lg text-gray-800">S/{(p.precio * p.cantidad).toFixed(2)}</p>
                      <button onClick={() => eliminarProducto(p.docId)} className="p-1.5 rounded-lg hover:bg-red-100 transition text-red-500 hover:text-red-700 mt-2" title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )) : (
                    <p className="py-10 text-center text-gray-500">Tu carrito está vacío.</p>
                )}
              </div>
            </div>

            {/* --- COLUMNA DERECHA (SIDEBAR) --- */}
            <div className="lg:col-span-1 space-y-8">
                {/* Resumen de Compra */}
                <div className="bg-white/80 p-6 sm:p-7 rounded-2xl shadow-lg border border-[#f5bfb2]">
                    <h2 className="text-2xl font-bold text-[#9c2007] mb-5">Resumen de tu compra</h2>
                    <div className="space-y-3 text-lg">
                        <div className="flex justify-between"><p className="text-[#7a1a0a]">Subtotal:</p><p className="font-semibold text-[#7a1a0a]">S/{total.toFixed(2)}</p></div>
                        <div className="flex justify-between"><p className="text-[#7a1a0a]">Envío:</p><p className="font-semibold text-[#7a1a0a]">S/{COSTO_ENVIO_FIJO.toFixed(2)}</p></div>
                        <div className="flex justify-between text-xl border-t-2 border-dashed border-[#f5bfb2] pt-3 mt-3"><p className="font-bold text-[#9c2007]">Total:</p><p className="font-bold text-[#9c2007]">S/{totalFinal.toFixed(2)}</p></div>
                    </div>
                </div>

                {/* Formulario de Pedido */}
                <div className="bg-white/80 p-6 sm:p-7 rounded-2xl shadow-lg border border-[#f5bfb2]">
                    <h1 className="text-2xl font-bold text-[#9c2007] mb-5">Completa tu pedido</h1>
                    <form id="formCheckout" onSubmit={finalizarCompra} className="space-y-4">
                        <div>
                        <label className="text-sm font-semibold text-[#8f2133]">Nombre Completo</label>
                        <input type="text" placeholder="Tu nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} className="mt-1 border border-[#f5bfb2] bg-white rounded-xl w-full p-3 focus:ring-2 focus:ring-[#d8718c] outline-none"/>
                        </div>
        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-[#8f2133]">Departamento</label>
                                <select required value={departamento} onChange={(e) => setDepartamento(e.target.value)} className="mt-1 border border-[#f5bfb2] bg-white rounded-xl w-full p-3 focus:ring-2 focus:ring-[#d8718c] outline-none cursor-pointer">
                                <option value="">Selecciona...</option>
                                {departamentos.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-[#8f2133]">Provincia</label>
                                <select required value={provincia} onChange={(e) => setProvincia(e.target.value)} disabled={!departamento} className="mt-1 border border-[#f5bfb2] bg-white rounded-xl w-full p-3 focus:ring-2 focus:ring-[#d8718c] outline-none cursor-pointer disabled:bg-gray-100">
                                <option value="">Selecciona...</option>
                                {provinciasDisponibles.map(prov => <option key={prov} value={prov}>{prov}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        <div>
                        <label className="text-sm font-semibold text-[#8f2133]">Distrito</label>
                        <select required value={distrito} onChange={(e) => setDistrito(e.target.value)} disabled={!provincia} className="mt-1 border border-[#f5bfb2] bg-white rounded-xl w-full p-3 focus:ring-2 focus:ring-[#d8718c] outline-none cursor-pointer disabled:bg-gray-100">
                            <option value="">Selecciona...</option>
                            {distritosDisponibles.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                        </select>
                        </div>
        
                        <div>
                        <label className="text-sm font-semibold text-[#8f2133]">Dirección</label>
                        <input type="text" placeholder="Ej: Av. Primavera 123, Urb. Las Flores" required value={direccion} onChange={(e) => setDireccion(e.target.value)} className="mt-1 border border-[#f5bfb2] bg-white rounded-xl w-full p-3 focus:ring-2 focus:ring-[#d8718c] outline-none"/>
                        </div>
        
                        <div>
                        <label className="text-sm font-semibold text-[#8f2133]">Referencia (Opcional)</label>
                        <input type="text" placeholder="Ej: Al costado de la farmacia" value={referencia} onChange={(e) => setReferencia(e.target.value)} className="mt-1 border border-[#f5bfb2] bg-white rounded-xl w-full p-3 focus:ring-2 focus:ring-[#d8718c] outline-none"/>
                        </div>
                        
                        {/* Método de Pago */}
                        
                        <div>
                        <label className="text-sm font-semibold text-[#8f2133]">Método de Pago</label>
                        <select required value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} className="mt-1 border border-[#f5bfb2] bg-white rounded-xl w-full p-3 focus:ring-2 focus:ring-[#d8718c] outline-none cursor-pointer">
                            <option value="">Selecciona un método</option>
                            <option value="yape">Yape</option>
                            <option value="plin">Plin</option> {/* <-- Opción Plin habilitada */}
                            <option value="tarjeta">Tarjeta (Próximamente)</option>
                            <option value="contraentrega">Pago Contra Entrega</option>
                        </select>
                        </div>
        
                        {errorDePago && <p className="text-sm text-red-600 text-center bg-red-100 p-2 rounded-lg">{errorDePago}</p>}

                        <button type="button" disabled={cargandoPago || intentoDePago || carrito.length === 0} onClick={() => { 
                          if (!metodoPago) { alert("Selecciona un método de pago."); return; }
                          if (metodoPago === "yape") { setMostrarModalYape(true); }
                          else if (metodoPago === "plin") { setMostrarModalPlin(true); } // <-- Lógica para Plin
                          else { document.getElementById("formCheckout").requestSubmit(); } 
                        }} className="w-full bg-[#d16170] text-white py-4 rounded-xl hover:bg-[#b84c68] transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                          {cargandoPago ? "Procesando..." : `Pagar S/${totalFinal.toFixed(2)}`}
                        </button>
                    </form>
                </div>
            </div>

          </div>
        </div>
        {typeof window !== 'undefined' && (
          <style jsx global>{`
              @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
              @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
              .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
              .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
              .scrollbar-thin::-webkit-scrollbar { width: 6px; }
              .scrollbar-thin::-webkit-scrollbar-track { background: #fecaca; border-radius: 10px; }
              .scrollbar-thin::-webkit-scrollbar-thumb { background: #f87171; border-radius: 10px; }
              .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #ef4444; }
          `}</style>
        )}
      </div>
    </>
  );
}
