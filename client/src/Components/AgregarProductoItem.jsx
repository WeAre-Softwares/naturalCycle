import { useState } from "react";
import { toast } from 'react-toastify';
import usePedido from "../context/panelAdmin/usePedidoContext";

const AgregarProductoItem = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { setDetallesEditados, detallesEditados } = usePedido();

  const incrementarCantidad = () => {
    setQuantity((prev) => prev + 1);
  };
  const decrementarCantidad = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };
  const handleQuantityChange = (e) => {
    const newQuantity = +e.target.value;

    if (isNaN(newQuantity)) return setQuantity(1);

    setQuantity(newQuantity);
  };
  const handleAñadirProductoAlPedido = async ({ nombre, precio, producto_id }) => {
    try {
      const productoExistente  = detallesEditados.find((d) => d.producto.producto_id === producto_id)

      if (productoExistente ) {
        const nuevosDetalles = detallesEditados.map(detalle => {
          if (detalle.producto.producto_id === producto_id) {
            const nuevaCantidad = detalle.cantidad + quantity;
            let nuevoTotal = detalle.precio_unitario * nuevaCantidad;

            if (productoExistente.descuento) {
              nuevoTotal = nuevoTotal * (1 - productoExistente.descuento / 100);
            }

            return {
              ...detalle,
              cantidad: nuevaCantidad,
              total_precio: nuevoTotal
            };
          }
          return detalle;
        });

        setDetallesEditados(nuevosDetalles);
        toast.success('Producto actualizado con éxito');
        return;
      }

      const formatedResponse = {
        producto: {
          producto_id,
          nombre,
          precio
        },
        cantidad: quantity,
        precio_unitario: precio,
        total_precio: precio * quantity
      }

      setDetallesEditados(prev => [...prev, formatedResponse]);

      toast.success('Producto agregado con éxito');
    } catch (error) {
      console.log(error);
    } finally {
      setQuantity(1);
    }
  }

  return (
      <div className="agregar-producto-card" key={product.producto_id}>
      <img
        src={product.imagenes[0].url || '/imagenes/producto-test.png'}
        alt={product.nombre}
        className="producto-imagen"
      />
      <div className="producto-informacion">
        <div className="producto-detalles">
          <h3>{product.nombre}</h3>
          <p> <b>Precio por unidad:</b>  {product.precio}</p>
          <p> <b>Marca:</b>  {product.marca.nombre}</p>
          <p> <b>Categoría:</b> {product.categorias.map((c) => c.nombre).join(', ')}</p>
        </div>
        <div className="producto-botones">
          <div className="control-cantidad">
              <button onClick={decrementarCantidad} disabled={quantity === 1}>
                -
              </button>
              <input
                className="producto-botones-input-cantidad"
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
              />
              <button
                  onClick={incrementarCantidad}
                  disabled={!product.disponible}

              >
                +
              </button>
            </div>
            <button
            className="crear-filtrado-button"
            onClick={() => handleAñadirProductoAlPedido(product)}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}

export default AgregarProductoItem