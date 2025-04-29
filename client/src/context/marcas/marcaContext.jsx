import { createContext, useState } from "react";

const MarcaContext = createContext()

const MarcaProvider = ({children}) => {
  const [orderBy, setOrderBy] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <MarcaContext.Provider value={{orderBy, setOrderBy, sidebarOpen, setSidebarOpen}} >
      {children}
    </MarcaContext.Provider>
  )
}

export { MarcaContext, MarcaProvider}