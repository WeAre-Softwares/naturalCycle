// Componente para mostrar una página de error 404

import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/NotFound/NotFound.css';

export const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <Link className="link" to="/Inicio">
        Regresar al inicio
      </Link>
    </div>
  );
};
