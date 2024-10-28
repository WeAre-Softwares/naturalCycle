import React from 'react';

export const Pagination = ({ currentPage, totalPages, onNext, onPrev }) => {
  return (
    <div className="pagination-info">
      <p>
        Página {currentPage} de {totalPages}
      </p>
      <div className="botones-promocion">
        <button
          className="btn-carrusel"
          onClick={onPrev}
          disabled={currentPage === 1}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button
          className="btn-carrusel"
          onClick={onNext}
          disabled={currentPage === totalPages}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};
