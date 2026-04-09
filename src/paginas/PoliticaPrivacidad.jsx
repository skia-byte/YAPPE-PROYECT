import React from 'react';

const PoliticaPrivacidad = () => {
  const bgColor = 'bg-[#fdeced]';
  const textColor = 'text-[#5c2d2d]';
  const titleColor = 'text-[#c53030]';
  const linkColor = 'text-[#c53030] hover:text-[#e53e3e]';

  return (
    <div className={`min-h-screen ${bgColor} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-12">
          <h1 className={`text-4xl md:text-5xl font-extrabold ${titleColor} mb-6 text-center`}>
            Política de Privacidad
          </h1>
          <div className={`text-lg ${textColor} space-y-6`}>
            <p>
              En Bom Bocado, su privacidad es nuestra prioridad. Esta política detalla qué datos personales recopilamos, cómo los usamos y las medidas que tomamos para proteger su información.
            </p>

            <div className="mt-8">
              <h2 className={`text-2xl md:text-3xl font-bold ${titleColor} mb-4`}>Información que recopilamos</h2>
              <p>
                Para ofrecerle nuestros servicios, recopilamos la siguiente información:
              </p>
              <ul className="list-disc list-inside space-y-4 mt-4">
                <li>
                  <strong className={`${titleColor}`}>Información que nos proporciona:</strong> Su nombre, correo electrónico, teléfono y dirección al realizar un pedido.
                </li>
                <li>
                  <strong className={`${titleColor}`}>Información automática:</strong> Su dirección IP, tipo de navegador y actividad en el sitio, recopilada a través de cookies.
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h2 className={`text-2xl md:text-3xl font-bold ${titleColor} mb-4`}>Cómo usamos su información</h2>
              <p>
                Utilizamos su información para:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Procesar y gestionar sus pedidos.</li>
                <li>Comunicarnos con usted sobre su cuenta.</li>
                <li>Personalizar y mejorar su experiencia en el sitio.</li>
                <li>Cumplir con nuestras obligaciones legales.</li>
              </ul>
            </div>

            <div className="mt-8">
              <h2 className={`text-2xl md:text-3xl font-bold ${titleColor} mb-4`}>Cómo compartimos su información</h2>
              <p>
                No vendemos su información personal. Solo la compartimos con proveedores de confianza que nos asisten en nuestras operaciones, como procesadores de pago y empresas de envío, siempre bajo estrictos acuerdos de confidencialidad.
              </p>
            </div>

            <div className="mt-8">
              <h2 className={`text-2xl md:text-3xl font-bold ${titleColor} mb-4`}>Sus derechos</h2>
              <p>
                Usted tiene derecho a acceder, corregir o eliminar su información personal. Para ejercer estos derechos, puede contactarnos a través de{' '}
                <a href="mailto:privacidad@bombocado.com" className={linkColor}>
                  privacidad@bombocado.com
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

export default PoliticaPrivacidad;