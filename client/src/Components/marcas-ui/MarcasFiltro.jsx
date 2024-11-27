import React from 'react';
import { Link } from 'react-router-dom';

export const MarcasFiltro = ({
  marcas,
  setMarcaSeleccionada,
  menuAbierto,
  setMenuAbierto,
}) => {
  return (
    <>
      <div className="container-boton-filtrado">
        <button
          className="boton-marcas"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          Filtrar <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      <div
        className={`container-marcas-section-marcas ${
          menuAbierto ? 'menu-abierto' : ''
        }`}
      >
        <button className="cerrar-menu" onClick={() => setMenuAbierto(false)}>
          X
        </button>
        <h2 className="marcas-header">MARCAS</h2>
        <ul className="marcas-lista">
          {marcas.map((marca) => (
            <li key={marca.marca_id}>
              <Link
                to={`/marcas/${marca.nombre}`}
                onClick={() => {
                  setMarcaSeleccionada(marca.nombre);
                }}
              >
                {marca.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
