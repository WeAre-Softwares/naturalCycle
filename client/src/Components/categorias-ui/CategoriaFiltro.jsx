import React from 'react';
import { useNavigate } from 'react-router-dom';

export const CategoriaFiltro = ({
  categorias,
  setCategoriaSeleccionada,
  menuAbierto,
  setMenuAbierto,
}) => {
  const navigate = useNavigate();
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
              <a
                onClick={() => {
                  const categoriaUrl = categoria.nombre
                    .toLowerCase()
                    .replace(/\s+/g, '-');
                  navigate(`/categorias/${categoriaUrl}`);
                  setCategoriaSeleccionada(categoria.categoria_id); // Actualiza el estado con el ID
                  setMenuAbierto(true);
                }}
              >
                {categoria.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
