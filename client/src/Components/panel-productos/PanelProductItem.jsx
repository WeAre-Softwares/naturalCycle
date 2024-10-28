import React from 'react';

export const PanelProductItem = ({ producto, onEdit, onDelete }) => {
  return (
    <li className="producto-item-panel">
      <img
        src={producto.imagenes[0]?.url || ''}
        alt={producto.nombre}
        className="producto-imagen"
      />
      <div className="producto-detalles">
        <h3>{producto.nombre}</h3>
        <p>Precio: ${producto.precio}</p>
        <p>Marca: {producto.marca.nombre}</p>
        <p>Categoría: {producto.categorias.map((c) => c.nombre).join(', ')}</p>
      </div>
      <div className="producto-botones">
        <button
          className="crear-filtrado-button"
          onClick={() => onEdit(producto.producto_id)}
        >
          Editar
        </button>
        <button
          className="crear-filtrado-button"
          onClick={() => onDelete(producto.producto_id)}
        >
          Eliminar
        </button>
      </div>
    </li>
  );
};
