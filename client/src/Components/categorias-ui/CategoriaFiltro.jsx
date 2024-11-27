import React from 'react';
import { Link } from 'react-router-dom';

export const CategoriaFiltro = ({
  categorias,
  setCategoriaSeleccionada,
  menuAbierto,
  setMenuAbierto,
}) => {
  return (
    <>
      <div className="container-boton-filtrado">
        <button
          className="boton-categorias"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          Filtrar <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      <div
        className={`container-categorias-section-categorias ${
          menuAbierto ? 'menu-abierto' : ''
        }`}
      >
        <button className="cerrar-menu" onClick={() => setMenuAbierto(false)}>
          X
        </button>
        <h2 className="categorias-header">CATEGORÍAS</h2>
        <ul className="categorias-lista">
          {categorias.map((categoria) => (
            <li key={categoria.categoria_id}>
              <Link
                to={`/categorias/${categoria.nombre}`}
                onClick={() => {
                  setCategoriaSeleccionada(categoria.nombre);
                }}
              >
                {categoria.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
