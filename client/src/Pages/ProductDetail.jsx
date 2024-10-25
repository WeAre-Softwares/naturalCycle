import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../Styles/Categorías/ProductDetail.css';
import { useGetProductById } from '../hooks/useGetProductById';

export const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { product, error, loading } = useGetProductById(id);

  return (
    <div className="ver-producto-container">
      <div className="button-volver-container">
        <Link to="/Inicio">
          <button className="button-volver-panel-producto">
            <i className="fas fa-arrow-left"></i>&nbsp;&nbsp;Volver
          </button>
        </Link>
      </div>

      {loading && <p>Cargando producto...</p>}
      {error && <p>Hubo un error al cargar el producto.</p>}
      {!loading && !error && !product && <p>Producto no encontrado</p>}

      {!loading && !error && product && (
        <>
          <div className="container-img-ver-producto">
            <img src={product.imagenes[0]?.url} alt={product.nombre} />
          </div>

          <div className="container-precio-nombre-ver-producto">
            <h2 className="nombre-view">{product.nombre}</h2>
            <p className="text-style">
              <strong>Descripción:</strong> {product.descripcion}
            </p>

            <p className="text-style" style={{ marginBottom: '15px' }}>
              <strong>Marca:</strong> {product.marca.nombre}
            </p>

            <div className="text-style" style={{ marginBottom: '15px' }}>
              <strong>Categorías:</strong>
              <ul className="text-list">
                {product.categorias.map((categoria, index) => (
                  <li key={index} className="text-list-item">
                    {categoria.nombre}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-style">
              <strong>Etiquetas:</strong>
              <ul className="text-list">
                {product.etiquetas.map((etiqueta, index) => (
                  <li key={index} className="text-list-item">
                    {etiqueta.nombre}
                  </li>
                ))}
              </ul>
            </div>

            <div className="price-container">
              <p className="precio-view">${product.precio}</p>
              <span style={{ marginLeft: '8px' }}>
                &#8722;{' '}
                {product.tipo_de_precio === 'por_kilo'
                  ? 'Por Kilo'
                  : 'Por Unidad'}
              </span>
            </div>

            <div className="container-cantidad">
              <button className="btn-view">-</button>
              <span className="cantidad-view">10</span>
              <button className="btn-view">+</button>
            </div>

            {product.disponible ? (
              //TODO: Agregar funcionalidad de agregar al carrito
              <button className="btn-view">
                Añadir al carrito <i className="fa-solid fa-cart-shopping"></i>
              </button>
            ) : (
              <button className="btn-iniciar-compra-disabled btn-view" disabled>
                Producto no disponible
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
