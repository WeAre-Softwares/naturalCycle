import React, { useState } from 'react';
import '../Styles/Promociones/Promociones.css';
import { PromocionesStatic } from '../Components/promociones-ui/PromocionesStatic';
import { CarruselProductosPromociones } from '../Components/promociones-ui/CarruselProductosPromociones';
import { PaginationControls } from '../Components/PaginationControls';
import { useGetAllProductsPromotional } from '../hooks/hooks-product/useGetAllProductsPromotional';
import { NoHayProductos } from '../Components/categorias-ui';

export const Promociones = () => {
  const [page, setPage] = useState(1);
  const { productos, error, loading, totalPages } =
    useGetAllProductsPromotional(4, page);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="container-general-promociones">
      <PromocionesStatic />

      {loading ? (
        <section class="dots-container-inicio">
          <div class="dot-inicio"></div>
          <div class="dot-inicio"></div>
          <div class="dot-inicio"></div>
          <div class="dot-inicio"></div>
          <div class="dot-inicio"></div>
        </section>
      ) : error ? (
        <div className="no-productos-promo">
          <p>
            <i className="fas fa-exclamation-circle"></i>
            {'Error al obtener productos'}
          </p>
        </div>
      ) : productos.length === 0 ? (
        <div className="no-productos-promo"> <NoHayProductos></NoHayProductos></div>
      ) : (
        <>
          <CarruselProductosPromociones productos={productos} />
          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        </>
      )}
    </div>
  );
};
