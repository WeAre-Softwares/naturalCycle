import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PanelAdmin } from './PanelAdmin';

export const CrearFiltrado = () => {
  const [marca, setMarca] = useState('');
  const [productosMarca, setProductosMarca] = useState([]);
  const [productoMarcaInput, setProductoMarcaInput] = useState('');
  const [destacada, setDestacada] = useState(false);
  const [imagenMarca, setImagenMarca] = useState(null); // Nuevo estado para la imagen

  const [etiqueta, setEtiqueta] = useState('');
  const [productosEtiqueta, setProductosEtiqueta] = useState([]);
  const [productoEtiquetaInput, setProductoEtiquetaInput] = useState('');

  const [categoria, setCategoria] = useState('');
  const [productosCategoria, setProductosCategoria] = useState([]);
  const [productoCategoriaInput, setProductoCategoriaInput] = useState('');

  const [tipoCreacion, setTipoCreacion] = useState('');

  // Estados para almacenar las listas
  const [marcas, setMarcas] = useState(() => {
    const storedMarcas = JSON.parse(localStorage.getItem('marcas'));
    return storedMarcas || [];
  });

  const [etiquetas, setEtiquetas] = useState(() => {
    const storedEtiquetas = JSON.parse(localStorage.getItem('etiquetas'));
    return storedEtiquetas || [];
  });

  const [categorias, setCategorias] = useState(() => {
    const storedCategorias = JSON.parse(localStorage.getItem('categorias'));
    return storedCategorias || [];
  });

  // Guardar listas en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('marcas', JSON.stringify(marcas));
  }, [marcas]);

  useEffect(() => {
    localStorage.setItem('etiquetas', JSON.stringify(etiquetas));
  }, [etiquetas]);

  useEffect(() => {
    localStorage.setItem('categorias', JSON.stringify(categorias));
  }, [categorias]);

  const crearMarca = () => {
    if (marca && productosMarca.length > 0) {
      setMarcas((prevMarcas) => [
        ...prevMarcas,
        { nombre: marca, productos: productosMarca, destacada, imagen: imagenMarca },
      ]);
      setMarca('');
      setProductosMarca([]);
      setProductoMarcaInput('');
      setDestacada(false);
      setImagenMarca(null); // Resetear imagen
    }
  };

  const crearEtiqueta = () => {
    if (etiqueta && productosEtiqueta.length > 0) {
      setEtiquetas((prevEtiquetas) => [
        ...prevEtiquetas,
        { nombre: etiqueta, productos: productosEtiqueta },
      ]);
      setEtiqueta('');
      setProductosEtiqueta([]);
      setProductoEtiquetaInput('');
    }
  };

  const crearCategoria = () => {
    if (categoria && productosCategoria.length > 0) {
      setCategorias((prevCategorias) => [
        ...prevCategorias,
        { nombre: categoria, productos: productosCategoria },
      ]);
      setCategoria('');
      setProductosCategoria([]);
      setProductoCategoriaInput('');
    }
  };

  const agregarProductoMarca = () => {
    if (productoMarcaInput) {
      setProductosMarca((prevProductos) => [
        ...prevProductos,
        productoMarcaInput,
      ]);
      setProductoMarcaInput('');
    }
  };

  const agregarProductoEtiqueta = () => {
    if (productoEtiquetaInput) {
      setProductosEtiqueta((prevProductos) => [
        ...prevProductos,
        productoEtiquetaInput,
      ]);
      setProductoEtiquetaInput('');
    }
  };

  const agregarProductoCategoria = () => {
    if (productoCategoriaInput) {
      setProductosCategoria((prevProductos) => [
        ...prevProductos,
        productoCategoriaInput,
      ]);
      setProductoCategoriaInput('');
    }
  };

  const eliminarProductoMarca = (index) => {
    const nuevosProductos = productosMarca.filter((_, i) => i !== index);
    setProductosMarca(nuevosProductos);
  };

  const eliminarProductoEtiqueta = (index) => {
    const nuevosProductos = productosEtiqueta.filter((_, i) => i !== index);
    setProductosEtiqueta(nuevosProductos);
  };

  const eliminarProductoCategoria = (index) => {
    const nuevosProductos = productosCategoria.filter((_, i) => i !== index);
    setProductosCategoria(nuevosProductos);
  };

  const eliminarMarca = (index) => {
    const nuevasMarcas = marcas.filter((_, i) => i !== index);
    setMarcas(nuevasMarcas);
  };

  const eliminarEtiqueta = (index) => {
    const nuevasEtiquetas = etiquetas.filter((_, i) => i !== index);
    setEtiquetas(nuevasEtiquetas);
  };

  const eliminarCategoria = (index) => {
    const nuevasCategorias = categorias.filter((_, i) => i !== index);
    setCategorias(nuevasCategorias);
  };

  const editarMarca = (index) => {
    const marcaEditada = marcas[index];
    setMarca(marcaEditada.nombre);
    setProductosMarca(marcaEditada.productos);
    setDestacada(marcaEditada.destacada);
    setImagenMarca(marcaEditada.imagen); // Cargar imagen para editar
    eliminarMarca(index);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Agregar scroll suave hacia arriba
  };

  const editarEtiqueta = (index) => {
    const etiquetaEditada = etiquetas[index];
    setEtiqueta(etiquetaEditada.nombre);
    setProductosEtiqueta(etiquetaEditada.productos);
    eliminarEtiqueta(index);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Agregar scroll suave hacia arriba
  };

  const editarCategoria = (index) => {
    const categoriaEditada = categorias[index];
    setCategoria(categoriaEditada.nombre);
    setProductosCategoria(categoriaEditada.productos);
    eliminarCategoria(index);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Agregar scroll suave hacia arriba
  };

  const handleTipoCreacion = (tipo) => {
    setTipoCreacion(tipo);
  };

  // Manejar carga de imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenMarca(reader.result); // Guardar la URL de la imagen
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="div-gral-prod-creados">
      <div className="div-general-categoria-panel">
        <PanelAdmin />
        <div className="crear-filtrado-container">
          <h1 className="crear-filtrado-header">Crear Filtrado</h1>

          <div className="tipo-filtrado">
            <button
              onClick={() => handleTipoCreacion('marca')}
              className="crear-filtrado-button"
            >
              Crear Marca
            </button>
            <button
              onClick={() => handleTipoCreacion('etiqueta')}
              className="crear-filtrado-button"
            >
              Crear Etiqueta
            </button>
            <button
              onClick={() => handleTipoCreacion('categoria')}
              className="crear-filtrado-button"
            >
              Crear Categoría
            </button>
          </div>
          {tipoCreacion === 'marca' && (
  <div className="crear-filtrado-form">
    <input
      type="text"
      placeholder="Nombre de la marca"
      value={marca}
      onChange={(e) => setMarca(e.target.value)}
      className="crear-filtrado-input"
    />
    <input
      type="text"
      placeholder="Agregar producto"
      value={productoMarcaInput}
      onChange={(e) => setProductoMarcaInput(e.target.value)}
      className="crear-filtrado-input"
    />
    <button
      onClick={agregarProductoMarca}
      className="crear-filtrado-button agregar-producto"
    >
      Agregar Producto
    </button>
    <div className='div-ul-prod-editar'>
      <strong>Productos: </strong>
      {productosMarca.length > 0 ? (
        <ul>
          {productosMarca.map((producto, index) => (
            <li key={index}>
            {producto} &nbsp;&nbsp;
            <button
              onClick={() => eliminarProductoMarca(index)}
              className="crear-filtrado-button"
            >
              Eliminar
            </button>
          </li>
          
          ))}
        </ul>
      ) : (
        <span>No hay productos asignados</span>
      )}
    </div>
    <div className="crear-filtrado-checkbox">
      <label>
        <p>Marca destacada </p>
        <input
          type="checkbox"
          checked={destacada}
          onChange={(e) => setDestacada(e.target.checked)}
        />
      </label>
    </div>
    <input
      type="file"
      accept="image/*"
      onChange={handleImagenChange}
      className="crear-filtrado-input"
    />
    {imagenMarca && (
      <div className='div-img-marca-panel'>
        <strong>Previsualización de la imagen:</strong>
        <img
          src={imagenMarca}
          alt="Previsualización"
          className='img-marca-panel'
        />
      </div>
    )}
    <button
      onClick={crearMarca}
      className="crear-filtrado-button"
    >
      {marca && productosMarca.length > 0 ? 'Actualizar Marca' : 'Crear Marca'}
    </button>
  </div>
)}

