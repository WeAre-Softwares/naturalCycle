import { createContext, useState } from "react";

const PanelFiltradoContext = createContext();

const PanelFiltradoProvider = ({ children }) => {
  const [tipoCreacion, setTipoCreacion] = useState('marca')

  return (
    <PanelFiltradoContext.Provider value={{ tipoCreacion, setTipoCreacion }}>
      { children }
    </PanelFiltradoContext.Provider>
  )
}

export { PanelFiltradoContext, PanelFiltradoProvider };