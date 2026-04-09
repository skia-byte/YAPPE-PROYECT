import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from './authContext';

const FavoritosContext = createContext();

export const useFavoritos = () => useContext(FavoritosContext);

export const FavoritosProvider = ({ children }) => {
  const { usuarioActual } = useAuth();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (usuarioActual) {
        setLoading(true);
        const docRef = doc(db, 'favoritos', usuarioActual.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFavoritos(docSnap.data().productos || []);
        } else {
          setFavoritos([]);
        }
        setLoading(false);
      }
    };
    fetchFavoritos();
  }, [usuarioActual]);

  const agregarAFavoritos = async (producto) => {
    if (usuarioActual) {
      const docRef = doc(db, 'favoritos', usuarioActual.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          productos: arrayUnion(producto)
        });
      } else {
        await setDoc(docRef, { productos: [producto] });
      }
      setFavoritos(prev => [...prev, producto]);
    }
  };

  const removerDeFavoritos = async (productoId) => {
    if (usuarioActual) {
      const docRef = doc(db, 'favoritos', usuarioActual.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const productoAEliminar = favoritos.find(p => p.id === productoId);
        if (productoAEliminar) {
          await updateDoc(docRef, {
            productos: arrayRemove(productoAEliminar)
          });
          setFavoritos(prev => prev.filter(p => p.id !== productoId));
        }
      }
    }
  };

  const esFavorito = (productoId) => {
    return favoritos.some(p => p.id === productoId);
  };

  const value = {
    favoritos,
    loading,
    agregarAFavoritos,
    removerDeFavoritos,
    esFavorito
  };

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
};