import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link desde react-router-dom

const RegisterLink = ({ toggleMenu }) => { // Asegúrate de recibir toggleMenu como prop

  return (
    <p className="p-register">
      ¿Ya tienes un usuario?{' '}
      <span className="span-iniciar-sesion">
        <Link to="/Login" onClick={toggleMenu}>Iniciar sesión</Link> {/* Usar Link correctamente */}
      </span>
    </p>
  );
};

export default RegisterLink;
