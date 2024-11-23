import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuLateralPanel } from '../Components/MenuLateralPanel';
import {
  PanelProductItem,
  Pagination,
  SearchBar,
} from '../Components/panel-productos';
import { useProductSearch } from '../hooks/hooks-product/usePanelProductSearch';
import { useActivateProduct } from '../hooks/hooks-product/useActivateProduct';
import { useDeactivateProduct } from '../hooks/hooks-product/useDeactivateProduct';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NoHayResultados } from '../Components/NoHayResultados';

const LIMIT = 3;

export const PanelProducto = () => {
  const navigate = useNavigate();

  // Hook personalizado para la búsqueda y filtrado de productos
  const {
    productsData,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
    showInactive,
    toggleInactiveFilter,
    showNoStock,
    toggleNoStockFilter,
  } = useProductSearch(LIMIT);

  // Hooks para activar/desactivar productos
  const { activateProduct, isLoading: activating } = useActivateProduct();
  const { deactivateProduct, isLoading: deactivating } = useDeactivateProduct();

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Navegar a la edición de producto
  const handleEdit = (producto_id) => {
    navigate(`/editar-producto/${producto_id}`);
  };

  // Activar/Desactivar productos según el estado actual
  const handleToggleActive = async (producto_id, isActive) => {
    const result = isActive
      ? await deactivateProduct(producto_id)
      : await activateProduct(producto_id);

    if (result) {
      // Recargar los productos según el filtro activo
      if (showInactive) toggleInactiveFilter();
      else if (showNoStock) toggleNoStockFilter();
      else navigate(`/panel-principal`);
    }
  };

  return (
    <div className="div-gral-prod-creados">
      <ToastContainer />
      <div className="div-general-categoria-panel">
        <MenuLateralPanel />
        <div className="productos-creados-container">
          <h2 style={{ marginTop: '160px' }}>Lista de productos</h2>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
          <Link to="/crear-producto">
            <button className="button-abrir-crear-producto">
              <i className="fas fa-plus"></i>
            </button>
          </Link>

          <label style={{ margin: '1rem' }}>
            Mostrar inactivos
            <input
              style={{ margin: '0.5rem' }}
              type="checkbox"
              checked={showInactive}
              onChange={toggleInactiveFilter}
            />
          </label>
          <label style={{ margin: '1rem' }}>
            Sin stock
            <input
              style={{ margin: '0.5rem' }}
              type="checkbox"
              checked={showNoStock}
              onChange={toggleNoStockFilter}
            />
          </label>

          {loading ? (
            <section className="dots-container">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </section>
          ) : error ? (
            <NoHayResultados entidad={'productos'} />
          ) : productsData && productsData.length > 0 ? (
            <ul className="lista-productos-creados">
              {productsData.map((producto) => (
                <PanelProductItem
                  key={producto.producto_id}
                  producto={producto}
                  onEdit={handleEdit}
                  onToggleActive={handleToggleActive}
                  isProcessing={activating || deactivating}
                />
              ))}
            </ul>
          ) : (
            <NoHayResultados entidad={'productos'} />
          )}

          {totalPages > 0 && productsData && productsData.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={handleNextPage}
              onPrev={handlePrevPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
