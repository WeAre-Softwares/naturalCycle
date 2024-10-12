import React from 'react';
import { Link } from 'react-router-dom';

export const UserInfo = () => {
  return (
    <div className="user-img-name">
      <i className="fa-solid fa-user"></i>
      <Link to="/CardInfoUsuario">
        <p name="nombre-usuario-login">Usuario</p>
      </Link>
    </div>
  );
};
