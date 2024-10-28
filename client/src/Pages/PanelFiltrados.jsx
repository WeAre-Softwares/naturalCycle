import React, { useState } from 'react';
import { MenuLateralPanel } from '../Components/MenuLateralPanel';
import { Link } from 'react-router-dom';
import { useFiltradoPaginado } from '../hooks/useFiltradoPaginado';
import { Pagination } from '../Components/panel-productos/Pagination';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

// Límite de productos para centralizar su valor
const LIMIT = 3;

export const PanelFiltrados = () => {
  const [tipoCreacion, setTipoCreacion] = useState('marca');
  const [searchTerm, setSearchTerm] = useState('');

  // Custom hook de debounce
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 600);

  // Hook personalizado para paginación y filtrado
  const { data, currentPage, totalItems, isLoading, itemsPerPage, goToPage } =
    useFiltradoPaginado(tipoCreacion, debouncedSearchTerm, LIMIT); // Pasarle el debouncedSearchTerm

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleTipoCreacion = (e) => setTipoCreacion(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  return (
    <div className="div-gral-prod-creados">
      <div className="div-general-categoria-panel">
        <MenuLateralPanel />
        <div className="productos-creados-container">
          <h2>Filtrados</h2>

          {/* Input de búsqueda */}
          <input
            type="text"
            placeholder={`Buscar por ${tipoCreacion}`}
            className="buscar-producto-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {/* Select para elegir entre marca, categoría y etiqueta */}
          <select
            value={tipoCreacion}
            onChange={handleTipoCreacion}
            className="select-tipo-filtrado"
          >
            <option value="marca">Marca</option>
            <option value="categoria">Categoría</option>
            <option value="etiqueta">Etiqueta</option>
          </select>

          <Link to="/crear-filtrado">
            <button className="button-abrir-crear-producto">
              <i className="fas fa-plus"></i>
            </button>
          </Link>

          {/* Renderizado de lista de elementos */}
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <h3>
                {tipoCreacion.charAt(0).toUpperCase() + tipoCreacion.slice(1)}:
              </h3>
              <ul className="productos-lista-panel">
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
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
                          onClick={() =>
                            console.log(`Editar ${tipoCreacion}`, item)
                          }
                        >
                          Editar
                        </button>
                        <button
                          className="crear-filtrado-button"
                          onClick={() =>
                            console.log(`Eliminar ${tipoCreacion}`, item)
                          }
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No se encontraron resultados.</p>
                )}
              </ul>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNext={() => goToPage(currentPage + 1)}
                onPrev={() => goToPage(currentPage - 1)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
