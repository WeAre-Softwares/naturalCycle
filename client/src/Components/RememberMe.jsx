import React from 'react';
import { Link } from 'react-router-dom';

export const RememberMe = ({ toggleMenu }) => {
  return (
    <div className="flex-row-login">
      <div>
        <input type="checkbox" />
        <label> Recordar</label>
      </div>
      <span className="span-login">
        <Link to="/olvide-password" onClick={toggleMenu}>
          Olvidaste tu contraseña?
        </Link>
      </span>
    </div>
  );
};
