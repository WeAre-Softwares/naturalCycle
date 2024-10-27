import React from 'react';
import { Link } from 'react-router-dom';

export const RegisterLink = ({ toggleMenu }) => {
  return (
    <p className="p-register">
      ¿Ya tienes un usuario?{' '}
      <span className="span-iniciar-sesion">
        <Link to="/login" onClick={toggleMenu}>
          Iniciar sesión
        </Link>{' '}
      </span>
    </p>
  );
};
