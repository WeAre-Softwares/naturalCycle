import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuLateralPanel } from '../Components/MenuLateralPanel';
import {
  SearchBar,
  Pagination,
  PanelProductItem,
} from '../Components/panel-productos';
import { useProductSearch } from '../hooks/usePanelProductSearch';

// Límite de productos para centralizar su valor
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
  } = useProductSearch(LIMIT);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleEdit = (producto_id) => {
    navigate(`/editar-producto/${producto_id}`);
  };

  const handleDelete = (producto_id) => {
    // Aquí va la lógica para eliminar el producto
  };

  return (
    <div className="div-gral-prod-creados">
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

          {loading ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p>Ocurrió un error al cargar los productos.</p>
          ) : productsData && productsData.length > 0 ? (
            <ul className="lista-productos-creados">
              {productsData.map((producto) => (
                <PanelProductItem
                  key={producto.producto_id}
                  producto={producto}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          ) : (
            <p>No se encontraron productos.</p>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
          />
        </div>
      </div>
    </div>
  );
};
