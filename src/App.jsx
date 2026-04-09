import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layout
import MainLayout from "./layouts/MainLayout";

// Contexto y Mascota
import { MascotProvider } from "./context/MascotContext";
import CakeMascot from "./componentes/CakeMascot";
import CookieConsent from "./componentes/CookieConsent";

import "./App.css";

//  PÁGINAS CON LAZY LOADING
const Inicio = lazy(() => import("./paginas/Index"));
const Nosotros = lazy(() => import("./paginas/Nosotros"));
const Productos = lazy(() => import("./paginas/Productos"));
const ProductoDetalle = lazy(() => import("./paginas/ProductoDetalle"));
const Novedades = lazy(() => import("./paginas/Novedades"));
const Perfil = lazy(() => import("./paginas/Perfil"));
const Intranet = lazy(() => import("./paginas/Intranet"));
const Checkout = lazy(() => import("./paginas/Checkout"));
const Gracias = lazy(() => import("./paginas/Gracias"));
const LibroDeReclamaciones = lazy(() =>
  import("./paginas/LibroDeReclamaciones")
);
const PoliticaCookies = lazy(() => import("./paginas/PoliticaCookies"));
const PoliticaPrivacidad = lazy(() =>
  import("./paginas/PoliticaPrivacidad")
);

function App() {
  return (
    <MascotProvider>
      {/* Siempre visibles */}
      <CakeMascot />
      <CookieConsent />

      {/* 👇 Suspense envuelve las rutas */}
      <Suspense
        fallback={
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            Cargando dulzura ...
          </div>
        }
      >
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/:id" element={<ProductoDetalle />} />
            <Route path="/novedades" element={<Novedades />} />
            <Route path="/perfil/:username" element={<Perfil />} />
            <Route path="/intranet" element={<Intranet />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/gracias" element={<Gracias />} />
            <Route
              path="/libro-de-reclamaciones"
              element={<LibroDeReclamaciones />}
            />
            <Route
              path="/politica-de-cookies"
              element={<PoliticaCookies />}
            />
            <Route
              path="/politica-de-privacidad"
              element={<PoliticaPrivacidad />}
            />
          </Route>
        </Routes>
      </Suspense>
    </MascotProvider>
  );
}

export default App;
