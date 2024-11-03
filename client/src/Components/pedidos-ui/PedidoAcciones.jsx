import React from 'react';
import { Link } from 'react-router-dom';
import { useDownloadRemito } from '../../hooks/hooks-remito/useDownloadRemito';

export const PedidoAcciones = ({
  pedido,
  cambiarEstado,
  estadosDisponibles,
}) => {
  const downloadRemito = useDownloadRemito();

  return (
    <div className="pedido-acciones">
      <Link to={`/editar-pedido/${pedido.pedido_id}`} className="icono-accion">
        <i className="fas fa-edit" title="Editar Pedido"></i>
      </Link>
      <button
        className="icono-accion"
        onClick={() => downloadRemito(pedido.pedido_id)}
        disabled={pedido.estado_pedido === 'esperando_aprobacion'}
      >
        <i className="fas fa-print" title="Imprimir Remito"></i>
      </button>

      <select
        className="filtro-select-panel"
        value={pedido.estado_pedido}
        onChange={(e) => cambiarEstado(pedido.pedido_id, e.target.value)}
      >
        {estadosDisponibles.map((estado) => (
          <option key={estado} value={estado}>
            {estado.replace('_', ' ').toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};
