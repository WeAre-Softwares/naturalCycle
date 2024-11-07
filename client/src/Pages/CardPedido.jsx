import React from 'react'

export const CardPedido = () => {
  return (
    <div className="pag-pedido-card">
        
  <div className="div-pedido-card">
  <button className="button-volver-panel-producto">  {/*ESTE BOTÓN DEBE VOLVER AL AREA DE PEDIDOS*/}
            <i class="fas fa-arrow-left"></i>
            &nbsp;&nbsp;Volver
          </button>
    <h2 className="h2-pedido-card">Detalles del Pedido</h2>
    
    <div className="div-section-pedido-card">
      <p className="p-pedido-card"><strong>ID del Pedido:</strong> 12345</p>
      <p className="p-pedido-card"><strong>Estado:</strong> En Proceso</p>
      <p className="p-pedido-card"><strong>Fecha:</strong> 06/11/2024</p>
      <p className="p-pedido-card"><strong>Está activo:</strong> True</p>
    </div>
    
    <div className="div-global-pedido-card">
      <div className="div-section-pedido-card">
      <h3 className="h3-pedido-card">Producto</h3>
      <p className="p-pedido-card"><strong>Nombre:</strong> Manzanas Orgánicas</p>
      <p className="p-pedido-card"><strong>Descripción:</strong> Manzanas frescas y orgánicas cultivadas sin pesticidas.</p>
      <p className="p-pedido-card"><strong>Cantidad:</strong> 7</p>
      <p className="p-pedido-card"><strong>Precio:</strong> $2.500</p></div>
      <div className="div-section-pedido-card">
      <h3 className="h3-pedido-card">Producto</h3>
      <p className="p-pedido-card"><strong>Nombre:</strong> Manzanas Orgánicas</p>
      <p className="p-pedido-card"><strong>Descripción:</strong> Manzanas frescas y orgánicas cultivadas sin pesticidas.</p>
      <p className="p-pedido-card"><strong>Cantidad:</strong> 7</p>
      <p className="p-pedido-card"><strong>Precio:</strong> $2.500</p></div>
      <div className="div-section-pedido-card">
      <h3 className="h3-pedido-card">Producto</h3>
      <p className="p-pedido-card"><strong>Nombre:</strong> Manzanas Orgánicas</p>
      <p className="p-pedido-card"><strong>Descripción:</strong> Manzanas frescas y orgánicas cultivadas sin pesticidas.</p>
      <p className="p-pedido-card"><strong>Cantidad:</strong> 7</p>
      <p className="p-pedido-card"><strong>Precio:</strong> $2.500</p></div>
    </div>
    
    <div className="div-section-pedido-card">
      <h3 className="h3-pedido-card">Resumen</h3>
      <p className="p-pedido-card"><strong>Cantidad:</strong> 3</p>
      <p className="p-pedido-card"><strong>Total Precio:</strong> $7.500</p>
    </div>
  </div>
</div>
  )
}

