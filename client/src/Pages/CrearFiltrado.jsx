import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const CrearFiltrado = () => {
  const [marca, setMarca] = useState('');
  const [productosMarca, setProductosMarca] = useState([]);
  const [productoMarcaInput, setProductoMarcaInput] = useState('');
  const [destacada, setDestacada] = useState(false);

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
        { nombre: marca, productos: productosMarca, destacada },
      ]);
      setMarca('');
      setProductosMarca([]);
      setProductoMarcaInput('');
      setDestacada(false);
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
    eliminarMarca(index);
  };

  const editarEtiqueta = (index) => {
    const etiquetaEditada = etiquetas[index];
    setEtiqueta(etiquetaEditada.nombre);
    setProductosEtiqueta(etiquetaEditada.productos);
    eliminarEtiqueta(index);
  };

  const editarCategoria = (index) => {
    const categoriaEditada = categorias[index];
    setCategoria(categoriaEditada.nombre);
    setProductosCategoria(categoriaEditada.productos);
    eliminarCategoria(index);
  };

  const handleTipoCreacion = (tipo) => {
    setTipoCreacion(tipo);
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
              className="crear-filtrado-add-button"
            >
              Agregar Producto
            </button>
            <div>
              <strong>Productos:</strong>
              {productosMarca.length > 0 ? (
                <ul>
                  {productosMarca.map((producto, index) => (
                    <li key={index}>
                      {producto}
                      <button
                        onClick={() => eliminarProductoMarca(index)}
                        className="eliminar-producto-button"
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
                Marca destacada
                <input
                  type="checkbox"
                  checked={destacada}
                  onChange={(e) => setDestacada(e.target.checked)}
                />
              </label>
            </div>
            <button
              onClick={crearMarca}
              className="crear-filtrado-create-button"
            >
              Crear Marca
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
              className="crear-filtrado-add-button"
            >
              Agregar Producto
            </button>
            <div>
              <strong>Productos:</strong>
              {productosEtiqueta.length > 0 ? (
                <ul>
                  {productosEtiqueta.map((producto, index) => (
                    <li key={index}>
                      {producto}
                      <button
                        onClick={() => eliminarProductoEtiqueta(index)}
                        className="eliminar-producto-button"
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
              className="crear-filtrado-create-button"
            >
              Crear Etiqueta
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
              className="crear-filtrado-add-button"
            >
              Agregar Producto
            </button>
            <div>
              <strong>Productos:</strong>
              {productosCategoria.length > 0 ? (
                <ul>
                  {productosCategoria.map((producto, index) => (
                    <li key={index}>
                      {producto}
                      <button
                        onClick={() => eliminarProductoCategoria(index)}
                        className="eliminar-producto-button"
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
              className="crear-filtrado-create-button"
            >
              Crear Categoría
            </button>
          </div>
        )}

        <div className="filtrado-lista">
          <h2>Marcas</h2>
          <ul>
            {marcas.map((marca, index) => (
              <li key={index}>
                {marca.nombre} {marca.destacada && '(Destacada)'}
                <button
                  onClick={() => editarMarca(index)}
                  className="editar-button"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarMarca(index)}
                  className="eliminar-button"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <h2>Etiquetas</h2>
          <ul>
            {etiquetas.map((etiqueta, index) => (
              <li key={index}>
                {etiqueta.nombre}
                <button
                  onClick={() => editarEtiqueta(index)}
                  className="editar-button"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarEtiqueta(index)}
                  className="eliminar-button"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <h2>Categorías</h2>
          <ul>
            {categorias.map((categoria, index) => (
              <li key={index}>
                {categoria.nombre}
                <button
                  onClick={() => editarCategoria(index)}
                  className="editar-button"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarCategoria(index)}
                  className="eliminar-button"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
