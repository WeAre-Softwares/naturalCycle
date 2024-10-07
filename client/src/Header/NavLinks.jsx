import React from 'react';
import { Link } from 'react-router-dom';

const NavLinks = ({ isOpen, toggleMenu }) => {
  return (
    <div className={`links-header ${isOpen ? 'open' : ''}`}>
      <button className="close-menu" onClick={toggleMenu}>
        <i className="fa-solid fa-backward-step"> M e n u</i>
      </button>
      <ul className='ul-menu-hamb'>
        <li><Link to="/Inicio" onClick={toggleMenu}>Inicio</Link></li>
        <li>
  <Link to="/Categorias" className="link-categorias" onClick={toggleMenu}>Categorías <i className="fa-solid fa-chevron-down"></i></Link>
  <div className="container-categorias">
    <div className="lista-categorias">
      <li><Link to="/Categoria1" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria2" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria3" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria4" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria5" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria6" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria7" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria8" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria9" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria10" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria11" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria12" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria13" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria14" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria15" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria16" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria17" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria18" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria19" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria20" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria21" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria22" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria23" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria24" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria25" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria26" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria27" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria28" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria29" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria30" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria31" onClick={toggleMenu}>Categoría</Link></li>
      <li><Link to="/Categoria32" onClick={toggleMenu}>Categoría</Link></li>

    </div>
  </div>
</li>
<li>
  <Link to="/Marcas" className='link-marcas' onClick={toggleMenu}>
    Marcas  <i className="fa-solid fa-chevron-down"></i>

  </Link>

  <div className="container-categorias">
    <div className="lista-categorias">
      <li><Link to="/Marca1" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca2" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca3" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca4" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca5" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca6" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca7" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca8" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca9" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca10" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca11" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca12" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca13" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca14" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca15" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca16" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca17" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca18" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca19" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca20" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca21" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca22" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca23" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca24" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca25" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca26" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca27" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca28" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca29" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca30" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca31" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>
      <li><Link to="/Marca32" onClick={toggleMenu}>Marca</Link></li>

    </div>
  </div>
</li>

        <li><Link to="/Promociones" onClick={toggleMenu}>Promociones</Link></li>
        <li><Link to="/New" onClick={toggleMenu}>Nuevos ingresos</Link></li>
        <li><Link to="/About" onClick={toggleMenu}>Sobre nosotros</Link></li>
        <li><Link to="/Login" onClick={toggleMenu}>Mi cuenta</Link></li>
      </ul>
    </div>
    
  );
};

export default NavLinks;
