import React, { useState, useEffect } from 'react';
import { MenuLateralPanel } from '../Components/MenuLateralPanel';
import { Link } from 'react-router-dom';

export const PanelFiltrados = () => {
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
  
    const [tipoCreacion, setTipoCreacion] = useState('marca');

    // Estado para manejar la búsqueda
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleTipoCreacion = (e) => {
      setTipoCreacion(e.target.value);
    };

    // Función para eliminar una marca
    const eliminarMarca = (index) => {
      const nuevasMarcas = [...marcas];
      nuevasMarcas.splice(index, 1);
      setMarcas(nuevasMarcas);
  };

  // Función para eliminar una etiqueta
  const eliminarEtiqueta = (index) => {
      const nuevasEtiquetas = [...etiquetas];
      nuevasEtiquetas.splice(index, 1);
      setEtiquetas(nuevasEtiquetas);
  };

  // Función para eliminar una categoría (ya existente)
  const eliminarCategoria = (index) => {
      const nuevasCategorias = [...categorias];
      nuevasCategorias.splice(index, 1);
      setCategorias(nuevasCategorias);
  };

    // Función para manejar el input de búsqueda
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value.toLowerCase());
    };

    // Filtrar las listas basadas en el término de búsqueda
    const filteredMarcas = marcas.filter((marca) => 
      marca.nombre.toLowerCase().includes(searchTerm)
    );
    
    const filteredEtiquetas = etiquetas.filter((etiqueta) =>
      etiqueta.nombre.toLowerCase().includes(searchTerm)
    );
    
    const filteredCategorias = categorias.filter((categoria) =>
      categoria.nombre.toLowerCase().includes(searchTerm)
    );

    return (
      <div className="div-gral-prod-creados">
        <div className="div-general-categoria-panel">
          <MenuLateralPanel/>
          <div className="productos-creados-container">
            <h2>Filtrados</h2>
            
            {/* Input de búsqueda */}
            <input
              type="text"
              placeholder={`Buscar por ${tipoCreacion}`}
              className="buscar-producto-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            
            {/* Select para elegir entre marca, categoría y etiqueta */}
            <select
              value={tipoCreacion}
              onChange={handleTipoCreacion}
              className="select-tipo-filtrado"
            >
              <option value="marca">Marca</option>
              <option value="categoria">Categoría</option>
              <option value="etiqueta">Etiqueta</option>
            </select>

            <Link to="/crearfiltrado">
              <button className='button-abrir-crear-producto'>
                <i className='fas fa-plus'></i>
              </button>
            </Link>

            {/* Renderizado condicional según la selección */}
            {tipoCreacion === 'marca' && (
              <>
                <h3>Marcas:</h3>

                <ul className="productos-lista-panel">
                {filteredMarcas.map((marca, index) => (
            <li className="producto-item-panel" key={index}>
              {marca.imagen && (
                        <img
                          src={marca.imagen}
                          alt={`Logo de ${marca.nombre}`}
                          className="producto-imagen"
                        />
                      )}

              <div className="producto-detalles">
              <strong>{marca.nombre}</strong> {marca.destacada && '(Destacada)'}

              </div>
              <div className="producto-botones">
              <button className="crear-filtrado-button" onClick={() => editarMarca(index)}>Editar</button>
              <button className="crear-filtrado-button" onClick={() => eliminarMarca(index)}>Eliminar</button>
              </div>
            </li>
             ))}
          </ul>
              </>
            )}

            {tipoCreacion === 'etiqueta' && (
              <>
                <h3>Etiquetas:</h3>
                <ul className="productos-lista-panel">
                  {filteredEtiquetas.map((etiqueta, index) => (
                    <li className="producto-item-panel" key={index}>
                      <div className="producto-detalles">
                      <strong>{etiqueta.nombre}</strong>
                      </div>
                      <div className="producto-botones">
                      <button className="crear-filtrado-button" onClick={() => editarEtiqueta(index)}>Editar</button>
                      <button className="crear-filtrado-button" onClick={() => eliminarEtiqueta(index)}>Eliminar</button>
                      </div>
                    </li>
                  ))}
                </ul>

              </>
            )}

            {tipoCreacion === 'categoria' && (
              <>
                <h3>Categorías:</h3>
                <ul className="productos-lista-panel">
                  {filteredCategorias.map((categoria, index) => (
                    <li className="producto-item-panel" key={index}>
                      <div className="producto-detalles">
                      <strong>{categoria.nombre}</strong>
                      </div>
                      <div className="producto-botones">
                      <button className="crear-filtrado-button" onClick={() => editarCategoria(index)}>Editar</button>
                      <button className="crear-filtrado-button" onClick={() => eliminarCategoria(index)}>Eliminar</button>
                      </div>
                    </li>
                  ))}
                </ul>

               
              </>
            )}
          </div>
        </div>
      </div>
    );
};
