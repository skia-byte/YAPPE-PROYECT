import React from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaBook,
} from "react-icons/fa";

export default function Footer() {
  const socialLinks = [
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaTiktok, href: "#", label: "TikTok" },
  ];

  const navLinks = [
      { to: "/", text: "Inicio" },
      { to: "/productos", text: "Productos" },
      { to: "/nosotros", text: "Nosotros" },
      { to: "/novedades", text: "Novedades" },
  ]

  const legalLinks = [
    { to: "/politica-de-privacidad", text: "Política de Privacidad" },
    { to: "/politica-de-cookies", text: "Política de Cookies" },
  ]

  // Paleta de colores alineada con el NavBar
  const bgColor = "bg-[#fdd2d7]";
  const textColor = "text-[#9c2007]";
  const titleColor = "text-[#8a152e]";
  const accentColor = "text-[#da6786]";
  const hoverColor = "hover:text-[#e46945]";
  const borderColor = "border-[#f5bfb2]";

  return (
    <footer className={`${bgColor} ${textColor} border-t ${borderColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Col 1: Logo y Redes Sociales */}
          <div className="space-y-4">
            <Link to="/" className={`text-3xl font-extrabold tracking-wide ${accentColor} w-fit`}>
              BOM<span className={titleColor}>BOCADO</span>
            </Link>
            <p className="text-sm max-w-xs pr-4">
              La dulzura de nuestros postres, directo a tu corazón.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center bg-white/50 ${titleColor} rounded-full ${hoverColor} transition-all duration-300`}
                >
                  <Icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navegación */}
          <div className="space-y-4">
            <h3 className={`text-xl font-semibold ${titleColor}`}>Navegación</h3>
            <ul className="space-y-2 text-sm font-medium mt-4">
                {navLinks.map(link => (
                    <li key={link.to}>
                        <Link to={link.to} className={`${hoverColor} transition-colors duration-300`}>
                            {link.text}
                        </Link>
                    </li>
                ))}
            </ul>
          </div>

          {/* Col 3: Atención al Cliente */}
          <div className="space-y-4">
            <h3 className={`text-xl font-semibold ${titleColor}`}>Atención al Cliente</h3>
            <ul className="space-y-3 text-sm font-medium mt-4">
                <li className="flex items-start gap-3">
                  <FaPhoneAlt className={`${titleColor} mt-1 flex-shrink-0`} size={18} />
                  <a href="tel:+51987654321" className={`${hoverColor} transition-colors duration-300`}>
                    +51 987 654 321
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <FaEnvelope className={`${titleColor} mt-1 flex-shrink-0`} size={18} />
                  <a href="mailto:pedidos@bombocado.com" className={`${hoverColor} transition-colors duration-300`}>
                    pedidos@bombocado.com
                  </a>
                </li>
                 <li className="flex items-start gap-3">
                  <FaMapMarkerAlt className={`${titleColor} mt-1 flex-shrink-0`} size={18} />
                  <a href="https://www.google.com/maps/place/Av.+Primavera+123,+Miraflores,+Lima,+Perú" target="_blank" rel="noopener noreferrer" className={`${hoverColor} transition-colors duration-300`}>
                    Av. Primavera 123, Miraflores, Lima
                  </a>
                </li>
            </ul>
             <div className="pt-4">
                <Link to="/libro-de-reclamaciones" className={`group inline-flex items-center gap-3 border-2 ${borderColor} rounded-xl px-4 py-3 hover:bg-white/30 transition-all duration-300 shadow-sm w-full`}>
                    <FaBook className={`${titleColor} text-2xl group-hover:scale-110 transition-transform`}/>
                    <div>
                        <span className={`font-bold text-md ${titleColor}`}>Libro de Reclamaciones</span>
                    </div>
                </Link>
            </div>
          </div>
          
          {/* Col 4: Mapa */}
            <div className="space-y-4">
                <h3 className={`text-xl font-semibold ${titleColor}`}>Ubicación</h3>
                 <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.9560470969716!2d-77.03926262503623!3d-12.13166258816737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b7e1b4b5a533%3A0xa549043226dcfb18!2sBuenavista%20Caf%C3%A9!5e0!3m2!1ses-419!2spe!4v1753934291804!5m2!1ses-419!2spe"
                    height="200"
                    className="rounded-2xl shadow-md border-none w-full"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa de ubicación de BOMBOCADO"
                ></iframe>
            </div>
        </div>
      </div>

      {/* Barra Inferior de Copyright */}
      <div className={`py-4 border-t ${borderColor}/70`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm font-medium">
          <p>© {new Date().getFullYear()} BOMBOCADO. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-4 mt-2">
            {legalLinks.map(link => (
                <Link key={link.to} to={link.to} className={`${hoverColor} transition-colors duration-300`}>
                    {link.text}
                </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}