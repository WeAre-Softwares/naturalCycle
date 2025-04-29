import { useEffect, useState } from "react";
import { getAllUsersService } from "../services/users-services/getAll-users";
import useAuthStore from '../store/use-auth-store';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/Panel/userlistForAdmin.css'
import { set } from "react-hook-form";



const UserList = ({onUsuarioSeleccionado,onSalir}) => {
  const {token} = useAuthStore();   
  const [isLoading, setIsLoading]=useState(false);
  const [page, setPage] = useState(1);
  const [usuarios, setUsuarios] = useState([]);
  const [userSelect, setUserSelect] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const elementsPerPage = 3;
  const maxPagesToShow = 5; // cantidad de botones visibles como máximo


  const usuariosFiltrados = usuarios.filter((usuario) => {
    const searchTerm = busqueda.toLowerCase();
    return (
      (usuario.email && usuario.email.toLowerCase().includes(searchTerm)) ||
      (usuario.nombre && usuario.nombre.toLowerCase().includes(searchTerm)) ||
      (usuario.apellido && usuario.apellido.toLowerCase().includes(searchTerm)) ||
      (usuario.dni && usuario.dni.toLowerCase().includes(searchTerm)) ||
      (usuario.nombre_comercio && usuario.nombre_comercio.toLowerCase().includes(searchTerm))
    );
  });
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const result = await getAllUsersService(100, 0, token);
        setUsuarios(result.usuarios);
        console.log(result.usuarios)
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    

    fetchUsuarios();
    }, []);
  const totalPages = Math.ceil((busqueda?usuariosFiltrados.length: usuarios.length)/elementsPerPage)||1;
  const getVisiblePages = () => {
    let start = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let end = start + maxPagesToShow - 1;
  
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPagesToShow + 1);
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [busqueda, totalPages]);
  const handleSeleccionar = (id) => {
    const seleccionado = usuarios.find((u) => u.usuario_id.toString() === id);

    setUserSelect(seleccionado);
  };
  const handleConfirmar = async ()=>{
    setIsLoading(true);
    const customAlert = Swal.mixin({
        customClass: {
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
        popup: 'custom-alert-container',
        },
        buttonsStyling: false,
    });    
    
    customAlert
        .fire({
        title: `¿Crar pedido para ${userSelect.email}?`,
        text: 'Confirma tu pedido para continuar.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
        })
        .then(async (result) => {
        if (result.isConfirmed) {
          setIsLoading(false);
          onUsuarioSeleccionado?.(userSelect)
          handleSalir();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          setIsLoading(false);  
          customAlert.fire({
            title: 'Cancelado',
            text: 'Tu pedido no ha sido confirmado.',
            icon: 'error',
            });
        }
        });
   }
  const handleCancelar = () => {
    setUserSelect(null);
  }
  const handleSalir=()=>{
    onSalir();
  }
return (
    <div className="form-vacio">
      <h2 className="text-xl font-semibold mb-4">Buscar Cliente</h2>
      <input
        type="text"
        placeholder="Escribe un Email/Nombre/CUIT/Etc..."
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setUserSelect(null); // reinicia selección al cambiar búsqueda
          setPage(1);
        }}
        className="border p-2 rounded w-full"
      />
    
        {(busqueda ? usuariosFiltrados.length > 0 : usuarios.length > 0) && (
            <>
              <ul className="border rounded mt-2 max-h-40 overflow-y-auto bg-white shadow">
                {(busqueda ? usuariosFiltrados : usuarios)
                  .slice((page - 1) * elementsPerPage, page * elementsPerPage)
                  .map((usuario) => {
                    const isSelected = userSelect?.usuario_id === usuario.usuario_id;

                    return (
                      <li
                        key={usuario.usuario_id}
                        className={`user-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSeleccionar(usuario.usuario_id)}
                      >
                        <div className="dato"><strong>Nombre:</strong> {usuario.nombre}</div>
                        <div className="dato"><strong>Comercio:</strong> {usuario.nombre_comercio}</div>
                        <div className="dato"><strong>DNI:</strong> {usuario.dni}</div>
                        <div className="dato"><strong>Email:</strong> {usuario.email}</div>
                      </li>
                    );
                  })}
              </ul>
            </>
         )}
      <div className="pagination-container">
      {getVisiblePages().map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`page-button ${p === page ? 'active' : ''}`}
        >
          {p}
        </button>
      ))}
      </div>

      {busqueda && usuariosFiltrados.length === 0 && (<p className="mt-2 text-red-500">No se encontraron usuarios.</p>)}
      
      {userSelect && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <button className="btn-confirmUser" disabled={isLoading} onClick={handleConfirmar}>
          {isLoading ? (
            <div className="loader">
            <div className="justify-content-center jimu-primary-loading"></div>
          </div>
            ) : (
            'Confirmar'
            )}
            </button>
          <button className="btn-cancel"onClick={handleCancelar} disabled={isLoading}>Cancelar</button>
        </div>
      )}
      <button className="btn-back" onClick={handleSalir}>salir</button>
    </div>
  );
};

export default UserList;
