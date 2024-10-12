import React from 'react';

export const HamburgerMenu = ({ isOpen, toggleMenu }) => {
  return (
    <div className="hamburger" onClick={toggleMenu}>
      <i className="fa-solid fa-bars hamburger-icon"></i>
    </div>
  );
};
