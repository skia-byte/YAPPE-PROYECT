import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "./authContext";

const CarritoContext = createContext();

const reminderMessages = [
  "¡No dejes que se enfríe! Tus productos te esperan.",
  "Tu carrito te extraña. ¿Listo para finalizar tu compra?",
  "¡Psst! Esos bocaditos en tu carrito se ven deliciosos.",
  "Estás a un paso de la felicidad. ¡Completa tu pedido!",
  "¡No te lo pierdas! Finaliza tu compra antes de que se agoten."
];

export const CarritoProvider = ({ children }) => {
  const { usuarioActual: user } = useAuth();
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [cargandoPago, setCargandoPago] = useState(false);
  const [errorPago, setErrorPago] = useState(null);
  const [showFirstItemToast, setShowFirstItemToast] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");

  const getGuestId = () => {
    let guestId = sessionStorage.getItem("guestId");
    if (!guestId) {
      guestId = "guest-" + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("guestId", guestId);
    }
    return guestId;
  };

  useEffect(() => {
    if (!user && !sessionStorage.getItem("guestId")) return;
    const uid = user ? user.uid : getGuestId();
    const q = query(collection(db, "carrito"), where("userId", "==", uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productos = snapshot.docs.map((docu) => ({ ...docu.data(), docId: docu.id }));
      setCarrito(productos);
    }, (error) => {
      console.error("Error al escuchar el carrito: ", error);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const fusionarCarritos = async () => {
      if (!user) return;
      const guestId = sessionStorage.getItem("guestId");
      if (!guestId) return;

      const guestQ = query(collection(db, "carrito"), where("userId", "==", guestId));
      const guestSnap = await getDocs(guestQ);

      for (const d of guestSnap.docs) {
        const data = d.data();
        const qUser = query(
          collection(db, "carrito"),
          where("userId", "==", user.uid),
          where("id", "==", data.id)
        );
        const userSnap = await getDocs(qUser);

        if (userSnap.empty) {
          const newDocRef = doc(collection(db, "carrito"));
          await setDoc(newDocRef, { ...data, userId: user.uid });
          await deleteDoc(d.ref);
        } else {
          const userDoc = userSnap.docs[0];
          await updateDoc(userDoc.ref, {
            cantidad: (userDoc.data().cantidad || 0) + (data.cantidad || 0),
          });
          await deleteDoc(d.ref);
        }
      }
      sessionStorage.removeItem("guestId");
    };

    if (user) {
      fusionarCarritos();
    }
  }, [user]);

  const totalProductos = carrito.reduce((s, p) => s + (p.cantidad || 0), 0);

  const agregarAlCarrito = async (producto, cantidadAAgregar = 1) => {
    const isFirstProduct = totalProductos === 0;
    const id = producto.id || producto.productoId;
    if (!id) return console.error("Producto sin ID");

    const uid = user ? user.uid : getGuestId();
    const qExistente = query(
      collection(db, "carrito"),
      where("userId", "==", uid),
      where("id", "==", id)
    );

    const snap = await getDocs(qExistente);

    if (snap.empty) {
      const ref = doc(collection(db, "carrito"));
      await setDoc(ref, {
        ...producto,
        cantidad: cantidadAAgregar,
        userId: uid,
        id,
      });
    } else {
      const docExistente = snap.docs[0];
      const data = docExistente.data();
      await updateDoc(doc(db, "carrito", docExistente.id), {
        cantidad: (data.cantidad || 0) + cantidadAAgregar,
      });
    }

    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);

    if (isFirstProduct) {
      setShowFirstItemToast(true);
      setTimeout(() => setShowFirstItemToast(false), 4000);
    }
  };

  const cambiarCantidad = async (docId, delta) => {
    const docRef = doc(db, "carrito", docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error("El producto no se encontró en el carrito.");
      return;
    }

    const nuevaCantidad = (docSnap.data().cantidad || 0) + delta;

    if (nuevaCantidad <= 0) {
      await deleteDoc(docRef);
    } else {
      await updateDoc(docRef, { cantidad: nuevaCantidad });
    }
  };

  const eliminarProducto = async (docId) => {
    await deleteDoc(doc(db, "carrito", docId));
  };

  const vaciarCarrito = async () => {
    const uid = user ? user.uid : getGuestId();
    const qCarrito = query(collection(db, "carrito"), where("userId", "==", uid));
    const snap = await getDocs(qCarrito);
    const promesasDeBorrado = snap.docs.map(d => deleteDoc(d.ref));
    await Promise.all(promesasDeBorrado);
  };

  useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      if (carrito.length > 0) {
        inactivityTimer = setTimeout(() => {
          const randomMsg = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
          setReminderMessage(randomMsg);
          setShowReminder(true);
        }, 180000); // 3 minutos
      }
    };

    const handleActivity = () => {
      if (showReminder) return;
      resetTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [carrito, showReminder]);

  const closeReminder = () => setShowReminder(false);

  const total = carrito.reduce((s, p) => s + (p.precio || 0) * (p.cantidad || 1), 0);

  const realizarPago = async ({ nombre, direccion, metodoPago, comprobante, costoEnvio }) => {
    if (!user) throw new Error("Debes iniciar sesión para realizar el pago");
    if (carrito.length === 0) throw new Error("Tu carrito está vacío");

    setCargandoPago(true);
    setErrorPago(null);

    try {
      const totalFinal = total + costoEnvio;
      const pedidoRef = doc(collection(db, "pedidos"));

      let comprobanteURL = null;

      if (comprobante) {
        const storageRef = ref(
          storage,
          `comprobantes/${user.uid}/${Date.now()}-${comprobante.name}`
        );

      await uploadBytes(storageRef, comprobante);
        comprobanteURL = await getDownloadURL(storageRef);
      }

      await setDoc(pedidoRef, {
        id: pedidoRef.id,
        userId: user.uid,
        correoUsuario: user.email || "No especificado",
        nombreCliente: nombre,
        direccionEnvio: direccion,
        metodoPago,
        comprobante: comprobanteURL,
        items: carrito.map(item => ({ ...item })),
        delivery: costoEnvio,
        totalProductos,
        subtotal: total,
        totalFinal,
        fechaCreacion: serverTimestamp(),
        estado: "pendiente",
      });

      await vaciarCarrito();
      return pedidoRef.id;
    } catch (error) {
      console.error(" Error al registrar pedido:", error);
      setErrorPago(error.message);
      throw error;
    } finally {
      setCargandoPago(false);
    }
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarProducto,
        cambiarCantidad,
        vaciarCarrito,
        total,
        totalProductos,
        mostrarCarrito,
        setMostrarCarrito,
        realizarPago,
        cargandoPago,
        errorPago,
        showFirstItemToast,
        showAddedToast,
        showReminder,
        reminderMessage,
        closeReminder,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);
