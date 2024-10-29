import React from 'react';
import NewLogoImagen from '/imagenes/logo-new.png';

export const NewLogo = () => {
  return (
    <div className="img-logo-new">
            <img className="imagen-new" src={NewLogoImagen} alt="Logo" />
    </div>
  );
};
