import React, { useState } from 'react';
import { PanelAdmin } from './PanelAdmin';

export const PanelProducto = () => {
  return (
    <div className="div-gral-prod-creados">
      <div className="div-general-categoria-panel">
        <PanelAdmin />
        <div className="productos-creados-container">
          <h2>Lista de productos</h2>
          <input
            type="text"
            placeholder="Buscar por nombre"
            className="buscar-producto-input"
          />
          <ul className="productos-lista-panel">
            <li className="producto-item-panel">
              <img src="producto" alt="producto" className="producto-imagen" />

              <div className="producto-detalles">
                <h3>Nombre producto</h3>
                <p>Descripción: Descripción</p>
                <p>Precio: $1222</p>
                <p>Marca: marca01</p>
                <p>Categoría: categoria</p>
                <p>'En Stock'</p>
                <p>'Sin Promoción'</p>
                <p>'No Destacado'</p>
                <p>'Nuevo Ingreso'</p>
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
