import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link desde react-router-dom

const RememberMe = ({ toggleMenu }) => { // Asegúrate de recibir toggleMenu como prop si es necesario
  return (
    <div className="flex-row-login">
      <div>
        <input type="checkbox" />
        <label> Recordar</label>
      </div>
      <span className="span-login">
        <Link to="/Password" onClick={toggleMenu}>Olvidaste tu contraseña?</Link>
      </span>
    </div>
  );
};

export default RememberMe;
