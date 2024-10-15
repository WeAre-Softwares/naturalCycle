import React from 'react';
import { Link } from 'react-router-dom';

export const NavLinks = ({ isOpen, toggleMenu }) => {
  return (
    <div className={`links-header ${isOpen ? 'open' : ''}`}>
      <button className="close-menu" onClick={toggleMenu}>
        <i className="fa-solid fa-backward-step"> M e n u</i>
      </button>
      <ul className="ul-menu-hamb">
        <li>
          <Link to="/Inicio" onClick={toggleMenu}>
            Inicio
          </Link>
        </li>
        <li>
          <Link
            to="/Categorias"
            className="link-categorias"
            onClick={toggleMenu}
          >
            Categorías
          </Link>
        </li>
        <li>
          <Link to="/Marcas" className="link-marcas" onClick={toggleMenu}>
            Marcas 
          </Link>
        </li>

        <li>
          <Link to="/Promociones" onClick={toggleMenu}>
            Promociones
          </Link>
        </li>
        <li>
          <Link to="/New" onClick={toggleMenu}>
            Nuevos ingresos
          </Link>
        </li>
        <li>
          <Link to="/About" onClick={toggleMenu}>
            Sobre nosotros
          </Link>
        </li>
        <li>
          <Link to="/Login" onClick={toggleMenu}>
            Mi cuenta
          </Link>
        </li>
        <li>
          <Link to="/Panel" onClick={toggleMenu}>
            Panel Administrador
          </Link>
        </li>
      </ul>
    </div>
  );
};
