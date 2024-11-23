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
    setShowInactive,
    showNoStock,
    setShowNoStock,
  } = useProductSearch(LIMIT);

  const { activateProduct, isLoading: activating } = useActivateProduct();
  const { deactivateProduct, isLoading: deactivating } = useDeactivateProduct();

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleEdit = (producto_id) => {
    navigate(`/editar-producto/${producto_id}`);
  };

  const handleToggleActive = async (producto_id, isActive) => {
    const result = isActive
      ? await deactivateProduct(producto_id)
      : await activateProduct(producto_id);

    // Si se realiza correctamente, recargar los productos según el filtro actual
    if (result) {
      setTimeout(() => {
        navigate(`/panel-principal`);
      }, 2200);
      toggleInactiveFilter(); // Al cambiar el filtro se actualiza la lista
      toggleInactiveFilter();
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
              onChange={() => setShowInactive((prev) => !prev)}
            />
          </label>
          <label style={{ margin: '1rem' }}>
            Sin stock
            <input
              style={{ margin: '0.5rem' }}
              type="checkbox"
              checked={showNoStock}
              onChange={() => setShowNoStock((prev) => !prev)}
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

          {/* Mostrar paginación sólo si hay al menos una página de resultados */}
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
