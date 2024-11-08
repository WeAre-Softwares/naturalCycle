import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetDetallePedidoById } from '../hooks/hooks-detalles-pedidos/useGetDetallePedidoById';

export const CardPedido = () => {
  const { pedido_id } = useParams();
  const { detallePedido, loading, error } = useGetDetallePedidoById(pedido_id);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los detalles del pedido.</p>;

  return (
    <div className="pag-pedido-card">
      <div className="div-pedido-card">
        <button className="button-volver-panel-producto">
          <Link to="/panel-pedidos">
            <i className="fas fa-arrow-left"></i>
            &nbsp;&nbsp;Volver
          </Link>
        </button>
        <h2 className="h2-pedido-card">Detalles del Pedido</h2>

        {detallePedido && detallePedido.length > 0 ? (
          <>
            {/* Muestra información general del pedido */}
            <div className="div-section-pedido-card">
              <p className="p-pedido-card">
                <strong>Estado:</strong>{' '}
                {detallePedido[0].pedido?.estado_pedido || 'N/A'}
              </p>
              <p className="p-pedido-card">
                <strong>Fecha del Pedido:</strong>{' '}
                {new Date(
                  detallePedido[0].pedido?.fecha_pedido,
                ).toLocaleDateString() || 'N/A'}
              </p>
              <p className="p-pedido-card">
                <strong>Total Precio del Pedido:</strong> $
                {Number(
                  detallePedido[0].pedido?.total_precio,
                ).toLocaleString() || '0'}
              </p>
            </div>

            {/* Muestra cada detalle del pedido (producto) */}
            {detallePedido.map((detalle) => (
              <div
                key={detalle.detalles_pedidos_id}
                className="div-global-pedido-card"
              >
                <div className="div-section-pedido-card">
                  <h3 className="h3-pedido-card">Producto</h3>
                  <p className="p-pedido-card">
                    <strong>Nombre:</strong> {detalle.producto?.nombre || 'N/A'}
                  </p>
                  <p className="p-pedido-card">
                    <strong>Descripción:</strong>{' '}
                    {detalle.producto?.descripcion || 'N/A'}
                  </p>
                  <p className="p-pedido-card">
                    <strong>Cantidad:</strong> {detalle.cantidad || 'N/A'}
                  </p>
                  <p className="p-pedido-card">
                    <strong>Precio Unitario:</strong> $
                    {Number(detalle.precio_unitario).toLocaleString() || 'N/A'}
                  </p>
                  <p className="p-pedido-card">
                    <strong>Total Precio:</strong> $
                    {Number(detalle.total_precio).toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No se encontraron detalles para este pedido.</p>
        )}
      </div>
    </div>
  );
};
