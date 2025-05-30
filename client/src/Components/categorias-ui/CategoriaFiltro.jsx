import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useCategoria from '../../context/categorias/useCategoriasContext';

export const CategoriaFiltro = ({
  loading,
  categorias,
  setCategoriaSeleccionada,
}) => {
  const [openFiltroMenu, setOpenFiltroMenu] = useState(false)
  const dropdownRef = useRef(null)
  const { orderBy, setOrderBy, sidebarOpen, setSidebarOpen } = useCategoria()

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth <= 1100) {
          setSidebarOpen(false)
        }
      }
  
      window.addEventListener('resize', handleResize)
  
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setOpenFiltroMenu(false)
        }
      }

      if (openFiltroMenu) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [openFiltroMenu])

  return (
    <>
      <div className="container-boton-filtrado" ref={dropdownRef}>
        <button
          className="boton-categorias"
          onClick={() => setOpenFiltroMenu((prev) => !prev)}
        >
          Filtrar <i className="fa-solid fa-bars"></i>
        </button>
        {
          openFiltroMenu &&
            <div className='filtro-menu' >
                <p>ORDERNAR POR:</p>
                <div className='filtro-menu-botones'>
                  <button onClick={() => setOrderBy('precio_desc')} className={`menu-filtro-marcas ${orderBy === 'precio_desc' && 'active'}`}>Menor precio</button>
                  <button onClick={() => setOrderBy('precio_asc')} className={`menu-filtro-marcas ${orderBy === 'precio_asc' && 'active'}`}>Mayor precio</button>
                  <button onClick={() => setOrderBy('nombre_asc')} className={`menu-filtro-marcas ${orderBy === 'nombre_asc' && 'active'}`}>A - Z</button>
                  <button onClick={() => setOrderBy('nombre_desc')} className={`menu-filtro-marcas ${orderBy === 'nombre_desc' && 'active'}`}>Z - A</button>
                </div>
          </div>
        }
      </div>

      <div
       className={`container-marcas-section-marcas ${sidebarOpen && 'menu-abierto'}`}
      >
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="cerrar-menu">
            X
          </button>
        <h2 className="categorias-header">CATEGORÍAS</h2>
        {
          loading ? (
            (<section className="dots-container-inicio">
              <div className="dot-inicio"></div>
              <div className="dot-inicio"></div>
              <div className="dot-inicio"></div>
              <div className="dot-inicio"></div>
              <div className="dot-inicio"></div>
              </section>
            )
          ): (
            <ul className="categorias-lista">
            {categorias.map((categoria) => (
              <li key={categoria.categoria_id}>
                <Link
                  to={`/categorias/${categoria.nombre}`}
                  onClick={() => {
                    setCategoriaSeleccionada(categoria.nombre);
                    if (window.innerWidth <= 1100) {
                      setSidebarOpen(false)
                    }
                  }}
                >
                  {categoria.nombre}
                </Link>
              </li>
            ))}
          </ul>
          )
        }
        
      </div>
    </>
  );
};
