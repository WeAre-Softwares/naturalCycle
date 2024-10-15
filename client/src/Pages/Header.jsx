import React from 'react';
import '../Styles/Header/Header.css';
import { HamburgerMenu } from '../Components/HamburgerMenu';
import { NavLinks } from '../Components/NavLinks';
import { CartButton } from '../Components/CartButton';
// import Categorias from './Categorias';
import Logo from '/Imagenes/logo-header.svg';


export const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [carrito, setCarrito] = React.useState([]); // Estado para el carrito

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Función para calcular el total de productos en el carrito
  const cantidadTotalProductos = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0,
  );

  return (
    <div className="container-header">
      <header className="header">
        <nav className="nav">
          <div className="logo-header">
            <HamburgerMenu isOpen={isOpen} toggleMenu={toggleMenu} />
            <img className="imagen-logo" src={Logo} alt="Logo" />
            {/* Llamada a CartButton con las props necesarias */}
            <CartButton
              carrito={carrito}
              toggleCart={toggleCart}
              cantidadTotal={cantidadTotalProductos}
            />
          </div>
          <NavLinks isOpen={isOpen} toggleMenu={toggleMenu} />
          <div className="group">
            <i className="fas fa-search icon"></i>
            <input type="text" className="input-busca-productos" placeholder="Buscar" />
          </div>
        </nav>
      </header>
    </div>
  );
};
