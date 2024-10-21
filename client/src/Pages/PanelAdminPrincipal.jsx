import React, { useState, useEffect } from 'react';
import { MenuLateralPanel } from '../Components/MenuLateralPanel';

export const PanelPrincipal = () => {
  

  return (
    <div className="div-gral-panel-principal">
        <MenuLateralPanel />

      <div className='panel-inicio-info'>
        <h1>Panel de administracion</h1>
        <p> Desde este panel puedes acceder a la administración de las ventas, de clientes, entre otros servicios.</p>
        <p>Para acceder a cada funcionalidad apriete en el nombre de cada sección.</p>
      </div>
    </div>
  );
};
