import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const CrearProducto = () => {
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    imagen: '',
    precio: '',
    tipoPrecio: 'unidad',
    stock: false,
    marca: '',
    categoria: '',
    etiquetas: [],
    promocion: false,
    destacado: false,
  });

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Cargar productos del localStorage al iniciar el componente
    const productosGuardados =
      JSON.parse(localStorage.getItem('productos')) || [];
    setProductos(productosGuardados);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const crearProducto = () => {
    if (!producto.nombre || !producto.precio) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    const nuevosProductos = [...productos, producto];
    setProductos(nuevosProductos);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
    reiniciarFormulario();
  };

  const reiniciarFormulario = () => {
    setProducto({
      nombre: '',
      descripcion: '',
      imagen: '',
      precio: '',
      tipoPrecio: 'unidad',
      stock: false,
      marca: '',
      categoria: '',
      etiquetas: [],
      promocion: false,
      destacado: false,
    });
  };

  const editarProducto = (index) => {
    const productoAEditar = productos[index];
    setProducto(productoAEditar);
    eliminarProducto(index); // Eliminar el producto original para evitar duplicados
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
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
      <div className="crear-producto-container">
        <h1 className="crear-producto-header">Crear Producto</h1>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          value={producto.nombre}
          onChange={handleChange}
          className="crear-producto-input"
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={producto.descripcion}
          onChange={handleChange}
          className="crear-producto-textarea"
        />
        <input
          type="text"
          name="imagen"
          placeholder="URL de la imagen"
          value={producto.imagen}
          onChange={handleChange}
          className="crear-producto-input"
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={producto.precio}
          onChange={handleChange}
          className="crear-producto-input"
        />
        <select
          name="tipoPrecio"
          onChange={handleChange}
          value={producto.tipoPrecio}
          className="crear-producto-select"
        >
          <option value="unidad">Por unidad</option>
          <option value="kilogramo">Por kilogramo</option>
        </select>
        <label className="crear-producto-label">
          <input
            type="checkbox"
            name="stock"
            checked={producto.stock}
            onChange={handleChange}
            className="crear-producto-checkbox"
          />
          En Stock
        </label>
        <input
          type="text"
          name="categoria"
          placeholder="Categoría"
          value={producto.categoria}
          onChange={handleChange}
          className="crear-producto-input"
        />
        <input
          type="text"
          name="marca"
          placeholder="Marca"
          value={producto.marca}
          onChange={handleChange}
          className="crear-producto-input"
        />
        <label className="crear-producto-label">
          <input
            type="checkbox"
            name="promocion"
            checked={producto.promocion}
            onChange={handleChange}
            className="crear-producto-checkbox"
          />
          Producto en promoción
        </label>
        <label className="crear-producto-label">
          <input
            type="checkbox"
            name="destacado"
            checked={producto.destacado}
            onChange={handleChange}
            className="crear-producto-checkbox"
          />
          Producto destacado
        </label>
        <button onClick={crearProducto} className="crear-producto-button">
          {productos.length > 0 && producto.nombre
            ? 'Actualizar Producto'
            : 'Crear Producto'}
        </button>
      </div>

      {/* Container para mostrar los productos creados */}
      <div className="productos-creados-container">
        <h2>Productos Creado</h2>
        <ul>
          {productos.map((prod, index) => (
            <li key={index} className="producto-item">
              <h3>{prod.nombre}</h3>
              <p>{prod.descripcion}</p>
              <img
                src={prod.imagen}
                alt={prod.nombre}
                className="producto-imagen"
              />
              <p>
                Precio: ${prod.precio} ({prod.tipoPrecio})
              </p>
              <p>Marca: {prod.marca}</p>
              <p>Categoría: {prod.categoria}</p>
              <p>{prod.stock ? 'En Stock' : 'Sin Stock'}</p>
              <p>{prod.promocion ? 'En Promoción' : 'Sin Promoción'}</p>
              <p>{prod.destacado ? 'Destacado' : 'No Destacado'}</p>
              <button
                onClick={() => editarProducto(index)}
                className="editar-producto-button"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarProducto(index)}
                className="eliminar-producto-button"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
