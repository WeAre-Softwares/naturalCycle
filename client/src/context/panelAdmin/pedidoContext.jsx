import React, { createContext, useState } from "react";

const PedidoContext = createContext();

const PedidoProvider = ({ children }) => {
  const [detallesOriginales, setDetallesOriginales] = useState([]);
  const [detallesEditados, setDetallesEditados] = useState([]);
  const [hayCambios, setHayCambios] = useState(false);

  const actualizarDetalle = (nuevoDetalle) => {
    setDetallesEditados((prev) => {
      const index = prev.findIndex(
        (item) => item.producto.producto_id === nuevoDetalle.producto_id
      );

      if (index !== -1) {
        const copia = [...prev];
        copia[index] = nuevoDetalle;
        return copia;
      }

      return [...prev, nuevoDetalle];
    });
  };

  const eliminarDetalle = (producto_id) => {
    setDetallesEditados(prev => prev.filter(d => d.producto.producto_id !== producto_id));
  };

  const limpiarCambios = () => setDetallesEditados([...detallesOriginales]);

  return (
    <PedidoContext.Provider
      value={{
        detallesOriginales,
        setDetallesOriginales,
        detallesEditados,
        setDetallesEditados,
        actualizarDetalle,
        limpiarCambios,
        eliminarDetalle,
        hayCambios,
        setHayCambios
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export { PedidoContext, PedidoProvider };
