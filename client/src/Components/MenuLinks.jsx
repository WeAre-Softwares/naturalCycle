import React from 'react';
import { Link } from 'react-router-dom';

export const MenuLinks = () => {
  return (
    <div className="section-footer">
      <h3>Menu</h3>
      <ul>
        <li>
          <Link to="/inicio">Inicio</Link>
        </li>
        <li>
          <Link to="/categorias">Categorías</Link>
        </li>
        <li>
          <Link to="/marcas">Marcas</Link>
        </li>
        <li>
          <Link to="/promociones">Promociones</Link>
        </li>
        <li>
          <Link to="/nuevos-ingresos">Nuevos ingresos</Link>
        </li>
        <li>
          <Link to="/productos-por-bulto-cerrado">Bulto cerrado</Link>
        </li>
        <li>
          <Link to="/about">Sobre nosotros</Link>
        </li>
        {/* <li>
          <Link to="/login">Mi cuenta</Link>
        </li> */}
      </ul>
    </div>
  );
};
