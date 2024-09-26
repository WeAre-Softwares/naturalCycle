import React from 'react'
import './CardInfoUsuario.css';

const CardInfoUsuario = () => {
  return (
    <div className='container-card-info-usuario'>
            <div className="h2-card-info-usuario">
                <h2>Datos de usuario</h2>
            </div>

            <div className="container-datos-usuario-card">
            <i class="fa-solid fa-user"></i>
                <p name="p-datos-id">ID Usuario: 12</p>
                <p name="p-datos-nombre">Nombre: Julian</p>
                <p name="p-datos-apellido">Apellido: Sanchez</p>
                <p name="p-datos-dni">DNI: 45.888.222</p>
                <p name="p-datos-nombre-comercio">Nombre del comercio: Dietetica Sanchez</p>
                <p name="p-datos-telefono">Teléfono: 213123121231</p>
                <p name="p-datos-email">Email: julian@gmail.com</p>
            </div>
        </div>
  )
}

export default CardInfoUsuario
