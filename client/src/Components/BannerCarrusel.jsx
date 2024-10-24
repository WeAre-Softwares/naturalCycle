import React from 'react';
import Slider from 'react-slick';
import { Link, useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../Styles/Inicio/Inicio.css';


export const BannerCarrusel = () => {
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

  return (

    <div className="div-banner-general-slide">
<Link to="/direcciondelprod">
    <Slider className='slide-container-banner' {...settings}>
        
      <div
        className="conteiner-banner-info-inicio"
        
      >
        <div className="div-img-banner">
        <img
          name="img-prod-banner"
          className="img-prod-banner"
          src="/Imagenes/producto-banner.png"
        />
        </div>
        <div className="precio-producto-banner">
          <h2 className="texto-Banner" name="texto-Banner">
            VEGGIE SNACKS (Sabor cebolla)
          </h2>
          <h2 name="precio-banner">A tan sólo $1.199</h2>
        </div>
      </div>

      <div
        className="conteiner-banner-info-inicio"
        
      >
        <div className="div-img-banner">
        <img
          name="img-prod-banner"
          className="img-prod-banner"
          src="/Imagenes/producto-banner.png"
        />
        </div>
        <div className="precio-producto-banner">
          <h2 className="texto-Banner" name="texto-Banner">
            VEGGIE SNACKS (Sabor tomate)
          </h2>
          <h2 name="precio-banner">A tan sólo $1.499</h2>
        </div>
      </div>
    </Slider>
    </Link>
    </div>
  );
};
