import React from 'react';

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
              <a
                href="#"
                onClick={() => {
                  setCategoriaSeleccionada(categoria.categoria_id);
                  setMenuAbierto(false);
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
