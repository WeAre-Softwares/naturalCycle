import React from 'react';

export const PasosCompra = () => {
  return (
    <div className="container-pasos-compra">
      <div className="container-titulo-pasos-compra">
        <h2 className="titulo-pre-banner">
          ¿Cómo comprar en nuestra distribuidora?
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
          <p>SELECCIONÁ LOS PRODUCTOS (PEDIDO MIN. $50.000ARS)</p>
        </div>
        <div className="card-banner-compra">
          <h3>
            <i className="fa-solid fa-dice-three"></i>
          </h3>
          <h3>Finalizá tu PEDIDO</h3>
          <p>INGRESÁ A TU CARRITO DE COMPRAS, REVISALO Y CONFIRMÁ TU PEDIDO</p>
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
  );
};
