import React from 'react';

export const PanelProductItem = ({
  producto,
  onEdit,
  onToggleActive,
  isProcessing,
}) => {
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
          disabled={!producto.esta_activo || isProcessing}
        >
          Editar
        </button>

        {producto.esta_activo ? (
          <button
            className="crear-filtrado-button"
            onClick={() => onToggleActive(producto.producto_id, true)}
            disabled={isProcessing}
          >
            Desactivar
          </button>
        ) : (
          <button
            className="crear-filtrado-button"
            onClick={() => onToggleActive(producto.producto_id, false)}
            disabled={isProcessing}
          >
            Activar
          </button>
        )}
      </div>
    </li>
  );
};
