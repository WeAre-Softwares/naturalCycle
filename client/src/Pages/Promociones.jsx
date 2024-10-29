import React, { useState } from 'react';
import '../Styles/Promociones/Promociones.css';
import { PromocionesStatic } from '../Components/promociones-ui/PromocionesStatic';
import { CarruselProductosPromociones } from '../Components/promociones-ui/CarruselProductosPromociones';
import { PaginationControls } from '../Components/PaginationControls';
import { useGetAllProductsPromotional } from '../hooks/hooks-product/useGetAllProductsPromotional';

export const Promociones = () => {
  const [page, setPage] = useState(1);
  const { productos, error, loading, totalPages } =
    useGetAllProductsPromotional(7, page);

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
        <p>Cargando productos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {/* TODO: Cambiar diseño precio tachado antes y actual con descuento */}
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
