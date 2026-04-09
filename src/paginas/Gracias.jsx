import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { CheckCircle, Package } from "lucide-react";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function Gracias() {
  const query = useQuery();
  const pedidoId = query.get("pedido");
  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedido = async () => {
      if (!pedidoId) {
        setError("No se proporcionó un ID de pedido.");
        setCargando(false);
        return;
      }

      try {
        const pedidoRef = doc(db, "pedidos", pedidoId);
        const pedidoSnap = await getDoc(pedidoRef);

        if (pedidoSnap.exists()) {
          setPedido({ id: pedidoSnap.id, ...pedidoSnap.data() });
        } else {
          setError("El pedido no fue encontrado.");
        }
      } catch (err) {
        console.error("Error al recuperar el pedido:", err);
        setError("Ocurrió un error al buscar tu pedido.");
      } finally {
        setCargando(false);
      }
    };

    fetchPedido();
  }, [pedidoId]);

  return (
    <div className="min-h-[70vh] bg-[#fff3f0] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full text-center border-2 border-[#f5bfb2] transform hover:-translate-y-2 transition-all duration-500 ease-out hover:shadow-2xl cursor-pointer">
        {cargando ? (
          <div>
            <h1 className="text-2xl font-semibold text-[#8f2133]">Cargando confirmación...</h1>
            <div className="animate-pulse mt-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-2"></div>
            </div>
          </div>
        ) : error ? (
          <div>
            <h1 className="text-3xl font-bold text-red-600">Error</h1>
            <p className="text-gray-600 mt-4">{error}</p>
            <Link
              to="/productos"
              className="mt-6 inline-block bg-[#d16170] text-white font-bold py-2 px-6 rounded-xl hover:bg-[#b84c68] transition"
            >
              Volver a la tienda
            </Link>
          </div>
        ) : pedido ? (
          <div>
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="text-gray-400 w-full h-full animate-pulse shadow-lg rounded-full" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#8f2133]">
              ¡Gracias por tu compra, {pedido.nombreCliente}!
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Hemos recibido tu pedido y lo estamos procesando.
            </p>
            <div className="mt-6 text-left bg-[#fff3f0] p-4 rounded-xl border border-[#f5bfb2]">
              <p className="text-sm text-[#8f2133] flex items-center justify-center">
                <Package size={18} className="mr-2" />
                <span className="font-bold">Número de Pedido:</span>
                <span className="ml-2 bg-white px-2 py-1 text-sm rounded-md font-mono">{pedido.id}</span>
              </p>
            </div>
            <p className="text-gray-500 mt-6 text-sm">
              Recibirás una confirmación por correo electrónico en breve.
            </p>
            <Link
              to="/productos"
              className="mt-8 inline-block bg-[#d16170] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#b84c68] transition"
            >
              Seguir Comprando
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
