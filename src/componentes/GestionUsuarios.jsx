import { useState, useEffect, useCallback } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, doc, updateDoc, query } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { FaSave, FaTimes } from "react-icons/fa";
import { ChevronLeft, ChevronRight, Loader, AlertTriangle, User, Edit, Trash2, RefreshCw } from "lucide-react";

const functions = getFunctions();
const deleteUserCallable = httpsCallable(functions, "deleteUser");
const ROLES = ["cliente", "editor", "admin"];
const ROLE_ORDER = { admin: 1, editor: 2, cliente: 3 };

export default function GestionUsuarios() {
  const { usuarioActual } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoRol, setNuevoRol] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [filtro, setFiltro] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'rol', direction: 'asc' });

  const fetchUsuarios = useCallback(async () => {
    if (!cargando) setCargando(true);
    try {
      const q = query(collection(db, "usuarios"));
      const querySnapshot = await getDocs(q);
      const listaUsuarios = querySnapshot.docs.map((docu) => ({
        id: docu.id,
        ...docu.data(),
        fechaCreacion: docu.data().fechaCreacion?.toDate(),
      }));
      setAllUsers(listaUsuarios);
      setError(null);
    } catch (err) {
      const errorMessage = "Error al cargar los usuarios. " + err.message;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setCargando(false);
    }
  }, [cargando]);

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let filtered = allUsers.filter(u => 
      (u.username && u.username.toLowerCase().includes(filtro.toLowerCase())) ||
      (u.correo && u.correo.toLowerCase().includes(filtro.toLowerCase()))
    );

    filtered.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (sortConfig.key === 'rol') {
        valA = ROLE_ORDER[a.rol] || 99;
        valB = ROLE_ORDER[b.rol] || 99;
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setDisplayedUsers(filtered);
    setCurrentPage(1);

  }, [allUsers, filtro, sortConfig]);

  const handleGuardarRol = async (id, rolActual) => {
    if (rolActual === "admin" && allUsers.filter((u) => u.rol === "admin").length <= 1 && nuevoRol !== "admin") {
      toast.error("¡Error! No puedes quitar el rol al único administrador.");
      return;
    }
    if (nuevoRol === "") {
      toast.error("Por favor, selecciona un nuevo rol.");
      return;
    }
    
    const toastId = toast.loading("Actualizando rol...");
    try {
      const userRef = doc(db, "usuarios", id);
      await updateDoc(userRef, { rol: nuevoRol });
      await fetchUsuarios();
      setEditandoId(null);
      toast.success("Rol actualizado con éxito.", { id: toastId });
    } catch (err) {
      toast.error("Error al actualizar el rol. " + err.message, { id: toastId });
    }
  };

  const handleDeleteUser = async (usuario) => {
    if (!window.confirm(`¡ATENCIÓN! Estás a punto de eliminar al usuario ${usuario.correo}. ¿Continuar?`)) return;
      
    const toastId = toast.loading("Eliminando usuario...");
    try {
      const result = await deleteUserCallable({ docId: usuario.id });
      if (result.data?.success) {
        toast.success(`Usuario eliminado con éxito.`, { id: toastId });
        await fetchUsuarios();
      } else {
        throw new Error(result.data?.message || "Error desconocido.");
      }
    } catch (error) {
      toast.error(`Error al eliminar: ${error.message}`, { id: toastId });
    }
  };
  
  const handleSortChange = (e) => {
    const [key, direction] = e.target.value.split('_');
    setSortConfig({ key, direction });
  }

  const puedeEditar = (usuario) => {
    if (!usuarioActual || usuario.id === usuarioActual.uid) return false;
    if (usuarioActual.rol === 'admin') return true;
    if (usuarioActual.rol === 'editor' && !['admin', 'editor'].includes(usuario.rol)) return true;
    return false;
  }
  
  const puedeEliminar = (usuario) => {
    if (!usuarioActual || usuario.id === usuarioActual.uid) return false;
    return usuarioActual.rol === 'admin';
  }

  const totalPages = Math.ceil(displayedUsers.length / usersPerPage);
  const paginatedUsers = displayedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const renderRoleBadge = (rol) => (
    <span className={`px-2.5 py-1 text-sm font-semibold rounded-full capitalize ${
      rol === "admin" ? "bg-red-200 text-red-800"
      : rol === "editor" ? "bg-pink-200 text-pink-800"
      : "bg-gray-200 text-gray-800"
    }`}>
      {rol}
    </span>
  );

  return (
    <div className="space-y-6 p-4 sm:p-0">
       <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#8f2133]">Historial de Usuarios</h3>
          <p className="text-sm text-gray-600">Total: {allUsers.length} usuarios</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <input 
              type="text"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              placeholder="Buscar usuario..."
              className="w-full sm:w-40 p-2.5 rounded-lg border-2 border-[#f5bfb2] focus:outline-none focus:ring-2 focus:ring-[#d8718c]"
            />
            <div className="flex items-center gap-2">
                <select onChange={handleSortChange} defaultValue="rol_asc" className="p-2.5 w-full sm:w-auto text-base appearance-none bg-white border-2 border-[#f5bfb2] text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8718c]">
                  <option value="rol_asc">Por Rol</option>
                  <option value="fechaCreacion_desc">Más recientes</option>
                  <option value="fechaCreacion_asc">Más antiguos</option>
                  <option value="username_asc">Username (A-Z)</option>
                </select>
                <button onClick={fetchUsuarios} className="p-3 border-2 border-[#f5bfb2] text-[#d16170] rounded-lg hover:bg-rose-50 disabled:opacity-50" title="Actualizar" disabled={cargando}>
                  <RefreshCw size={18} className={cargando ? 'animate-spin' : ''} />
                </button>
            </div>
        </div>
      </div>
      
      {cargando ? (
        <div className="flex justify-center items-center py-20"><Loader className="animate-spin text-[#d16170]" size={40} /><p className="ml-4 text-lg text-gray-600">Cargando...</p></div>
      ) : error ? (
        <div className="flex items-center gap-3 text-red-700 bg-red-100/80 p-4 rounded-lg"><AlertTriangle size={24} /><p>{error}</p></div>
      ) : (
        <>
          <div className="md:hidden grid grid-cols-1 gap-4">
            {paginatedUsers.map((usuario) => (
               <div key={usuario.id} className="bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-lg space-y-4">
               <div className="flex items-center gap-4">
                   {usuario.fotoURL ? (
                       <img src={usuario.fotoURL} alt={usuario.username} className="w-16 h-16 rounded-full object-cover border-2 border-pink-100"/>
                   ) : (
                       <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                           <User size={30} className="text-gray-400" />
                       </div>
                   )}
                   <div className="overflow-hidden">
                       <p className="font-bold text-lg text-gray-800 truncate">@{usuario.username}</p>
                       <p className="text-sm text-gray-500 truncate">{usuario.correo}</p>
                   </div>
               </div>
               
               <div className="pt-3 space-y-3">
                   {editandoId === usuario.id ? (
                       <div className="space-y-2">
                           <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)} className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#d8718c]">
                               {ROLES.map(rol => <option key={rol} value={rol}>{rol}</option>)}
                           </select>
                           <div className="flex gap-2">
                               <button onClick={() => handleGuardarRol(usuario.id, usuario.rol)} className="w-full mt-2 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 font-semibold"><FaSave size={16} /> Guardar</button>
                               <button onClick={() => setEditandoId(null)} className="w-full mt-2 bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2 font-semibold"><FaTimes size={16} /> Cancelar</button>
                           </div>
                       </div>
                   ) : (
                       <>
                           <div className="w-full text-center">{renderRoleBadge(usuario.rol)}</div>
                           {(puedeEditar(usuario) || puedeEliminar(usuario)) && (
                               <div className="flex gap-2 pt-3 border-t border-gray-100">
                                   {puedeEditar(usuario) && <button onClick={() => {setEditandoId(usuario.id); setNuevoRol(usuario.rol);}} className="w-full bg-[#d16170] text-white p-2.5 rounded-lg hover:bg-[#b94a5b] flex items-center justify-center gap-2 font-semibold"><Edit size={16} /> Editar</button>}
                                   {puedeEliminar(usuario) && <button onClick={() => handleDeleteUser(usuario)} className="w-full bg-red-600 text-white p-2.5 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-semibold"><Trash2 size={16} /> Eliminar</button>}
                               </div>
                           )}
                       </>
                   )}
               </div>
           </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto bg-white rounded-lg border-2 border-[#f5bfb2]">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-[#d16170] text-xs text-white uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">Usuario</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Correo</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Rol</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Fecha de Creación</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5bfb2]">
                {paginatedUsers.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-[#fff3f0]/60">
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                      @{usuario.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{usuario.correo}</td>
                    <td className="px-6 py-4">
                      {editandoId === usuario.id ? (
                        <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)} className="bg-white border border-[#f5bfb2] text-[#7a1a0a] px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#d8718c] text-sm">
                          {ROLES.map(rol => <option key={rol} value={rol}>{rol}</option>)}
                        </select>
                      ) : ( renderRoleBadge(usuario.rol) )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{usuario.fechaCreacion ? format(usuario.fechaCreacion, "dd/MM/yyyy HH:mm") : "N/A"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {editandoId === usuario.id ? (
                          <>
                            <button onClick={() => handleGuardarRol(usuario.id, usuario.rol)} className="text-green-600 hover:text-green-800" title="Guardar"><FaSave size={20}/></button>
                            <button onClick={() => setEditandoId(null)} className="text-gray-600 hover:text-gray-800" title="Cancelar"><FaTimes size={20}/></button>
                          </>
                        ) : (
                          <>
                            {puedeEditar(usuario) && <button onClick={() => {setEditandoId(usuario.id); setNuevoRol(usuario.rol);}} className="text-[#d16170] hover:text-[#b94a5b]" title="Editar Rol"><Edit size={20} /></button>}
                            {puedeEliminar(usuario) && <button onClick={() => handleDeleteUser(usuario)} className="text-red-600 hover:text-red-700" title="Eliminar Usuario"><Trash2 size={20} /></button>}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
             <div className="flex justify-center items-center pt-6 gap-2">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-3 rounded-full bg-white text-[#d16170] shadow-md hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300" aria-label="Página Anterior"><ChevronLeft size={20} /></button>
                <div className="flex bg-white rounded-full shadow-md px-4 py-2 gap-2">
                  {[...Array(totalPages)].map((_, i) => (<button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-full font-bold transition-all duration-300 ${currentPage === i + 1 ? "bg-[#d16170] text-white scale-110 shadow-lg" : "text-gray-500 hover:bg-rose-50 hover:text-[#d16170]"}`}>{i + 1}</button>))}
                </div>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-3 rounded-full bg-white text-[#d16170] shadow-md hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300" aria-label="Página Siguiente"><ChevronRight size={20} /></button>
              </div>
          )}
        </>
      )}
    </div>
  );
}