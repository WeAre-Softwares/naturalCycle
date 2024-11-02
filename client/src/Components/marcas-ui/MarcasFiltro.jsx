import React from 'react';
import { useNavigate } from 'react-router-dom';

export const MarcasFiltro = ({
  marcas,
  setMarcaSeleccionada,
  menuAbierto,
  setMenuAbierto,
}) => {
  const navigate = useNavigate();
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
              <a
                onClick={() => {
                  const marcaUrl = marca.nombre
                    .toLowerCase()
                    .replace(/\s+/g, '-');
                  navigate(`/marcas/${marcaUrl}`);
                  setMarcaSeleccionada(marca.marca_id); // Actualiza el estado con el ID
                  setMenuAbierto(false);
                }}
              >
                {marca.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
