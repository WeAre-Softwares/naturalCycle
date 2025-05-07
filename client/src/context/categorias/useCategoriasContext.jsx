import { useContext } from "react";
import { CategoriasContext } from "./categoriasContext";

const useCategoria = () => {
  const context = useContext(CategoriasContext)

  if (!context) throw new Error('useCategoria debe estar dentro del proveedor de CategoriasProvider')
  
  return context
}

export default useCategoria