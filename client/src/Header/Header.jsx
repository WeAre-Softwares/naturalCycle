import React from 'react';
import './Header.css';
import HamburgerMenu from './HamburgerMenu';
import NavLinks from './NavLinks';
import CartButton from './CartButton';

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container-header">
      <header className="header">
        <nav className="nav">
          <div className="logo-header">
            <HamburgerMenu isOpen={isOpen} toggleMenu={toggleMenu} />
            <img className="imagen-logo" src="Imagenes/logo-header.svg" alt="Logo" />
            <CartButton />
          </div>
          <NavLinks isOpen={isOpen} toggleMenu={toggleMenu} />
          <div className="group">
            <i className="fas fa-search icon"></i>
            <input type="text" className="input" placeholder="Buscar" />
          </div>
        </nav>
          
      </header>
    </div>
  );
};

export default Header;
