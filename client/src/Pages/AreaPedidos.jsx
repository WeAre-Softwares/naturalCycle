import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Panel/styles.css';

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
  // Más pedidos...
];

const estadosDisponibles = [
  'Esperando aprobación',
  'Aprobado',
  'Enviado',
  'Recibido',
];

export const AreaPedidos = () => {
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [pedidoEditando, setPedidoEditando] = useState(null); // Controla qué pedido está en edición

  // Recuperar los estados guardados en localStorage al cargar la página
  useEffect(() => {
    const pedidosGuardados = pedidos.map((pedido) => {
      const estadoGuardado = localStorage.getItem(`pedido-estado-${pedido.id}`);
      return {
        ...pedido,
        estado: estadoGuardado || 'Esperando aprobación',
      };
    });
    setPedidos(pedidosGuardados);
  }, []);

  // Guardar el estado del pedido en localStorage
  const cambiarEstado = (id, nuevoEstado) => {
    const nuevosPedidos = pedidos.map((pedido) =>
      pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido,
    );
    setPedidos(nuevosPedidos);
    localStorage.setItem(`pedido-estado-${id}`, nuevoEstado); // Guardar el estado en localStorage
  };

  // Editar la cantidad de productos dentro del pedido
  const editarCantidadProducto = (pedidoId, productoIndex, nuevaCantidad) => {
    const nuevosPedidos = pedidos.map((pedido) => {
      if (pedido.id === pedidoId) {
        const nuevosProductos = pedido.productos.map((producto, index) => {
          if (index === productoIndex) {
            return { ...producto, cantidad: nuevaCantidad };
          }
          return producto;
        });
        return { ...pedido, productos: nuevosProductos };
      }
      return pedido;
    });
    setPedidos(nuevosPedidos);
  };

  const filtrarPedidos = () => {
    if (estadoFiltro === 'todos') return pedidos;
    return pedidos.filter((pedido) => pedido.estado === estadoFiltro);
  };

  const imprimirRemito = (id) => {
    console.log(`Imprimiendo remito para el pedido ${id}`);
  };

  const colorEstado = {
    'Esperando aprobación': '#FFC107',
    Aprobado: '#28A745',
    Enviado: '#007BFF',
    Recibido: '#6C757D',
  };

  const habilitarEdicion = (id) => {
    setPedidoEditando(id); // Habilita edición para el pedido seleccionado
  };

  const guardarEdicion = () => {
    setPedidoEditando(null); // Guarda y cierra el modo de edición
  };

  return (
    <div className="div-general-categoria-panel">
      <div className="panel-admin">
        <nav className="menu-lateral">
          <h2>Menú</h2>
          <ul>
            <li>
              <Link to="/panelpedidos">Área de Pedidos</Link>
            </li>
            <li>
              <Link to="/panelusuarios">Área de Usuarios</Link>
            </li>
            <li>
              <Link to="/panelfiltrado">Crear Filtrado</Link>
            </li>
            <li>
              <Link to="/panelproducto">Crear Producto</Link>
            </li>
            <li>
              <Link to="/panelpermisos">Permisos</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="area-pedidos">
        <h1 className="titulo-area">Área de Pedidos</h1>
        <div className="filtros">
          <button
            className="filtro-boton"
            onClick={() => setEstadoFiltro('todos')}
          >
            Todos
          </button>
          <button
            className="filtro-boton"
            onClick={() => setEstadoFiltro('Esperando aprobación')}
          >
            Esperando Aprobación
          </button>
          <button
            className="filtro-boton"
            onClick={() => setEstadoFiltro('Aprobado')}
          >
            Aprobados
          </button>
          <button
            className="filtro-boton"
            onClick={() => setEstadoFiltro('Enviado')}
          >
            Enviados
          </button>
          <button
            className="filtro-boton"
            onClick={() => setEstadoFiltro('Recibido')}
          >
            Recibidos
          </button>
        </div>
        <div className="lista-pedidos">
          {filtrarPedidos().map((pedido) => (
            <div
              key={pedido.id}
              className="pedido-item"
              style={{
                backgroundColor: colorEstado[pedido.estado],
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
              }}
            >
              {/* Detalles del pedido */}
              <div className="pedido-detalles">
                <p>
                  <strong>Fecha:</strong> {pedido.fecha}
                </p>
                <p>
                  <strong>ID:</strong> {pedido.id}
                </p>
                <p>
                  <strong>Cliente:</strong> {pedido.cliente}
                </p>

                {/* Mostrar productos solo si está en modo edición */}
                {pedidoEditando === pedido.id && (
                  <div className="productos-pedido">
                    <strong>Productos:</strong>
                    {pedido.productos.map((producto, index) => (
                      <div key={index} className="producto-item">
                        <p>
                          {producto.nombre} - Cantidad: {producto.cantidad} -
                          Precio: ${producto.precio}
                        </p>
                        <div className="editar-cantidad">
                          <button
                            className="cantidad-boton"
                            onClick={() =>
                              editarCantidadProducto(
                                pedido.id,
                                index,
                                producto.cantidad + 1,
                              )
                            }
                          >
                            +
                          </button>
                          <button
                            className="cantidad-boton"
                            onClick={() =>
                              editarCantidadProducto(
                                pedido.id,
                                index,
                                Math.max(producto.cantidad - 1, 0),
                              )
                            }
                          >
                            -
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="pedido-acciones">
                {pedidoEditando === pedido.id ? (
                  <button className="accion-boton" onClick={guardarEdicion}>
                    Guardar
                  </button>
                ) : (
                  <button
                    className="accion-boton"
                    onClick={() => habilitarEdicion(pedido.id)}
                  >
                    Editar Cantidad
                  </button>
                )}
                <button
                  className="accion-boton"
                  onClick={() => imprimirRemito(pedido.id)}
                  disabled={pedido.estado === 'Esperando aprobación'}
                >
                  Imprimir Remito
                </button>
                <select
                  className="estado-select"
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
