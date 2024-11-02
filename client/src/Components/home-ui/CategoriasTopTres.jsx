import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Inicio/Inicio.css';

export const CategoriasTopTres = () => {
  const navigate = useNavigate();

  // FIXME:
  // Array de categorías
  const categorias = [
    {
      id: '66ff95d2-c8fb-477d-9cca-fae09cf66c8c',
      nombre: 'REFRIGERADOS',
      imgCategoriaName: 'refrigerados',
    },
    {
      id: '9f97b067-2a23-413c-b411-f76b31de2fdf',
      nombre: 'ALACENA',
      imgCategoriaName: 'alacena',
    },
    {
      id: 'c354bd27-f275-49bf-a103-122d4bcc63be',
      nombre: 'CONGELADOS',
      imgCategoriaName: 'congelados',
    },
  ];

  // Manejar clic en la categoría
  const handleCategoryClick = (categoriaId) => {
    navigate(`/categorias/${categoriaId}`);
  };

  return (
    <div className="conteiner-cards-inicio">
      {categorias.map((categoria) => (
        <div
          key={categoria.id}
          className={`card-inicio-top3 ${categoria.imgCategoriaName}`}
          onClick={() => handleCategoryClick(categoria.id)}
        >
          <h3>{categoria.nombre}</h3>
        </div>
      ))}
    </div>
  );
};
