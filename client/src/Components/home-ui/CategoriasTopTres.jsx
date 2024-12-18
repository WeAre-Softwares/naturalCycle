import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Inicio/Inicio.css';
import { useGetAllCategories } from '../../hooks/hooks-category/useGetAllCategories';

export const CategoriasTopTres = () => {
  const navigate = useNavigate();
  const { categorias, loading, error } = useGetAllCategories();
  const [categoriasCliente, setCategoriasCliente] = useState([]);

  // Nombres específicos de categorías elegidos por el cliente
  const nombresCategoriasCliente = ['refrigerados', 'alacena', 'congelados'];

  useEffect(() => {
    if (categorias && categorias.length > 0) {
      const categoriasFiltradas = categorias.filter(
        (categoria) =>
          categoria &&
          categoria.nombre &&
          nombresCategoriasCliente.includes(categoria.nombre.toLowerCase()),
      );

      setCategoriasCliente(categoriasFiltradas);
    }
  }, [categorias]);

  const handleCategoryClick = (categoria) => {
    if (categoria && categoria.categoria_id) {
      const categoriaUrl = categoria.nombre.toLowerCase().replace(/\s+/g, '-');
      navigate(`/categorias/${categoriaUrl}`);
    }
  };

  if (loading) {
    return <p>Cargando categorías...</p>;
  }

  if (error) {
    return <div className="no-productos">
    <i className="fas fa-exclamation-circle"></i>
    <p>Hubo un error al cargar las categorías.</p>
  </div>;
  }

  return (
    <div className="conteiner-cards-inicio">
      {categoriasCliente.map((categoria) => (
        <div
          key={categoria.categoria_id}
          className={`card-inicio-top3 ${categoria.nombre.toLowerCase()}`} // FIXME: Cambiar imgs de acuerdo a lo que quiera el cliente
          onClick={() => handleCategoryClick(categoria)}
        >
          <h3>{categoria.nombre}</h3>
        </div>
      ))}
    </div>
  );
};
