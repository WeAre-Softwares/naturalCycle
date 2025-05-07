import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../Styles/Inicio/Inicio.css';
import { useGetAllProductosDestacados } from '../../hooks/hooks-product/useGetAllProductosDestacados';
import useAuthStore from '../../store/use-auth-store';
import { allowedRoles } from '../../constants/allowed-roles';
import ImgAbout from '/imagenes/logo-sin-fondo.png';
import { strToUppercase } from '../../helpers/strToUpercase';

export const BannerCarrusel = () => {
  const navigate = useNavigate();
  const limit = 15; 
  const { error, loading, productos } = useGetAllProductosDestacados(limit);
  const { isAuthenticated, getRoles } = useAuthStore();

  const isUserLoggedIn = isAuthenticated();
  const userRoles = getRoles();
  const hasAccessRole = allowedRoles.some((role) => userRoles.includes(role));

  const settings = {
    dots: true,
    infinite: productos.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
  };

  const verDetallesProducto = (productoId) => {
    navigate(`/producto/${productoId}`);
  };

  if (loading) return <div>Cargando productos destacados...</div>;
  if (error)
    return (
      <div className="no-productos">
        <i className="fas fa-exclamation-circle"></i>
        <p>Hubo un error al cargar el banner.</p>
      </div>
    );

  // Si no hay productos, mostrar un nuevo div con la imagen predeterminada
  if (productos.length === 0) {
    return (
      <div className="div-banner-inicio-vacio">
        <img
          className="img-placeholder"
          src={ImgAbout}
          alt="Sin productos destacados"
        />
      </div>
    );
  }

  return (
    <div className="div-banner-general-slide">
      <Slider className="slide-container-banner" {...settings}>
        {productos.map((producto, index) => (
          <div
            className="conteiner-banner-info-inicio"
            key={`${producto.producto_id}-${index}`}
          >
            <div
              className="div-img-banner"
              onClick={() => verDetallesProducto(producto.producto_id)}
            >
              <img
                name="img-prod-banner"
                className="img-prod-banner"
                src={producto.imagenes[0].url}
                alt={producto.nombre}
              />
            </div>
            <div
              className="precio-producto-banner"
              onClick={() => verDetallesProducto(producto.producto_id)}
            >
              <h2 className="texto-Banner" name="texto-Banner">
                {strToUppercase(producto.nombre)}
              </h2>
              {/* Mostrar el precio solo si el usuario está logueado y tiene rol "usuario" */}
              {isUserLoggedIn && hasAccessRole && (
                <h2 className="precio-banner" name="precio-banner">
                  A tan sólo ${Number(producto.precio)}
                </h2>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
