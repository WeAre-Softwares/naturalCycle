import React from 'react';
import '../Styles/Inicio/Inicio.css';

const productosDestacados = [
  {
    id: 1,
    imgSrc: './Imagenes/producto-banner.png',
    nombre: 'Nombre producto 1',
    precio: '$5000',
    stock: 'Stock disponible',
  },
  {
    id: 2,
    imgSrc: './Imagenes/producto-banner.png',
    nombre: 'Nombre producto 2',
    precio: '$5000',
    stock: 'Stock disponible',
  },
  {
    id: 3,
    imgSrc: './Imagenes/producto-banner.png',
    nombre: 'Nombre producto 3',
    precio: '$5000',
    stock: 'Stock disponible',
  },
  {
    id: 4,
    imgSrc: './Imagenes/producto-banner.png',
    nombre: 'Nombre producto 4',
    precio: '$5000',
    stock: 'Stock disponible',
  },
  {
    id: 5,
    imgSrc: './Imagenes/producto-banner.png',
    nombre: 'Nombre producto 5',
    precio: '$5000',
    stock: 'Stock disponible',
  },
  {
    id: 6,
    imgSrc: './Imagenes/producto-banner.png',
    nombre: 'Nombre producto 6',
    precio: '$5000',
    stock: 'Stock disponible',
  },
  {
    id: 7,
    imgSrc: './Imagenes/producto-banner.png',
    nombre: 'Nombre producto 7',
    precio: '$5000',
    stock: 'Stock disponible',
  },
  {
    id: 8,
    imgSrc: './Imagenes/producto-banner.png',
    nombre: 'Nombre producto 8',
    precio: '$5000',
    stock: 'Stock disponible',
  },
];

