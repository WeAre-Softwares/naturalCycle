import React from 'react';
import '../Styles/Sobre nosotros/About.css';
import ImgAbout from '/imagenes/img-about.png';

export const About = () => {
  return (
    <div className="container-general-quienes-somos">
      <div className="container-h2-quienes-somos">
        <h2>¿QUIENES SOMOS?</h2>
      </div>

      <div className="container-texto-imagen-quienes-somos">
        <div className="texto-quienes-somos">
          <p>
            Natural Cycle es una distribuidora mayorista de alimentos naturales
            que está en el mercado desde 2021, comprometida con ofrecer
            productos de alta calidad y frescura. Nos especializamos en la
            distribución de una amplia gama de alimentos saludables, incluyendo
            granos, semillas, frutos secos, superalimentos y productos
            orgánicos. Trabajamos de la mano con proveedores cuidadosamente
            seleccionados que comparten nuestros valores de sostenibilidad y
            respeto por el medio ambiente. Nuestro objetivo es ser el socio de
            confianza para tiendas, supermercados y negocios que buscan ofrecer
            a sus clientes opciones nutritivas y naturales. Con un enfoque en el
            servicio al cliente, la rapidez en la entrega y el cumplimiento de
            los más altos estándares de calidad, nos esforzamos por satisfacer
            las necesidades de cada uno de nuestros clientes. En Natural Cycle,
            creemos que una alimentación saludable es clave para una vida plena,
            y estamos aquí para ayudarte a llevar lo mejor de la naturaleza a tu
            negocio.
          </p>
        </div>

        <div className="imagen-quienes-somos">
          <img
            src={ImgAbout}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
