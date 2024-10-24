import React from 'react';

export const BannerInfoInicio = () => {
  return (
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
        <p>Los mejores precios los encontrás acá</p>
      </div>
    </div>
  );
};
