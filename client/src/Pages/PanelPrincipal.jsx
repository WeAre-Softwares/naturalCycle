import React, { useState, useEffect } from 'react';
import { MenuLateralPanel } from '../Components/MenuLateralPanel';
import useGetPedidosNotificaciones from '../hooks/useGetPedidosNotificacion';
import useGetUsuariosNotificaciones from '../hooks/useGetUsuariosNotificaciones';
import RevenueChart from '../Components/RevenueChart';

export const PanelPrincipal = () => {
  useGetPedidosNotificaciones();
  useGetUsuariosNotificaciones();

  return (
    <div className="div-gral-panel-principal">
        <MenuLateralPanel />

      <div className='panel-inicio-info'>
        <RevenueChart />
      </div>
    </div>
  );
};
