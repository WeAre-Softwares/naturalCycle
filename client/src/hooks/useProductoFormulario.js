import { useEffect, useState } from 'react';
import { getAllCategoriasService } from '../services/categoria-services/getAll-categorias';
import { getAllEtiquetasService } from '../services/etiquetas-service/getAll-etiquetas';
import { getAllMarcasService } from '../services/marca-services/getAll-marcas';
import useAuthStore from '../store/use-auth-store';

export function useProductoFormulario() {
  const [marcas, setMarcas] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriasData, etiquetasData, marcasData] = await Promise.all([
          getAllCategoriasService(token),
          getAllEtiquetasService(token),
          getAllMarcasService(token),
        ]);

        // Extrae los arrays de etiquetas, marcas y categorías del objeto devuelto
        setCategorias(categoriasData.categorias);
        setEtiquetas(etiquetasData.etiquetas);
        setMarcas(marcasData.marcas);
      } catch (error) {
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { categorias, etiquetas, marcas, loading, error };
}
