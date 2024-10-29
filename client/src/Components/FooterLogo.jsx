import React from 'react';
import FooterLogoImagen from '/imagenes/logo-footer.png';

export const FooterLogo = () => {
  return (
    <div className="img-frase-footer">
            <img className="imagen-logo" src={FooterLogoImagen} alt="Logo" />
            <h2>Distribuidora mayorista de alimentos naturales</h2>
    </div>
  );
};