export const Inicio = () => {
  return (
    <div className="conteiner-general-inicio">
      <div
        className="conteiner-banner-inicio"
        style={{
          backgroundImage: 'url(/Imagenes/BANNER.svg)',
          backgroundPosition: 'center',
          backgroundSize: '100% auto',
          width: '100%',
        }}
      >
        <img
          name="img-prod-banner"
          className="img-prod-banner"
          src="./Imagenes/producto-banner.png"
          alt=""
        />
        <img
          name="img-prod-banner"
          className="img-prod-banner2"
          src="./Imagenes/producto-banner.png"
          alt=""
        />
        <div className="precio-producto-banner">
          <h2 className="texto-Banner" name="texto-Banner">
            VEGGIE SNACKS (Sabor cebolla)
          </h2>
          <h2 name="precio-banner">A tan sólo $1.199</h2>
        </div>
      </div>

      <div className="conteiner-cards-inicio">
        <div className="card-inicio-top3 refrigerados">
          <h3>REFRIGERADOS</h3>
        </div>
        <div className="card-inicio-top3 alacena">
          <h3>ALACENA</h3>
        </div>
        <div className="card-inicio-top3 congelados">
          <h3>CONGELADOS</h3>
        </div>
      </div>

      <div className="container-banner-info-inicio">
        <div className="card-banner-info-inicio">
          <i className="fa-solid fa-truck"></i>
          <h3>Envíos gratis a partir de $50.000</h3>
          <p>A todo el país</p>
        </div>
        <div className="card-banner-info-inicio">
          <i className="fa-regular fa-credit-card"></i>
          <h3>Medios de pago</h3>
          <p>Transferencia, efectivo, tarjetas</p>
        </div>
        <div className="card-banner-info-inicio">
          <i className="fa-solid fa-store"></i>
          <h3>Distribuidora mayorista</h3>
          <p>Los mejores precios los encontras acá</p>
        </div>
      </div>

      <div className="seccion-prod-destacados">
        <div className="container-h2-prod-destacados">
          <h2 className="titulo-pre-banner">Productos destacados</h2>
        </div>
        <div className="productos-destacados">
          {productosDestacados.map((producto) => (
            <div className="card-producto" key={producto.id}>
              <div className="info-producto-card">
                <img
                  name={`img-producto-card-${producto.id}`}
                  className="img-producto-card"
                  src={producto.imgSrc}
                  alt=""
                />
                <p name={`tipo-precio-producto-${producto.id}`}>
                  (Precio por unidad)
                </p>
                <h2
                  className="nombre-producto-card"
                  name={`nombre-producto-card-${producto.id}`}
                >
                  {producto.nombre}
                </h2>
                <h2
                  className="precio-producto-card"
                  name={`precio-producto-card-${producto.id}`}
                >
                  {producto.precio}
                </h2>
                <p name={`stock-producto-card-${producto.id}`}>
                  {producto.stock}
                </p>
              </div>
              <div className="botones-card-producto">
                <button>
                  Añadir al carrito{' '}
                  <i className="fa-solid fa-cart-shopping"></i>
                </button>
                <button>
                  Ver producto <i className="fa-solid fa-eye"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-pasos-compra">
        <div className="container-titulo-pasos-compra">
          <h2 className="titulo-pre-banner">
            Cómo comprar en nuestra distribuidora?
          </h2>
        </div>
        <div className="container-banner-compra">
          <div className="card-banner-compra">
            <h3>
              <i className="fa-solid fa-dice-one"></i>
            </h3>
            <h3>Creá tu cuenta</h3>
            <p>COMPLETÁ TUS DATOS Y ESPERÁ A QUE VALIDEMOS TU USUARIO</p>
          </div>
          <div className="card-banner-compra">
            <h3>
              <i className="fa-solid fa-dice-two"></i>
            </h3>
            <h3>Armá tu carrito</h3>
            <p>SELECCIONÁ LOS PRODUCTOS (PEDIDO MIN. $25.000ARS)</p>
          </div>
          <div className="card-banner-compra">
            <h3>
              <i className="fa-solid fa-dice-three"></i>
            </h3>
            <h3>Finalizá tu PEDIDO</h3>
            <p>
              INGRESÁ A TU CARRITO DE COMPRAS, REVISALO Y CONFIRMÁ TU PEDIDO
            </p>
          </div>
          <div className="card-banner-compra">
            <h3>
              <i className="fa-solid fa-dice-four"></i>
            </h3>
            <h3>Realizá el pago</h3>
            <p>TE CONTACTAREMOS PARA REALIZAR EL PAGO</p>
          </div>
        </div>
      </div>

      <div className="seccion-marcas-destacadas">
        <div className="h2-marcas-destacadas">
          <h2 className="titulo-pre-banner">MARCAS DESTACADAS</h2>
        </div>
        <div className="marcas-destacadas">
          {Array.from({ length: 8 }, (_, index) => (
            <div className="card-marca-destacadas" key={index}>
              <img
                name={`img-marca-card-${index + 1}`}
                src="./Imagenes/producto-banner.png"
                alt=""
              />
            </div>
          ))}
        </div>
      </div>

      <div className="container-instagram-inicio">
        <h2>Estamos en</h2>
        <div className="instagram-inicio-tooltip-container">
          <div className="instagram-inicio-tooltip">
            <div className="instagram-inicio-profile">
              <div className="instagram-inicio-user">
                <div className="instagram-inicio-img">NC</div>
                <div className="instagram-inicio-details">
                  <div className="instagram-inicio-name">
                    <h5>Natural Cycle</h5>
                  </div>
                  <div className="instagram-inicio-username">@naturalcycle</div>
                </div>
              </div>
            </div>
          </div>
          <div className="instagram-inicio-text">
            <a className="instagram-inicio-icon" href="#">
              <div className="instagram-inicio-layer">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span className="instagram-inicio-instagramSVG">
                  <svg
                    fill="white"
                    className="instagram-inicio-svgIcon"
                    viewBox="0 0 448 512"
                    height="1.5em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                  </svg>
                </span>
              </div>
              <div className="instagram-inicio-text">Instagram</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
