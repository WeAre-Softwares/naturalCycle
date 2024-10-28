import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MenuLateralPanel } from '../Components/MenuLateralPanel';

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
    if (marca) {
      setMarcas((prevMarcas) => [
        ...prevMarcas,
        {
          nombre: marca,
          productos: productosMarca,
          destacada,
          imagen: imagenMarca,
        },
      ]);
      setMarca('');
      setProductosMarca([]);
      setProductoMarcaInput('');
      setDestacada(false);
      setImagenMarca(null); // Resetear imagen
    }
  };

  const crearEtiqueta = () => {
    if (etiqueta) {
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
    if (categoria) {
      setCategorias((prevCategorias) => [
        ...prevCategorias,
        { nombre: categoria, productos: productosCategoria },
      ]);
      setCategoria('');
      setProductosCategoria([]);
      setProductoCategoriaInput('');
    }
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
        <MenuLateralPanel />
        <div className="crear-filtrado-container">
          <Link to="/panel-filtrado">
            <button className="button-volver-panel-producto">
              {' '}
              <i class="fas fa-arrow-left"></i>
              &nbsp;&nbsp;Volver
            </button>
          </Link>
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
                <div className="div-img-marca-panel">
                  <strong>Previsualización de la imagen:</strong>
                  <img
                    src={imagenMarca}
                    alt="Previsualización"
                    className="img-marca-panel"
                  />
                </div>
              )}
              <button onClick={crearMarca} className="crear-filtrado-button">
                {marca && productosMarca.length > 0
                  ? 'Actualizar Marca'
                  : 'Crear Marca'}
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

              <button onClick={crearEtiqueta} className="crear-filtrado-button">
                {etiqueta && productosEtiqueta.length > 0
                  ? 'Actualizar Etiqueta'
                  : 'Crear Etiqueta'}
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

              <button
                onClick={crearCategoria}
                className="crear-filtrado-button"
              >
                {categoria && productosCategoria.length > 0
                  ? 'Actualizar Categoría'
                  : 'Crear Categoría'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
