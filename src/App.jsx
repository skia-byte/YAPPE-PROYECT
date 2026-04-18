
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import { MascotProvider } from "./context/MascotContext";
import MainLayout from "./layouts/MainLayout";
import YapeMascot from "./componentes/YapeMascot/YapeMascot";
import "./App.css";

// Lazy Loading
const Inicio = lazy(() => import("./paginas/Index"));
const Nosotros = lazy(() => import("./paginas/Nosotros"));
const CentrodeAyuda = lazy(() => import("./paginas/CentrodeAyuda"));
const Unete = lazy(() => import("./paginas/Unete"));
const Perfil = lazy(() => import("./paginas/Perfil"));
const LibroDeReclamaciones = lazy(() => import("./paginas/LibroDeReclamaciones"));
const VerDetalles = lazy(() => import("./componentes/VerDetalles"));
const FormularioDePostulacion = lazy(() =>
  import("./paginas/FormularioDePostulacion")
);

function App() {
  return (
    <MascotProvider>
      <Suspense fallback={<h1>Cargando...</h1>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/centrodeayuda" element={<CentrodeAyuda />} />
            <Route path="/unete" element={<Unete />} />
            <Route path="/perfil/:username" element={<Perfil />} />
            <Route path="/libro-de-reclamaciones" element={<LibroDeReclamaciones />} />
            <Route path="/detalles-empleo/:id" element={<VerDetalles />} />
            <Route path="/postular/:id" element={<FormularioDePostulacion />} />
          </Route>
        </Routes>

        <YapeMascot />
      </Suspense>
    </MascotProvider>
  );
}

export default App;