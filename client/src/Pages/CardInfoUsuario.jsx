import React from 'react';
import '../Styles/CardUsuario/CardInfoUsuario.css';

export const CardInfoUsuario = () => {
  return (
    <div className="container-card-info-usuario">
      <div className="h2-card-info-usuario">
        <h2>Datos de usuario</h2>
      </div>

      <div className="container-datos-usuario-card">
        <i className="fa-solid fa-user"></i>
        <p name="p-datos-id">ID Usuario: 12</p>
        <p name="p-datos-nombre">Nombre: Julian</p>
        <p name="p-datos-apellido">Apellido: Sanchez</p>  {/*TODO ESTÁTICO*/}
        <p name="p-datos-dni">DNI: 45.888.222</p>
        <p name="p-datos-nombre-comercio">
          Nombre del comercio: Dietetica Sanchez
        </p>
        <p name="p-datos-telefono">Teléfono: 213123121231</p>
        <p name="p-datos-email">Email: julian@gmail.com</p>
      </div>

      <button class="Btn-cerrar-sesion">
  <div class="sign-cerrar-sesion">
    <svg viewBox="0 0 512 512">
      <path
        d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
      ></path>
    </svg>
  </div>

  <div class="text-cerrar-sesion">Cerrar sesión</div> {/*ACA AGREGAR EL LINK QUE CIERRA SESIÓN*/}
</button>
    </div>
  );
};
