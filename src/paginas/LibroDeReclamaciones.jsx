import { useState } from "react";
import { Users, ShoppingBag, BookOpen } from "lucide-react";
import FormularioReclamo from "../componentes/FormularioReclamo";

export default function LibroDeReclamaciones() {
  const [tipoReclamo, setTipoReclamo] = useState(null); // null, 'servicio', o 'producto'

  const handleSelectReclamo = (tipo) => {
    setTipoReclamo(tipo);
  };

  const handleBack = () => {
    setTipoReclamo(null);
  };

  const SeleccionInicial = (
    <>
        <div className="bg-white/70 p-6 rounded-2xl shadow-sm border border-[#f5bfb2] mb-10">
            <h2 className="text-2xl font-semibold text-[#8a152e] mb-3">
                Cuéntanos sobre tu inconveniente
            </h2>
            <p className="text-[#9c2007] leading-relaxed">
                Conforme a lo establecido en el Reglamento del Libro de Reclamaciones del Código de Protección y Defensa del Consumidor, ponemos a tu disposición nuestro Libro de Reclamaciones Virtual. Para nosotros es muy importante conocer tu opinión.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button
            onClick={() => handleSelectReclamo('servicio')}
            className="group text-left block bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-[#d8718c] hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-5">
              <div className="bg-[#fdd2d7] p-4 rounded-full">
                <Users className="text-[#d8718c] transition-transform duration-300 group-hover:scale-110" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#8a152e]">Reclamo sobre un servicio</h3>
                <p className="text-sm text-[#9c2007] mt-1">Relacionado a una experiencia de compra, entrega o atención.</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => handleSelectReclamo('producto')}
            className="group text-left block bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-[#d8718c] hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-5">
              <div className="bg-[#fdd2d7] p-4 rounded-full">
                <ShoppingBag className="text-[#d8718c] transition-transform duration-300 group-hover:scale-110" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#8a152e]">Reclamo sobre un producto</h3>
                <p className="text-sm text-[#9c2007] mt-1">Relacionado a la calidad o estado de un producto recibido.</p>
              </div>
            </div>
          </button>
        </div>
    </>
  );

  return (
    <div className="bg-[#fff3f0] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
            <BookOpen className="mx-auto text-[#d8718c]" size={48} />
            <h1 className="text-4xl font-bold text-[#8a152e] mt-2">
                Libro de Reclamaciones
            </h1>
            <p className="text-md text-[#9c2007] mt-2">
                RUC 20601898147 | BOM BOCADO S.A.C.
            </p>
        </div>
        
        {tipoReclamo ? (
          <FormularioReclamo tipoReclamo={tipoReclamo} onBack={handleBack} />
        ) : (
          SeleccionInicial
        )}

      </div>
    </div>
  );
}
