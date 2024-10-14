import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Panel/styles.css';
import { PanelAdmin } from './PanelAdmin';

const pedidosIniciales = [
  {
    id: 1,
    estado: 'Esperando aprobación',
    fecha: '2024-10-01',
    cliente: 'Juan Pérez',
    productos: [
      { nombre: 'Producto A', cantidad: 1, precio: 150 },
      { nombre: 'Producto B', cantidad: 2, precio: 300 },
    ],
  },
  {
    id: 2,
    estado: 'Esperando aprobación',
    fecha: '2024-10-02',
    cliente: 'Ana López',
    productos: [{ nombre: 'Producto C', cantidad: 1, precio: 200 }],
  },
  {
    id: 3,
    estado: 'Esperando aprobación',
    fecha: '2024-10-03',
    cliente: 'Carlos García',
    productos: [
      { nombre: 'Producto D', cantidad: 1, precio: 250 },
      { nombre: 'Producto E', cantidad: 3, precio: 450 },
    ],
  },
];

const estadosDisponibles = [
  'Esperando aprobación',
  'Aprobado',
  'Enviado',
  'Recibido',
];

export const AreaPedidos = () => {
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [pedidoEditando, setPedidoEditando] = useState(null);

  useEffect(() => {
    const pedidosGuardados = pedidos.map((pedido) => {
      const estadoGuardado = localStorage.getItem(`pedido-estado-${pedido.id}`);
      const cantidadesGuardadas = JSON.parse(localStorage.getItem(`pedido-cantidades-${pedido.id}`)) || {};

      const productosConCantidadGuardada = pedido.productos.map((producto) => ({
        ...producto,
        cantidad: cantidadesGuardadas[producto.nombre] || producto.cantidad,
      }));

      return {
        ...pedido,
        estado: estadoGuardado || 'Esperando aprobación',
        productos: productosConCantidadGuardada,
      };
    });
    setPedidos(pedidosGuardados);
  }, []);

  const cambiarEstado = (id, nuevoEstado) => {
    const nuevosPedidos = pedidos.map((pedido) =>
      pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido,
    );
    setPedidos(nuevosPedidos);
    localStorage.setItem(`pedido-estado-${id}`, nuevoEstado);
  };

  const editarCantidadProducto = (pedidoId, productoIndex, nuevaCantidad) => {
    const nuevosPedidos = pedidos.map((pedido) => {
      if (pedido.id === pedidoId) {
        const nuevosProductos = pedido.productos.map((producto, index) => {
          if (index === productoIndex) {
            return { ...producto, cantidad: nuevaCantidad };
          }
          return producto;
        });
        const cantidadesGuardadas = JSON.parse(localStorage.getItem(`pedido-cantidades-${pedidoId}`)) || {};
        cantidadesGuardadas[pedido.productos[productoIndex].nombre] = nuevaCantidad;
        localStorage.setItem(`pedido-cantidades-${pedidoId}`, JSON.stringify(cantidadesGuardadas));

        return { ...pedido, productos: nuevosProductos };
      }
      return pedido;
    });
    setPedidos(nuevosPedidos);
  };

  const filtrarPedidos = () => {
    if (!estadoFiltro) return pedidos;
    return pedidos.filter((pedido) => pedido.estado === estadoFiltro);
  };

  const imprimirRemito = (id) => {
    console.log(`Imprimiendo remito para el pedido ${id}`);
  };

  const colorEstado = {
    'Esperando aprobación': '#D6A900',
    Aprobado: 'rgb(111, 148, 89)',
    Enviado: '#2A6A29',
    Recibido: '#00ff51',
  };

  const habilitarEdicion = (id) => {
    setPedidoEditando(id);
  };

  const guardarEdicion = () => {
    setPedidoEditando(null);
  };

  const calcularTotal = (productos) => {
    return productos.reduce((total, producto) => total + (producto.cantidad * producto.precio), 0);
  };

  return (
    <div className="div-general-categoria-panel">
      <PanelAdmin />
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
            {estadosDisponibles.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        <div className="lista-pedidos">
          {filtrarPedidos().map((pedido) => (
            <div
              key={pedido.id}
              className="pedido-item-panel"
              style={{
                backgroundColor: colorEstado[pedido.estado],
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <div className="pedido-detalles">
                {/* Mostrar información solo si no se está editando */}
                {pedidoEditando !== pedido.id && (
                  <>
                    <p><strong>Total del Pedido:</strong> ${calcularTotal(pedido.productos)}</p>
                    <p><strong>Fecha:</strong> {pedido.fecha}</p>
                    <p><strong>Cliente:</strong> {pedido.cliente}</p>
                  </>
                )}
                {pedidoEditando === pedido.id && (
                  <div className="productos-pedido">
                    <strong>Productos:</strong>
                    {pedido.productos.map((producto, index) => (
                      <div key={index} className="producto-item-panel-2">
                        <p>
                          {producto.nombre}  X{producto.cantidad} unidades  || Precio: ${producto.precio}
                        </p>
                        <div className="editar-cantidad">
                          <button
                            className="cantidad-boton"
                            onClick={() => editarCantidadProducto(pedido.id, index, producto.cantidad + 1)}
                          >
                            +
                          </button>
                          <button
                            className="cantidad-boton"
                            onClick={() => editarCantidadProducto(pedido.id, index, Math.max(producto.cantidad - 1, 0))}
                          >
                            -
                          </button>
                        </div>
                      </div>
                    ))}
                    <p><strong>Total:</strong> ${calcularTotal(pedido.productos)}</p>
                  </div>
                )}
              </div>

              <div className="pedido-acciones">
                {pedidoEditando === pedido.id ? (
                  <button className="accion-boton" onClick={guardarEdicion}>
                    Guardar
                  </button>
                ) : (
                  <button className="icono-accion btn-editar-prod-panel" onClick={() => habilitarEdicion(pedido.id)}>
                    <i className="fas fa-edit" title="Editar Cantidad"></i>
                  </button>
                )}
                <button className="icono-accion" onClick={() => imprimirRemito(pedido.id)}>
                  <i className="fas fa-print" title="Imprimir Remito"></i>
                </button>
                <select
                  className="filtro-select-panel"
                  value={pedido.estado}
                  onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                >
                  {estadosDisponibles.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
