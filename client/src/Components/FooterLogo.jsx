import React from 'react';
import { Link } from 'react-router-dom';
import FooterLogoImagen from '/imagenes/logo-footer.png';

export const FooterLogo = () => {
  return (
    <div className="img-frase-footer">
      <Link to={'/about'}>
        <img className="imagen-logo" src={FooterLogoImagen} alt="Logo" />
      </Link>

      <h2>Distribuidora mayorista de alimentos naturales</h2>
    </div>
  );
};
