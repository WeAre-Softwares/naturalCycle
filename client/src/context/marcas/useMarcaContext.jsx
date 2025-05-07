import { useContext } from "react";
import { MarcaContext } from "./marcaContext";

const useMarca = () => {
  const context = useContext(MarcaContext)

  if (!context) {
    throw new Error('useMarca debe estar dentro del proveedor de marcaProvider')
  }

  return context
}

export default useMarca