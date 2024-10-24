import React, { useEffect, useState } from 'react';
import { MenuLateralPanel } from '../Components/MenuLateralPanel';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAllProducts } from '../hooks/useGetAllProducts';
import { useSearchProducts } from '../hooks/useSearchProducts';

export const PanelProducto = () => {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda normal
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm); // Término de búsqueda debounced
  const limit = 3; // Cantidad de productos por página

  // Hook para cargar productos sin búsqueda
  const {
    productsData: allProductsData,
    loading: loadingAllProducts,
    error: errorAllProducts,
  } = useGetAllProducts(limit, offset);

  // Hook para la búsqueda de productos, ahora usamos `debouncedSearchTerm`
  const {
    productsData: searchProductsData,
    loading: loadingSearch,
    error: errorSearch,
  } = useSearchProducts(debouncedSearchTerm, limit, offset);

  // Determina qué datos usar: productos filtrados o todos
  const productsData = debouncedSearchTerm
    ? searchProductsData?.productos
    : allProductsData?.productos;

  const loading = debouncedSearchTerm ? loadingSearch : loadingAllProducts;
  const error = debouncedSearchTerm ? errorSearch : errorAllProducts;

  // Actualiza el total dinámicamente según si hay búsqueda o no
  const total = debouncedSearchTerm
    ? searchProductsData?.total || 0
    : allProductsData?.total || 0;

  // Calcula las páginas basadas en el total de productos
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
  const currentPage = Math.floor(offset / limit) + 1;

  // Manejar la búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Actualizar el término de búsqueda
    setOffset(0); // Reiniciar la paginación cuando se hace una nueva búsqueda
  };

  // Debounce de la búsqueda: retrasar la actualización del término de búsqueda
  const debouncedSearch = debounce((term) => {
    setDebouncedSearchTerm(term);
  }, 600); // 600ms de debounce

  // Actualiza el término de búsqueda con debounce
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  // Manejo de la paginación
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setOffset((prevOffset) => prevOffset - limit);
    }
  };

  const handleEdit = (producto_id) => {
    navigate(`/editarproducto/${producto_id}`);
  };

  return (
    <div className="div-gral-prod-creados">
      <div className="div-general-categoria-panel">
        <MenuLateralPanel />
        <div className="productos-creados-container">
          <h2>Lista de productos</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange} // Controlador de búsqueda
            placeholder="Buscar por nombre"
            className="buscar-producto-input"
          />
          <Link to="/crearproducto">
            <button className="button-abrir-crear-producto">
              <i className="fas fa-plus"></i>
            </button>
          </Link>

          {loading ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p>Ocurrió un error al cargar los productos.</p>
          ) : productsData && productsData.length > 0 ? (
            <ul className="productos-lista-panel">
              {productsData.map((producto) => (
                <li key={producto.producto_id} className="producto-item-panel">
                  <img
                    src={producto.imagenes[0]?.url || ''}
                    alt={producto.nombre}
                    className="producto-imagen"
                  />
                  <div className="producto-detalles">
                    <h3>{producto.nombre}</h3>
                    <p>Precio: ${producto.precio}</p>
                    <p>Marca: {producto.marca.nombre}</p>
                    <p>
                      Categoría:{' '}
                      {producto.categorias.map((c) => c.nombre).join(', ')}
                    </p>
                  </div>
                  <div className="producto-botones">
                    <button
                      className="crear-filtrado-button"
                      onClick={() => handleEdit(producto.producto_id)}
                    >
                      Editar
                    </button>
                    <button className="crear-filtrado-button">Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No se encontraron productos.</p>
          )}

          <div className="pagination-info">
            <p>
              Página {currentPage} de {totalPages}
            </p>
            <div className="botones-promocion">
              <button
                className="btn-carrusel"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                className="btn-carrusel"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
