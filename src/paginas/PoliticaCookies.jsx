import React from 'react';

const PoliticaCookies = () => {
  const bgColor = 'bg-[#fdeced]';
  const textColor = 'text-[#5c2d2d]';
  const titleColor = 'text-[#c53030]';
  const linkColor = 'text-[#c53030] hover:text-[#e53e3e]';

  return (
    <div className={`min-h-screen ${bgColor} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-12">
          <h1 className={`text-4xl md:text-5xl font-extrabold ${titleColor} mb-6 text-center`}>
            Política de Cookies
          </h1>
          <div className={`text-lg ${textColor} space-y-6`}>
            <p>
              En Bom Bocado, utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el tráfico y personalizar el contenido. Esta política describe qué son las cookies, cómo las usamos y cómo puede gestionarlas.
            </p>

            <div className="mt-8">
              <h2 className={`text-2xl md:text-3xl font-bold ${titleColor} mb-4`}>¿Qué son las cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que se guardan en su dispositivo cuando visita un sitio web. Permiten que el sitio recuerde sus acciones y preferencias (como inicio de sesión, idioma, etc.) durante un período, para que no tenga que volver a introducirlas cada vez que regrese.
              </p>
            </div>

            <div className="mt-8">
              <h2 className={`text-2xl md:text-3xl font-bold ${titleColor} mb-4`}>¿Qué tipos de cookies utilizamos?</h2>
              <ul className="list-disc list-inside space-y-4">
                <li>
                  <strong className={`${titleColor}`}>Cookies Esenciales:</strong> Indispensables para que el sitio funcione. Incluyen, por ejemplo, cookies que le permiten iniciar sesión en áreas seguras.
                </li>
                <li>
                  <strong className={`${titleColor}`}>Cookies de Rendimiento y Análisis:</strong> Nos ayudan a entender cómo interactúan los visitantes con el sitio, contando visitas y fuentes de tráfico para mejorar el rendimiento.
                </li>
                <li>
                  <strong className={`${titleColor}`}>Cookies de Funcionalidad:</strong> Recuerdan las elecciones que hace (como su nombre de usuario o región) para proporcionar una experiencia más personal.
                </li>
                <li>
                  <strong className={`${titleColor}`}>Cookies de Publicidad:</strong> Se utilizan para mostrarle anuncios que son más relevantes para usted y sus intereses.
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h2 className={`text-2xl md:text-3xl font-bold ${titleColor} mb-4`}>Cómo gestionar las cookies</h2>
              <p>
                Puede controlar y eliminar las cookies a través de la configuración de su navegador. Tenga en cuenta que si deshabilita las cookies, es posible que algunas funciones de nuestro sitio no operen correctamente.
                Para más información, puede visitar{' '}
                <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer" className={linkColor}>
                  aboutcookies.org
                </a>.
              </p>
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm italic">
                Última actualización: 25 de julio de 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticaCookies;