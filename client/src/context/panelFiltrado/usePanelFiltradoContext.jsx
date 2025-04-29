import { useContext } from "react";
import { PanelFiltradoContext } from "./panelFiltradoContext";

const usePanelFiltrado = () => {
  const context = useContext(PanelFiltradoContext)

  if (!context) throw new Error('usePanelFiltrado debe ser usado dentro de un PanelFiltradoProvider')

  return context
}

export default usePanelFiltrado