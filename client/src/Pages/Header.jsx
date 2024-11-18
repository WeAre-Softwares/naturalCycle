import React, { useState } from 'react';
import '../Styles/Header/Header.css';
import { HamburgerMenu } from '../Components/HamburgerMenu';
import { NavLinks } from '../Components/NavLinks';
import { CartButton } from '../Components/CartButton';
import Logo from '/imagenes/logo-header.svg';
import { Link } from 'react-router-dom';

export const Header = ({ carrito, toggleCart, cantidadTotalProductos }) => {
  // Estado para controlar MenuHamburguesa
  const [isOpen, setIsOpen] = useState(false);

  // Fn para alternar la visibilidad del menu hamburguesa
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container-header">
      <header className="header">
        <nav className="nav">
          <div className="logo-header">
            <HamburgerMenu isOpen={isOpen} toggleMenu={toggleMenu} />
            <Link to={'/inicio'}>
              <img className="imagen-logo" src={Logo} alt="Logo" />
            </Link>
            {/* Llamada a CartButton con las props necesarias */}
            <CartButton
              carrito={carrito}
              toggleCart={toggleCart}
              cantidadTotal={cantidadTotalProductos}
            />
          </div>

          <NavLinks isOpen={isOpen} toggleMenu={toggleMenu} />
        </nav>
      </header>
    </div>
  );
};
