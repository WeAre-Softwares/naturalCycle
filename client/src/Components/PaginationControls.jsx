import React from 'react';
import '../Styles/Promociones/Promociones.css';

export const PaginationControls = ({
  page,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <div className="pagination-info">
      <p>
        Página {page} de {totalPages}
      </p>
      <div className="botones-promocion">
        <button
          className="btn-carrusel"
          onClick={onPrevPage}
          disabled={page === 1}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button
          className="btn-carrusel"
          onClick={onNextPage}
          disabled={page === totalPages}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};
