import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const usuariosIniciales = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    cuit: '20-12345678-9',
    comercio: 'Comercio 1',
    domicilio: 'Domicilio 1',
    email: 'juan@example.com',
    aprobado: false,
  },
  {
    id: 2,
    nombre: 'Ana',
    apellido: 'Gómez',
    cuit: '20-87654321-0',
    comercio: 'Comercio 2',
    domicilio: 'Domicilio 2',
    email: 'ana@example.com',
    aprobado: true,
  },
  // Más usuarios...
];

export const AreaUsuarios = () => {
  // Cargar usuarios desde localStorage o usar los iniciales
  const [usuarios, setUsuarios] = useState(() => {
    const usuariosGuardados = localStorage.getItem('usuarios');
    return usuariosGuardados
      ? JSON.parse(usuariosGuardados)
      : usuariosIniciales;
  });

  const [filtro, setFiltro] = useState('pendientes');
  const [busqueda, setBusqueda] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); // Estado para el usuario seleccionado

  // Guardar usuarios en localStorage cada vez que se actualicen
  useEffect(() => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  const filtrarUsuarios = () => {
    return usuarios.filter((usuario) => {
      const nombreCompleto =
        `${usuario.nombre} ${usuario.apellido}`.toLowerCase();
      return (
        (filtro === 'pendientes' ? !usuario.aprobado : usuario.aprobado) &&
        nombreCompleto.includes(busqueda.toLowerCase())
      );
    });
  };

  const aprobarUsuario = (id) => {
    setUsuarios(
      usuarios.map((usuario) =>
        usuario.id === id ? { ...usuario, aprobado: true } : usuario,
      ),
    );
  };

  const devolverUsuario = (id) => {
    setUsuarios(
      usuarios.map((usuario) =>
        usuario.id === id ? { ...usuario, aprobado: false } : usuario,
      ),
    );
  };

  const mostrarDetallesUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
  };

  const cerrarDetallesUsuario = () => {
    setUsuarioSeleccionado(null);
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
      <div className="area-usuarios-container">
        <h1 className="area-usuarios-header">Área de Usuarios</h1>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="area-usuarios-input"
        />
        <button
          onClick={() =>
            setFiltro(filtro === 'pendientes' ? 'aprobados' : 'pendientes')
          }
          className="area-usuarios-toggle-button"
        >
          {filtro === 'pendientes' ? 'Ver Aprobados' : 'Ver Pendientes'}
        </button>
        <div className="area-usuarios-list">
          {filtrarUsuarios().map((usuario) => (
            <div key={usuario.id} className="area-usuarios-item">
              <p
                className="area-usuarios-name"
                onClick={() => mostrarDetallesUsuario(usuario)} // Mostrar detalles al hacer clic
              >
                {usuario.nombre} {usuario.apellido}
              </p>
              {filtro === 'pendientes' ? (
                <button
                  onClick={() => aprobarUsuario(usuario.id)}
                  className="area-usuarios-approve-button"
                >
                  Aprobar
                </button>
              ) : (
                <button
                  onClick={() => devolverUsuario(usuario.id)}
                  className="area-usuarios-return-button"
                >
                  Dar de baja
                </button>
              )}
            </div>
          ))}
        </div>
        {/* Tarjeta de detalles del usuario */}
        {usuarioSeleccionado && (
          <div className="usuario-detalle-card">
            <h2 className="usuario-detalle-title">Detalles del Usuario</h2>
            <div className="usuario-detalle-info">
              <div className="usuario-detalle-row">
                <strong>ID:</strong> <span>{usuarioSeleccionado.id}</span>
              </div>
              <div className="usuario-detalle-row">
                <strong>Nombre:</strong>{' '}
                <span>
                  {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}
                </span>
              </div>
              <div className="usuario-detalle-row">
                <strong>CUIT/CUIL:</strong>{' '}
                <span>{usuarioSeleccionado.cuit}</span>
              </div>
              <div className="usuario-detalle-row">
                <strong>Nombre del Comercio:</strong>{' '}
                <span>{usuarioSeleccionado.comercio}</span>
              </div>
              <div className="usuario-detalle-row">
                <strong>Domicilio Fiscal del Comercio:</strong>{' '}
                <span>{usuarioSeleccionado.domicilio}</span>
              </div>
              <div className="usuario-detalle-row">
                <strong>Email:</strong> <span>{usuarioSeleccionado.email}</span>
              </div>
              <div className="usuario-detalle-row">
                <strong>Estado:</strong>{' '}
                <span
                  className={
                    usuarioSeleccionado.aprobado
                      ? 'estado-aprobado'
                      : 'estado-pendiente'
                  }
                >
                  {usuarioSeleccionado.aprobado ? 'Aprobado' : 'Pendiente'}
                </span>
              </div>
            </div>
            <button
              onClick={cerrarDetallesUsuario}
              className="usuario-detalle-close-button"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
