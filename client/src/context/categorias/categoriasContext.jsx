import { createContext, useState } from "react";

const CategoriasContext = createContext()

const CategoriasProvider = ({ children }) => {
  const [orderBy, setOrderBy] = useState()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <CategoriasContext.Provider value={{ orderBy, setOrderBy, sidebarOpen, setSidebarOpen }}>
      { children }
    </CategoriasContext.Provider>
  )
}

export { CategoriasContext, CategoriasProvider}