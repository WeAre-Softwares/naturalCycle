import { useContext } from "react";
import { PedidoContext } from "./pedidoContext";

const usePedido = () => {
  const context = useContext(PedidoContext);

  if (!context) {
    throw new Error("usePedido debe estar dentro del proveedor de PedidoProvider");
  }

  return context;
};

export default usePedido;