import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PanelAdmin } from './PanelAdmin';

export const CrearProducto = () => {
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    imagen: '', // Aquí almacenaremos la URL temporal del archivo
    precio: '',
    tipoPrecio: 'unidad',
    stock: false,
    marca: '',
    categoria: '',
    etiquetas: [],
    promocion: false,
    destacado: false,
    nuevoIngreso: false, // Nuevo campo para marcar productos como nuevo ingreso
  });

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState(''); // Estado para la búsqueda
  const [editando, setEditando] = useState(false); // Nuevo estado para saber si estamos editando
  const [indexEditar, setIndexEditar] = useState(null); // Guardar el índice del producto a editar

  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    setProductos(productosGuardados);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === 'imagen' && files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProducto((prev) => ({
          ...prev,
          imagen: e.target.result, // Guardamos la URL temporal del archivo
        }));
      };
      reader.readAsDataURL(files[0]); // Leer el archivo como una URL de datos
    } else {
      setProducto((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const crearProducto = () => {
    if (!producto.nombre || !producto.precio) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    if (editando) {
      // Si estamos editando, actualizamos el producto existente
      const productosActualizados = [...productos];
      productosActualizados[indexEditar] = producto;
      setProductos(productosActualizados);
      localStorage.setItem('productos', JSON.stringify(productosActualizados));
      setEditando(false); // Resetear el estado de edición
      setIndexEditar(null);
    } else {
      // Si no estamos editando, creamos un nuevo producto
      const nuevosProductos = [...productos, producto];
      setProductos(nuevosProductos);
      localStorage.setItem('productos', JSON.stringify(nuevosProductos));
    }

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
      nuevoIngreso: false, // Reiniciar el nuevo ingreso también
    });
    setEditando(false); // Restablecer el estado de edición
    setIndexEditar(null); // Restablecer el índice del producto a editar
  };

  const editarProducto = (index) => {
    const productoAEditar = productos[index];
    setProducto(productoAEditar);
    setEditando(true); // Cambiar el estado para indicar que estamos en modo edición
    setIndexEditar(index); // Guardar el índice del producto a editar
    
    // Scroll hacia la parte superior de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
  };

  return (
    <div className="div-gral-prod-creados">
      <div className="div-general-categoria-panel">
        <PanelAdmin />
        <div className="crear-producto-container">
          <h1 className="crear-producto-header">
            {editando ? 'Actualizar Producto' : 'Crear Producto'}
          </h1>
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
            type="file"
            name="imagen"
            accept="image/*"
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
          <label className="crear-producto-label">
            <input
              type="checkbox"
              name="nuevoIngreso"
              checked={producto.nuevoIngreso}
              onChange={handleChange}
              className="crear-producto-checkbox"
            />
            Nuevo ingreso
          </label>
          <button onClick={crearProducto} className="crear-producto-button">
            {editando ? 'Actualizar Producto' : 'Crear Producto'}
          </button>
        </div>
      </div>
        <div className="productos-creados-container">
          <h2>Lista de productos</h2>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="buscar-producto-input"
          />
          <ul className="productos-lista-panel">
            {productos
              .filter((prod) =>
                prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
              )
              .map((prod, index) => (
                <li key={index} className="producto-item-panel">
                  {prod.imagen && (
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="producto-imagen"
                    />
                  )}
                  <div className="producto-detalles">
                    <h3>{prod.nombre}</h3>
                    <p>Descripción: {prod.descripcion}</p>
                    <p>Precio: ${prod.precio} ({prod.tipoPrecio})</p>
                    <p>Marca: {prod.marca}</p>
                    <p>Categoría: {prod.categoria}</p>
                    <p>{prod.stock ? 'En Stock' : 'Sin Stock'}</p>
                    <p>{prod.promocion ? 'En Promoción' : 'Sin Promoción'}</p>
                    <p>{prod.destacado ? 'Destacado' : 'No Destacado'}</p>
                    <p>{prod.nuevoIngreso ? 'Nuevo Ingreso' : 'Producto Antiguo'}</p>
                  </div>
                  <div className="producto-botones">
                    <button
                      onClick={() => editarProducto(index)}
                      className="crear-filtrado-button"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProducto(index)}
                      className="crear-filtrado-button"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
  );
};
