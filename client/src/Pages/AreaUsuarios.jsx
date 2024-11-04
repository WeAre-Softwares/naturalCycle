import React, { useState } from 'react';
import { MenuLateralPanel } from '../Components/MenuLateralPanel';
import { BarraBusquedaUsuario } from '../Components/panel-usuarios/BarraBusquedaUsuario';
import { UsuariosGrid } from '../Components/panel-usuarios/UsuariosGrid';
import { Pagination } from '../Components/panel-productos/Pagination';
import { usePaginatedUsers } from '../hooks/hooks-users/usePaginatedUsers';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { UsuarioDetalleCard } from '../Components/panel-usuarios/UsuarioDetalleCard';
import { useDarDeAltaUsuario } from '../hooks/hooks-users/useDarDeAltaUsuario';
import { useDarDeBajaUsuario } from '../hooks/hooks-users/useDarDeBajaUsuario';
import { useDarRangoEmpleadoUsuario } from '../hooks/hooks-users/useDarRangoEmpleadoUsuario';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LIMIT = 5;

export const AreaUsuarios = () => {
  const [isInactive, setIsInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Hook para activar usuarios
  const { darDeAltaUsuario, loading: loadingAlta } = useDarDeAltaUsuario();
  // Hook para desactivar usuarios
  const { darDeBajaUsuario, loading: loadingBaja } = useDarDeBajaUsuario();
  const { darRangoEmpleadoUsuario, loading: loadingEmpleado } =
    useDarRangoEmpleadoUsuario();

  // Aplica debounce al searchTerm con un retraso de 600 ms
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 600);

  const {
    data: usuarios,
    currentPage,
    totalItems,
    isLoading,
    itemsPerPage,
    goToPage,
  } = usePaginatedUsers(debouncedSearchTerm, LIMIT, isInactive);

  const toggleInactive = () => setIsInactive(!isInactive);

  const handleUsuarioClick = (usuario) => {
    setUsuarioSeleccionado(usuario);
  };

  const cerrarDetallesUsuario = () => {
    setUsuarioSeleccionado(null);
  };

  return (
    <div className="div-general-categoria-panel">
      <ToastContainer />
      <MenuLateralPanel />
      <div className="area-usuarios-container">
        <h1 className="area-usuarios-header">Área de Usuarios</h1>

        <BarraBusquedaUsuario
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <button
          onClick={toggleInactive}
          className="area-usuarios-toggle-button"
        >
          {isInactive ? 'Ver activos' : 'Ver inactivos'}
        </button>

        {isLoading ? (
          <section className="dots-container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </section>
        ) : (
          <>
            <UsuariosGrid
              usuarios={usuarios}
              mostrarDetallesUsuario={handleUsuarioClick}
              darDeAltaUsuario={darDeAltaUsuario}
              darDeBajaUsuario={darDeBajaUsuario}
              darRangoEmpleadoUsuario={darRangoEmpleadoUsuario}
            />

            {usuarioSeleccionado && (
              <UsuarioDetalleCard
                usuarioSeleccionado={usuarioSeleccionado}
                cerrarDetallesUsuario={cerrarDetallesUsuario}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / itemsPerPage)}
              onNext={() => goToPage(currentPage + 1)}
              onPrev={() => goToPage(currentPage - 1)}
            />
          </>
        )}
      </div>
    </div>
  );
};
