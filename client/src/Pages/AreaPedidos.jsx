import React, { useState } from 'react';
import '../Styles/Panel/styles.css';
import { MenuLateralPanel } from '../Components/MenuLateralPanel';
import { useGetAllPedidosWithPagination } from '../hooks/hooks-pedido/useGetAllPedidosWithPagination';
import { Pagination } from '../Components/panel-productos/Pagination';
import { PedidoItem } from '../Components/pedidos-ui/PedidoItem';
import { useActualizarEstadoPedido } from '../hooks/hooks-pedido/useActualizarEstadoPedido';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const colorEstado = {
  esperando_aprobacion: '#D6A900',
  aprobado: 'rgb(111, 148, 89)',
  enviado: '#2A6A29',
  recibido: '#00ff51',
};

export const AreaPedidos = () => {
  const limit = 4;
  const [estadoFiltro, setEstadoFiltro] = useState('');

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
    // Configuración de SweetAlert para la confirmación
    const customAlert = Swal.mixin({
      customClass: {
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
        popup: 'custom-alert-container',
      },
      buttonsStyling: false,
    });

    // Mostrar el alert de confirmación
    customAlert
      .fire({
        title: '¿Estás seguro?',
        text: '¿Quieres cambiar el estado de este pedido?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar estado',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const updatedPedido = await cambiarEstadoPedido(id, nuevoEstado);
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
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          customAlert.fire({
            title: 'Cancelado',
            text: 'El estado del pedido no ha cambiado.',
            icon: 'error',
          });
        }
      });
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="div-general-categoria-panel">
      <ToastContainer />
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
                  {estado}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="lista-pedidos">
          {pedidos.length === 0 && !loading ? (
            <p>No se encontraron pedidos con el estado seleccionado.</p>
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
