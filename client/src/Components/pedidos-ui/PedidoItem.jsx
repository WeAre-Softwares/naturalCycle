import React from 'react';
import { PedidoAcciones } from './PedidoAcciones';

export const PedidoItem = ({ pedido, colorEstado, cambiarEstado }) => {
  const estadosDisponibles = [
    'esperando_aprobacion',
    'aprobado',
    'enviado',
    'recibido',
    'cancelado',
  ];

  return (
    <div
      className="pedido-item-panel"
      style={{
        backgroundColor: colorEstado,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        alignItems: 'center',
        marginBottom: '10px',
      }}
    >
      <div className="pedido-detalles">
        <p>
          <strong>Total del Pedido:</strong> ${Number(pedido.total_precio)}
        </p>
        <p>
          <strong>Fecha del Pedido:</strong>{' '}
          {new Date(pedido.fecha_pedido).toLocaleDateString()}
        </p>
        <p>
          <strong>Cliente:</strong> {pedido.usuario.nombre}{' '}
          {pedido.usuario.apellido}
        </p>
        <p>
          <strong>Estado:</strong>{' '}
          {pedido.estado_pedido.replace('_', ' ').toUpperCase()}
        </p>
      </div>
      {/* Pedido Acciones */}
      <PedidoAcciones
        pedido={pedido}
        cambiarEstado={cambiarEstado}
        estadosDisponibles={estadosDisponibles}
      />
    </div>
  );
};
