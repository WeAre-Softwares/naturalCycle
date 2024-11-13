import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../Styles/Inicio/Inicio.css';
import { useGetAllProductosDestacados } from '../../hooks/hooks-product/useGetAllProductosDestacados';
import useAuthStore from '../../store/use-auth-store';
import { allowedRoles } from '../../constants/allowed-roles';

export const BannerCarrusel = () => {
  const limit = 15; // Límite de productos destacados para mostrar
  const { error, loading, productos } = useGetAllProductosDestacados(limit);
  const { isAuthenticated, getRoles } = useAuthStore();

  // Verificar si el usuario está autenticado y tiene rol de usuario
  const isUserLoggedIn = isAuthenticated();
  const userRoles = getRoles();
  // Verificar si el usuario tiene al menos uno de los roles permitidos
  const hasAccessRole = allowedRoles.some((role) => userRoles.includes(role));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
  };

  if (loading) return <div>Cargando productos destacados...</div>;
  if (error) return <div className="no-productos">
  <i className="fas fa-exclamation-circle"></i>
  <p>Hubo un error al cargar el banner.</p>
</div>;

  return (
    <div className="div-banner-general-slide">
      <Link to="/direcciondelprod">
        <Slider className="slide-container-banner" {...settings}>
          {productos.map((producto, index) => (
            <div
              className="conteiner-banner-info-inicio"
              key={`${producto.producto_id}-${index}`}
            >
              <div className="div-img-banner">
                <img
                  name="img-prod-banner"
                  className="img-prod-banner"
                  src={producto.imagenes[0].url}
                  alt={producto.nombre}
                />
              </div>
              <div className="precio-producto-banner">
                <h2 className="texto-Banner" name="texto-Banner">
                  {producto.nombre}
                </h2>
                {/* Mostrar el precio solo si el usuario está logueado y tiene rol "usuario" */}
                {isUserLoggedIn && hasAccessRole && (
                  <h2 className='precio-banner' name="precio-banner">
                    A tan sólo ${Number(producto.precio).toLocaleString()}
                  </h2>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </Link>
    </div>
  );
};
