import React, { useState } from 'react';
import '../Styles/Panel/styles.css';
import { MenuLateralPanel } from '../Components/MenuLateralPanel';
import { useGetAllPedidosWithPagination } from '../hooks/hooks-pedido/useGetAllPedidosWithPagination';
import { Pagination } from '../Components/panel-productos/Pagination';
import { PedidoItem } from '../Components/pedidos-ui/PedidoItem';

const colorEstado = {
  esperando_aprobacion: '#D6A900',
  aprobado: 'rgb(111, 148, 89)',
  enviado: '#2A6A29',
  recibido: '#00ff51',
};

export const AreaPedidos = () => {
  const limit = 3;
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const {
    pedidos,
    loading,
    error,
    currentPage,
    nextPage,
    prevPage,
    totalPages,
  } = useGetAllPedidosWithPagination(limit);

  const filtrarPedidos = () => {
    if (!estadoFiltro) return pedidos;
    return pedidos.filter((pedido) => pedido.estado_pedido === estadoFiltro);
  };

  const cambiarEstado = (id, nuevoEstado) => {
    console.log(`Cambiando estado del pedido ${id} a ${nuevoEstado}`);
    // Aquí puedes implementar el servicio para cambiar el estado en el futuro
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="div-general-categoria-panel">
      <MenuLateralPanel />
      <div className="area-pedidos">
        <h1 className="titulo-area">Área de Pedidos</h1>

        {/* Filtrado con menú desplegable */}
        <div className="filtros">
          <label htmlFor="filtro-estado"></label>
          <select
            id="filtro-estado"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="filtro-select-panel"
          >
            <option value="">Todos los pedidos</option>
            {['esperando_aprobacion', 'aprobado', 'enviado', 'recibido'].map(
              (estado) => (
                <option key={estado} value={estado}>
                  {estado.replace('_', ' ').toUpperCase()}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="lista-pedidos">
          {filtrarPedidos().map((pedido) => (
            <div key={pedido.pedido_id}>
              <PedidoItem
                pedido={pedido}
                colorEstado={colorEstado[pedido.estado_pedido]} // Asigna el color basado en el estado
                cambiarEstado={cambiarEstado}
              />
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={nextPage}
          onPrev={prevPage}
        />
      </div>
    </div>
  );
};
