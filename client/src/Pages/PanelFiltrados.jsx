import React, { useState } from 'react';
import { MenuLateralPanel } from '../Components/MenuLateralPanel';
import { useNavigate } from 'react-router-dom';
import { useFiltradoPaginado } from '../hooks/useFiltradoPaginado';
import { Pagination } from '../Components/panel-productos/Pagination';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useDeactivateCategory } from '../hooks/hooks-category/useDeactivateCategory';
import { useDeactivateEtiqueta } from '../hooks/hooks-etiqueta/useDeactivateEtiqueta';
import { useDeactivateBrand } from '../hooks/hooks-brand/useDeactivateBrand';
import { useActivateCategory } from '../hooks/hooks-category/useActivateCategory';
import { useActivateEtiqueta } from '../hooks/hooks-etiqueta/useActivateEtiqueta';
import { useActivateBrand } from '../hooks/hooks-brand/useActivateBrand';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NoHayResultados } from '../Components/NoHayResultados';

const LIMIT = 3;

export const PanelFiltrados = () => {
  const navigate = useNavigate();
  const [tipoCreacion, setTipoCreacion] = useState('marca');
  const [searchTerm, setSearchTerm] = useState('');
  const [isInactive, setIsInactive] = useState(false);

  const debouncedSearchTerm = useDebouncedValue(searchTerm, 600);

  // Hook personalizado para paginación y filtrado
  const { data, currentPage, totalItems, isLoading, itemsPerPage, goToPage } =
    useFiltradoPaginado(tipoCreacion, debouncedSearchTerm, LIMIT, isInactive);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleTipoCreacion = (e) => setTipoCreacion(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const toggleInactiveFilter = () => setIsInactive((prev) => !prev);

  const { deactivateCategory } = useDeactivateCategory();
  const { deactivateBrand } = useDeactivateBrand();
  const { deactivateEtiqueta } = useDeactivateEtiqueta();
  const { activateCategory } = useActivateCategory();
  const { activateBrand } = useActivateBrand();
  const { activateEtiqueta } = useActivateEtiqueta();

  const handleRedirect = () => {
    if (tipoCreacion === 'marca') navigate('/crear-marca');
    else if (tipoCreacion === 'categoria') navigate('/crear-categoria');
    else if (tipoCreacion === 'etiqueta') navigate('/crear-etiqueta');
  };

  const handleEdit = (item) => {
    if (tipoCreacion === 'marca')
      navigate(`/actualizar-marca/${item.marca_id}`);
    else if (tipoCreacion === 'categoria')
      navigate(`/actualizar-categoria/${item.categoria_id}`);
    else if (tipoCreacion === 'etiqueta')
      navigate(`/actualizar-etiqueta/${item.etiqueta_id}`);
  };

  const handleDeactivateOrActivate = async (item) => {
    if (!item) {
      console.error('El item no está definido');
      return;
    }

    let success = false;
    if (item.esta_activo) {
      if (tipoCreacion === 'marca') {
        success = await deactivateBrand(item.marca_id);
      } else if (tipoCreacion === 'categoria') {
        success = await deactivateCategory(item.categoria_id);
      } else if (tipoCreacion === 'etiqueta') {
        success = await deactivateEtiqueta(item.etiqueta_id);
      }
    } else {
      success = await activateItem(item, tipoCreacion);
    }

    if (success) {
      goToPage(1);
    }
  };

  const activateItem = async (item, tipoCreacion) => {
    let success = false;
    if (tipoCreacion === 'marca') {
      success = await activateBrand(item.marca_id);
    } else if (tipoCreacion === 'categoria') {
      success = await activateCategory(item.categoria_id);
    } else if (tipoCreacion === 'etiqueta') {
      success = await activateEtiqueta(item.etiqueta_id);
    }

    if (success) {
      setTimeout(() => {
        navigate('/panel-principal');
      }, 1800);
    }
  };

  return (
    <div className="div-gral-prod-creados">
      <ToastContainer />
      <div className="div-general-categoria-panel">
        <MenuLateralPanel />
        <div className="productos-creados-container">
          <h2>Filtrados</h2>

          <input
            type="text"
            placeholder={`Buscar por ${tipoCreacion}`}
            className="buscar-producto-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <select
            value={tipoCreacion}
            onChange={handleTipoCreacion}
            className="select-tipo-filtrado"
          >
            <option value="marca">Marca</option>
            <option value="categoria">Categoría</option>
            <option value="etiqueta">Etiqueta</option>
          </select>

          <button
            onClick={handleRedirect}
            className="button-abrir-crear-producto"
          >
            <i className="fas fa-plus"></i>
          </button>

          <label style={{ margin: '1rem' }}>
            Mostrar inactivos
            <input
              style={{ margin: '0.5rem' }}
              type="checkbox"
              checked={isInactive}
              onChange={toggleInactiveFilter}
            />
          </label>

          {isLoading ? (
            <section class="dots-container">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </section>
          ) : (
            <>
              <h3>
                {tipoCreacion.charAt(0).toUpperCase() + tipoCreacion.slice(1)}:
              </h3>
              <ul className="productos-lista-panel">
  {Array.isArray(data) && data.length > 0 ? (
    [...data] 
      .sort((a, b) => a.nombre.localeCompare(b.nombre)) 
      .map((item, index) => (
        <li className="producto-item-panel" key={index}>
          {item.imagen && (
            <img
              src={item.imagen}
              alt={`Imagen de ${item.nombre}`}
              className="producto-imagen"
            />
          )}
          <div className="producto-detalles">
            <strong>{item.nombre}</strong>
          </div>
          <div className="producto-botones">
            <button
              className="crear-filtrado-button"
              onClick={() => handleEdit(item)}
              disabled={item.esta_activo !== true}
            >
              Editar
            </button>
            <button
              className="crear-filtrado-button"
              onClick={() => handleDeactivateOrActivate(item)}
            >
              {item.esta_activo ? 'Eliminar' : 'Activar'}
            </button>
          </div>
        </li>
      ))
  ) : (
    <NoHayResultados entidad={'resultados'} />
  )}
</ul>


              {/* Mostrar paginación sólo si hay al menos una página de resultados */}
              {totalItems > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onNext={() => goToPage(currentPage + 1)}
                  onPrev={() => goToPage(currentPage - 1)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
