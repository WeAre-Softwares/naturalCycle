import { useState } from "react";
import { Pagination } from "./panel-productos/Pagination";
import { useProductSearchAndPaginationCategories } from "../hooks/hooks-category/useProductSearchAndPaginationCategories";
import AgregarProductoItem from "./AgregarProductoItem";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const LIMIT = 10;

const AgregarProducto = ({setAgregarProducto}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const debouncedBusqueda = useDebouncedValue(searchTerm, 600);

  const { products, loading, error, handlePageChange, page, total } =
    useProductSearchAndPaginationCategories(
      debouncedBusqueda,
      categoriaSeleccionada,
      LIMIT,
    );

  const totalPaginas = Math.ceil(total / LIMIT);

  return (
    <div className="container-agregar-producto">
      <div className="container-agregar-producto-wrapper">
        <div className="agregar-producto-header">
          <h2>Agregar producto</h2>
          <button className="cerrar-agregar-producto" onClick={() => setAgregarProducto(false)}>
            <i className="fas fa-close"></i>
          </button>
        </div>
        <div className="agregar-producto-buscador">
          <input type="text" placeholder="Buscar producto por nombre" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <i className="fas fa-search"></i>
        </div>
        <div className="agregar-producto-cards-wrapper">

          {loading && (
            <section className="dots-container-inicio">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="dot-inicio"></div>
              ))}
            </section>
          )}

          {error && <p>Error: {error}</p>}

          {!loading && !error && (
            products.map((product) => (
              <AgregarProductoItem key={product.producto_id} product={product} />
            ))
          )
          }
        </div>
        {totalPaginas > 0 && (
          <Pagination
            currentPage={page + 1}
            totalPages={totalPaginas}
            onNext={() => handlePageChange(page + 1)}
            onPrev={() => handlePageChange(page - 1)}
          />
        )}
      </div>
    </div>
  )
}

export default AgregarProducto