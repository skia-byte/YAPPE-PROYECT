import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setVisible(false);
  };
    const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'false');
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="cookie-consent-backdrop">
      <div className="cookie-consent-banner">
        <h2> <strong>Acerca de las cookies en Bom Bocado  </strong></h2>
        <p>
          Utilizamos cookies para mejorar su experiencia, analizar el rendimiento del sitio y
          ofrecerle contenido y anuncios personalizados. Puede aceptar todas las cookies o
          rechazarlas. Para obtener más información,
          consulte nuestra <a href="/politica-de-cookies">Política de cookies</a> y nuestra <a href="/politica-de-privacidad">Política de privacidad</a>.
        </p>
        <div className="cookie-consent-actions">
          <button onClick={acceptCookies} className="btn-accept">
            Aceptar todas
          </button>
          <button onClick={rejectCookies} className="btn-reject">
            Rechazar todas
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
