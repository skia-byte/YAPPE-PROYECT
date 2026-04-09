import { Outlet } from "react-router-dom";
import NavBar from "../componentes/NavBar";
import { CarritoFlotante } from "../componentes/CarritoFlotante";
import Footer from "../componentes/Footer";
import { Toaster } from 'react-hot-toast'; // 1. Importar Toaster

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CarritoFlotante />
      <Footer />
      
      {/* 2. Añadir el componente Toaster para las notificaciones */}
      <Toaster 
        position="bottom-right" // Posición en la pantalla
        reverseOrder={false}
        toastOptions={{
          // Estilos por defecto para las notificaciones
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
          },
          // Estilos para notificaciones de éxito
          success: {
            style: {
              background: '#d16170', // Color corporativo
            },
            iconTheme: {
              primary: 'white',
              secondary: '#d16170',
            },
          },
          // Estilos para notificaciones de error
          error: {
            style: {
              background: '#9c2007', // Un rojo más oscuro para errores
            }
          }
        }}
      />
    </div>
  );
}