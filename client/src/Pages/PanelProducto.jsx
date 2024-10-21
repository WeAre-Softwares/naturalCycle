import React, { useState } from 'react';
import { MenuLateralPanel} from '../Components/MenuLateralPanel';
import { Link } from 'react-router-dom';

export const PanelProducto = () => {
  return (
    <div className="div-gral-prod-creados">
      <div className="div-general-categoria-panel">
        <MenuLateralPanel />
        <div className="productos-creados-container">
          <h2>Lista de productos</h2>
          <input
            type="text"
            placeholder="Buscar por nombre"
            className="buscar-producto-input"
          />
          <Link to="/crearproducto"><button className='button-abrir-crear-producto'
    ><i className='fas fa-plus'></i>
    </button></Link>
          <ul className="productos-lista-panel">
            <li className="producto-item-panel">
              <img src="producto" alt="producto" className="producto-imagen" />

              <div className="producto-detalles">
                <h3>Nombre producto</h3>
                <p>Precio: $1222</p>
                <p>Marca: marca01</p>
                <p>Categoría: categoria</p>
              </div>
              <div className="producto-botones">
                <button className="crear-filtrado-button">Editar</button>
                <button className="crear-filtrado-button">Eliminar</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
