import { useCarrito } from "../context/CarritoContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { useAuth } from "../context/authContext";

export function CarritoFlotante() {
  const {
    carrito,
    vaciarCarrito,
    eliminarProducto,
    cambiarCantidad,
    total,
    mostrarCarrito,
    setMostrarCarrito,
    totalProductos,
    showAddedToast, // Usar el nuevo estado
    showReminder,
    reminderMessage,
    closeReminder,
  } = useCarrito();

  const { usuarioActual } = useAuth();
  const navigate = useNavigate();

  const cerrarCarrito = () => setMostrarCarrito(false);

  const irAPagar = () => {
    if (!usuarioActual) {
      alert("Debes iniciar sesión para continuar con la compra 🧁");
      return;
    }
    setMostrarCarrito(false);
    navigate("/checkout");
  };

  return (
    <>
      {/* === BOTÓN FLOTANTE Y NOTIFICACIÓN (SOLO ESCRITORIO) === */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex items-center">
        {/* Notificación de "Producto agregado" */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            showAddedToast
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10 pointer-events-none"
          } mr-4 bg-white text-lg text-[#9c2007] font-semibold py-2 px-6 rounded-full shadow-lg border-2 border-[#d8718c]"`}
        >
          ¡Producto agregado!
        </div>

        {/* Botón del Carrito */}
        <button
          onClick={() => setMostrarCarrito(!mostrarCarrito)}
          className="relative bg-[#d16170] hover:bg-[#b84c68] text-white p-4 rounded-full shadow-xl transition-all duration-300"
        >
          <ShoppingCart size={26} />
          {totalProductos > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#fff3f0] text-[#9c2007] text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center border border-[#d8718c]">
              {totalProductos}
            </span>
          )}
        </button>
      </div>

      {/* === RECORDATORIO DE CARRITO ABANDONADO === */}
      {showReminder && (
        <div className="fixed bottom-28 right-6 w-72 bg-white border-2 border-[#ff5c39] p-4 rounded-lg shadow-2xl z-50 animate-bounce">
          <button
            onClick={closeReminder}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
          <p className="text-gray-700 font-medium pr-4">{reminderMessage}</p>
        </div>
      )}

      {/* === PANEL DEL CARRITO === */}
      {mostrarCarrito && (
        <>
          {/* Fondo oscuro */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={cerrarCarrito}
          ></div>

          {/* Panel */}
          <div
            className={`
        fixed
        bottom-20
        right-4
        bg-[#fff3f0]
        w-80
        max-w-[92vw]
        rounded-2xl
        shadow-2xl
        p-6
        border border-[#f5bfb2]
        z-50
        animate-slide-left
        
        max-h-[82vh]
        flex flex-col
        
        sm:right-6
        
        carrito-fullscreen
      `}
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* Botón cerrar */}
            <button
              className="text-3xl text-[#d8718c] hover:text-[#b84c68] absolute top-2 right-4 transition"
              onClick={cerrarCarrito}
            >
              &times;
            </button>

            {/* Título */}
            <h3 className="text-2xl font-bold text-[#9c2007] mb-5 text-center">
              Tu carrito
            </h3>

            {/* Scroll de productos */}
            <div
              className="
          flex-1
          overflow-y-auto
          pr-2
          space-y-4
          scrollbar-thin
          scrollbar-thumb-[#d8718c]/60
          scrollbar-track-transparent
        "
            >
              {carrito.length === 0 ? (
                <p className="text-center text-[#9c2007]/70 italic py-4">
                  Tu carrito está vacío
                </p>
              ) : (
                carrito.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-white/70 border border-[#f5bfb2] rounded-2xl p-3 shadow-sm"
                  >
                    <img
                      src={p.imagen}
                      alt={p.nombre || "Producto"}
                      className="w-16 h-16 object-cover rounded-xl border border-[#f5bfb2]"
                    />

                    <div className="flex-1 px-3">
                      <strong className="block text-[#7a1a0a]">
                        {p.nombre || "Producto sin nombre"}
                      </strong>
                      <span className="text-sm text-gray-600">
                        S/{(p.precio || 0).toFixed(2)} x {p.cantidad || 1}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => cambiarCantidad(p.docId, 1)}
                        className="px-2 bg-[#f5bfb2] hover:bg-[#d8718c]/50 rounded-lg transition"
                      >
                        +
                      </button>
                      <button
                        onClick={() => cambiarCantidad(p.docId, -1)}
                        className="px-2 bg-[#f5bfb2] hover:bg-[#d8718c]/50 rounded-lg transition"
                      >
                        -
                      </button>
                      <button
                        onClick={() => eliminarProducto(p.docId)}
                        className="p-1.5 rounded-lg hover:bg-[#fff3f0] transition text-[#d16170]"
                        title="Eliminar producto"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {carrito.length > 0 && (
              <div className="mt-5 space-y-2">
                <p className="font-semibold text-[#7a1a0a] text-center text-lg">
                  Total: S/{total.toFixed(2)}
                </p>

                <button
                  onClick={irAPagar}
                  className={`w-full py-3 rounded-xl font-semibold transition ${usuarioActual
                      ? "bg-[#d16170] text-white hover:bg-[#b84c68]"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  disabled={!usuarioActual}
                >
                  Ver todo el carrito
                </button>

                <button
                  onClick={vaciarCarrito}
                  className="w-full py-2 rounded-xl text-sm border border-[#d8718c] text-[#d8718c] hover:bg-[#f5bfb2]/50 transition"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </div>
        </>
      )}

    </>
  );
}