{tipoCreacion === 'etiqueta' && (
  <div className="crear-filtrado-form">
    <input
      type="text"
      placeholder="Nombre de la etiqueta"
      value={etiqueta}
      onChange={(e) => setEtiqueta(e.target.value)}
      className="crear-filtrado-input"
    />
    <input
      type="text"
      placeholder="Agregar producto"
      value={productoEtiquetaInput}
      onChange={(e) => setProductoEtiquetaInput(e.target.value)}
      className="crear-filtrado-input"
    />
    <button
      onClick={agregarProductoEtiqueta}
      className="crear-filtrado-button agregar-producto"
    >
      Agregar Producto
    </button>
    <div className='div-ul-prod-editar'>
      <strong>Productos: </strong>
      {productosEtiqueta.length > 0 ? (
        <ul>
          {productosEtiqueta.map((producto, index) => (
            <li key={index}>
              {producto}&nbsp;&nbsp;
              <button
                onClick={() => eliminarProductoEtiqueta(index)}
                className="crear-filtrado-button"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <span>No hay productos asignados</span>
      )}
    </div>
    <button
      onClick={crearEtiqueta}
      className="crear-filtrado-button"
    >
      {etiqueta && productosEtiqueta.length > 0 ? 'Actualizar Etiqueta' : 'Crear Etiqueta'}
    </button>
  </div>
)}

{tipoCreacion === 'categoria' && (
  <div className="crear-filtrado-form">
    <input
      type="text"
      placeholder="Nombre de la categoría"
      value={categoria}
      onChange={(e) => setCategoria(e.target.value)}
      className="crear-filtrado-input"
    />
    <input
      type="text"
      placeholder="Agregar producto"
      value={productoCategoriaInput}
      onChange={(e) => setProductoCategoriaInput(e.target.value)}
      className="crear-filtrado-input"
    />
    <button
      onClick={agregarProductoCategoria}
      className="crear-filtrado-button agregar-producto"
    >
      Agregar Producto
    </button>
    <div className='div-ul-prod-editar'>
      <strong>Productos: </strong>
      {productosCategoria.length > 0 ? (
        <ul>
          {productosCategoria.map((producto, index) => (
            <li key={index}>
              {producto}&nbsp;&nbsp;
              <button
                onClick={() => eliminarProductoCategoria(index)}
                className="crear-filtrado-button"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <span>No hay productos asignados</span>
      )}
    </div>
    <button
      onClick={crearCategoria}
      className="crear-filtrado-button"
    >
      {categoria && productosCategoria.length > 0 ? 'Actualizar Categoría' : 'Crear Categoría'}
    </button>
  </div>
)}



        </div>
      </div>
          <div className="div-filtrados-creados">
            <h2>Filtrados creados:</h2>
            <h3>Marcas:</h3>
            <ul>
              {marcas.map((marca, index) => (
                <li key={index}>
                  <strong>{marca.nombre}</strong> {marca.destacada && '(Destacada)'}
                  {marca.imagen && (
                    <img
                      src={marca.imagen}
                      alt={`Logo de ${marca.nombre}`}
                      className="img-marca-panel"
                    />
                  )}
                  <button className="crear-filtrado-button"  onClick={() => editarMarca(index)}>Editar</button>
                  <button className="crear-filtrado-button" onClick={() => eliminarMarca(index)}>Eliminar</button>
                </li>
              ))}
            </ul>
            <h3>Etiquetas:</h3>
            <ul>
              {etiquetas.map((etiqueta, index) => (
                <li key={index}>
                  <strong>{etiqueta.nombre}</strong>
                  <button className="crear-filtrado-button" onClick={() => editarEtiqueta(index)}>Editar</button>
                  <button className="crear-filtrado-button" onClick={() => eliminarEtiqueta(index)}>Eliminar</button>
                </li>
              ))}
            </ul>
            <h3>Categorías:</h3>
            <ul>
              {categorias.map((categoria, index) => (
                <li key={index}>
                  <strong>{categoria.nombre}</strong>
                  <button className="crear-filtrado-button" onClick={() => editarCategoria(index)}>Editar</button>
                  <button className="crear-filtrado-button" onClick={() => eliminarCategoria(index)}>Eliminar</button>
                </li>
              ))}
            </ul>
          </div>
    </div>
  );
};
