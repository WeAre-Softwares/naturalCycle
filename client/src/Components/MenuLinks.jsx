import React from 'react';
import { Link } from 'react-router-dom';

export const MenuLinks = () => {
  return (
    <div className="section-footer">
      <h3>Menu</h3>
      <ul>
        <li>
          <Link to="/home">Inicio</Link>
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
          <Link to="/new">Nuevos ingresos</Link>
        </li>
        <li>
          <Link to="/nosotros">Sobre nosotros</Link>
        </li>
        <li>
          <Link to="/Login">Mi cuenta</Link>
        </li>
      </ul>
    </div>
  );
};
