import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Panel/styles.css';
import '../Styles/Panel/PanelAdministracion.css';
import { updateNotificacion } from '../services/updateNotificacion';
import useNotificacionStore from '../store/useNotification';

export const MenuLateralPanel = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { pedidoNotificaciones: pedidos, usuarioNotificaciones: usuarios, removePedidoNotificaciones, removeUsuarioNotificaciones, setNotificaciones, notificaciones } = useNotificacionStore()

  const handlePedidosNotificaciones = () => {
    let count = 0

    if (pedidos && pedidos.length > 0) {
      for (const notification of pedidos) {
        if (notification.esta_activo) {
          count++
        }
      }
    }

    return count
  };

  const handleUsuariosNotificaciones = () => {
    let count = 0

    if (usuarios && usuarios.length > 0) {
      for (const notification of usuarios) {
        if (notification.esta_activo) {
          count++
        }
      }
    }

    return count
  };

  const handleUpdateNotificacion = async (type) => {
    if (type === 'pedido') {
      if (handlePedidosNotificaciones() < 1) return
      await updateNotificacion('pedido')
      const filterNotificaciones = notificaciones.filter((notificacion) => notificacion.tipo !== 'pedido')
      setNotificaciones(filterNotificaciones)
      removePedidoNotificaciones()
    }

    if (type === 'usuario') {
      if (handleUsuariosNotificaciones() < 1) return
      await updateNotificacion('usuario')
      const filterNotificaciones = notificaciones.filter((notificacion) => notificacion.tipo !== 'usuario')
      setNotificaciones(filterNotificaciones)
      removeUsuarioNotificaciones()
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isPanelRoute = location.pathname === '/Panel';

  return (
    <div className="div-superior-panel-admin">
      <div className={isPanelRoute ? 'div-superior-panel-admin2' : ''}></div>
      <button className="menu-toggle-btn" onClick={toggleMenu}>
        Menú
      </button>

      <nav className={`menu-lateral ${menuOpen ? 'menu-lateral-open' : ''}`}>
        <button className="close-btn" onClick={toggleMenu}>
          &times; {/* Este es el símbolo "X" */}
        </button>
        <h2>Menú</h2>
        <ul>
          <li className='li-notificaciones' onClick={() => handleUpdateNotificacion('pedido')}>
            {
              handlePedidosNotificaciones() > 0 &&
            <span className='span-notificaciones'>{handlePedidosNotificaciones()}</span>
            }
            <Link to="/panel-pedidos">Área de Pedidos</Link>
          </li>
          <li className='li-notificaciones' onClick={() => handleUpdateNotificacion('usuario')}>
            {
              handleUsuariosNotificaciones() > 0 &&
            <span className='span-notificaciones'>{handleUsuariosNotificaciones()}</span>
            }
            <Link to="/panel-usuarios">Área de Usuarios</Link>
          </li>
          <li>
            <Link to="/panel-filtrado">Crear Filtrado</Link>
          </li>
          <li>
            <Link to="/panel-producto">Crear Producto</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
