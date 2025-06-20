import React, { useState } from 'react';
import '../Styles/Panel/styles.css';
import { MenuLateralPanel } from '../Components/MenuLateralPanel';
import { useGetAllPedidosWithPagination } from '../hooks/hooks-pedido/useGetAllPedidosWithPagination';
import { Pagination } from '../Components/panel-productos/Pagination';
import { PedidoItem } from '../Components/pedidos-ui/PedidoItem';
import { useActualizarEstadoPedido } from '../hooks/hooks-pedido/useActualizarEstadoPedido';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { NoHayResultados } from '../Components/NoHayResultados';
import usePedido from '../context/panelAdmin/usePedidoContext';

const colorEstado = {
  esperando_aprobacion: '#D6A900',
  aprobado: 'rgb(111, 148, 89)',
  enviado: '#2A6A29',
  recibido: '#00ff51',
  cancelado: '#C70039',
};

export const AreaPedidos = () => {
  const limit = 10;
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const { setHayCambios } = usePedido();

  // Pasamos `estadoFiltro` al hook para que filtre directamente en la petición
  const {
    pedidos,
    loading,
    error,
    currentPage,
    nextPage,
    prevPage,
    totalPages,
  } = useGetAllPedidosWithPagination(limit, estadoFiltro);

  const {
    cambiarEstadoPedido,
    loading: loadingCambioEstado,
    error: errorCambioEstado,
  } = useActualizarEstadoPedido();

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await cambiarEstadoPedido(id, nuevoEstado);
      setHayCambios((prev) => !prev);
      toast.success('Estado del pedido actualizado correctamente.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
    } catch (error) {
      console.error('Error al cambiar el estado del pedido:', error);
      toast.error('Error al actualizar el estado del pedido.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
    }
  };

  return (
    <div className="div-general-categoria-panel">
      <MenuLateralPanel />

      <div className="area-pedidos">
        <div>
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
              {[
                'esperando_aprobacion',
                'aprobado',
                'enviado',
                'recibido',
                'cancelado',
              ].map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>
        {
          loading ? (
            <section className="dots-container-inicio">
              <div className="dot-inicio"></div>
              <div className="dot-inicio"></div>
              <div className="dot-inicio"></div>
              <div className="dot-inicio"></div>
              <div className="dot-inicio"></div>
            </section>
          ) : (
            <div>
              <div className="lista-pedidos">
                {(pedidos.length === 0 && !loading) || error ? (
                  <NoHayResultados entidad={'pedidos'} />
                ) : (
                  pedidos.map((pedido) => (
                    <div key={pedido.pedido_id}>
                      <PedidoItem
                        pedido={pedido}
                        colorEstado={colorEstado[pedido.estado_pedido]} // Asigna el color basado en el estado
                        cambiarEstado={cambiarEstado}
                      />
                    </div>
                  ))
                )}
              </div>
              {/* Mostrar paginación sólo si hay al menos una página de resultados */}
              {totalPages > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onNext={nextPage}
                  onPrev={prevPage}
                />
              )}
            </div>
          )
        }
      </div>
    </div>
  );
};
