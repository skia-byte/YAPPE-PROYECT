import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/authContext';

const DejarComentario = ({ productoId }) => {
  const { usuarioActual: usuario } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [nombreAnonimo, setNombreAnonimo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleGuardarComentario = async () => {
    if (rating === 0) {
      alert('Por favor, selecciona una calificación.');
      return;
    }

    if (comentario.trim() === '') {
      alert('Por favor, escribe un comentario.');
      return;
    }

    if (!usuario && nombreAnonimo.trim() === '') {
      alert('Por favor, escribe tu nombre.');
      return;
    }

    setEnviando(true);
    try {
      const datosComentario = {
        productoId,
        rating,
        texto: comentario,
        fecha: serverTimestamp(),
        autorId: usuario ? usuario.uid : null,
        autorNombre: usuario ? (usuario.displayName || usuario.nombre) : nombreAnonimo,
        autorFotoURL: usuario ? usuario.fotoURL : null
      };

      await addDoc(collection(db, 'comentarios'), datosComentario);

      setEnviado(true);
      setComentario('');
      setRating(0);
      setNombreAnonimo('');
    } catch (error) {
      console.error('Error al guardar el comentario:', error);
      alert('Hubo un error al enviar tu comentario. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="mt-8 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-2xl text-center">
        <p className="text-green-800 font-semibold">¡Gracias por tu opinión!</p>
        <p className="text-green-600">Tu comentario ha sido enviado correctamente.</p>
        <button
          onClick={() => setEnviado(false)}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Dejar otra opinión
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        {usuario && (
          <div className="shrink-0">
            {usuario.fotoURL ? (
              <img
                src={usuario.fotoURL}
                alt={usuario.nombre || usuario.displayName}
                className="w-11 h-11 rounded-full object-cover"
              />
            ) : (

              <div className="w-11 h-11 rounded-full bg-[#a34d5f] flex items-center justify-center text-white font-bold text-xl">
                {(usuario.nombre || usuario.displayName)
                  ? (usuario.nombre || usuario.displayName).charAt(0).toUpperCase()
                  : 'A'}
              </div>
            )}
          </div>
        )}

        <div className="grow">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
            Escribe tu opinión
          </h3>

          {!usuario && (
            <div className="mb-3">
              <label
                htmlFor="nombreAnonimo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tu nombre
              </label>
              <input
                type="text"
                id="nombreAnonimo"
                value={nombreAnonimo}
                onChange={(e) => setNombreAnonimo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5bfb2] focus:border-transparent"
                placeholder="Escribe tu nombre"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3">
            <span className="mb-2 sm:mb-0 sm:mr-3 text-gray-700">
              Tu calificación:
            </span>
            <div className="flex">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <svg
                    key={index}
                    className={`w-6 h-6 sm:w-7 sm:h-7 cursor-pointer ${ratingValue <= (hoverRating || rating)
                        ? 'text-[#d8718c]'
                        : 'text-gray-300'
                      }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHoverRating(ratingValue)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.175 0l-3.366 2.446c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                  </svg>
                );
              })}
            </div>
          </div>

          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#f5bfb2] focus:border-transparent"
            rows="3"
            placeholder={`¿Qué te pareció el producto${usuario ? ', ' + (usuario.nombre || usuario.displayName) : ''
              }?`}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            disabled={enviando}
          ></textarea>

          <button
            onClick={handleGuardarComentario}
            className={`mt-3 bg-[#a34d5f] text-white px-6 py-2 rounded-full hover:bg-[#912646] transition shadow-md w-full sm:w-auto ${enviando ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={enviando}
          >
            {enviando ? 'Enviando...' : 'Enviar Opinión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DejarComentario;
