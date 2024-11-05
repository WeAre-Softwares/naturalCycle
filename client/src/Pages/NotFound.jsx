import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/NotFound/NotFound.css';

export const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-message">Página no encontrada</h2>
        <p className="error-description">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link className="back-home-link" to="/inicio">
          Regresar al inicio
        </Link>
      </div>
    </div>
  );
};
