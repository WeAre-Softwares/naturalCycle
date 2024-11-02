import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../Styles/Inicio/Inicio.css';
import { useGetAllProductosDestacados } from '../../hooks/hooks-product/useGetAllProductosDestacados';

export const BannerCarrusel = () => {
  const limit = 15; // Límite de productos destacados para mostrar
  const { error, loading, productos } = useGetAllProductosDestacados(limit);

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
  if (error) return <div>Error al cargar productos</div>;

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
                <h2 name="precio-banner">
                  A tan sólo ${Math.round(Number(producto.precio))}
                </h2>
                {/* Redondea el precio */}
              </div>
            </div>
          ))}
        </Slider>
      </Link>
    </div>
  );
};
