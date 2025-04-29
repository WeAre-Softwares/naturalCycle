import { useParams } from "react-router-dom"
import { useGetDetallePedidoById } from "../hooks/hooks-detalles-pedidos/useGetDetallePedidoById";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toast } from 'react-toastify';
import usePedido from "../context/panelAdmin/usePedidoContext";
import editarPedido from "../services/pedidos-service/editarPedido";
import AgregarProducto from "../Components/AgregarProducto";

const header = ["Producto", "Cantidad", "Precio Unitario", "Aplicar Descuento", "Total", "Acciones"]

export const EditarPedido = () => {
  const { pedido_id } = useParams()
  const navigate = useNavigate()
  const [pedidoLoading, setPedidoLoading] = useState(false)
  const [agregarProducto, setAgregarProducto] = useState(false)
  const { detallePedido, loading, error } = useGetDetallePedidoById(pedido_id);
  const { setDetallesOriginales, detallesOriginales, setDetallesEditados, detallesEditados, actualizarDetalle, eliminarDetalle, limpiarCambios } = usePedido();

  useEffect(() => {
    if (detallePedido) {
      setDetallesOriginales(detallePedido)
      setDetallesEditados(detallePedido)
    }
  }, [detallePedido])

  const totalPedido = useMemo(() => {
    return detallesEditados.reduce((acc, item) => {
      return acc + Number(item.total_precio || 0);
    }, 0);
  }, [detallesEditados]);

  const hayCambios = useMemo(() => {
    if (!detallesOriginales || !detallesEditados) return false;

    if (detallesOriginales.length !== detallesEditados.length) return true;

    return detallesOriginales.some((original) => {
      const editado = detallesEditados.find(
        (d) => d.detalles_pedidos_id === original.detalles_pedidos_id
      );

      if (!editado) return true;

      const cantidadCambiada = Number(editado.cantidad) !== Number(original.cantidad);
      const precioCambiado = Number(editado.precio_unitario) !== Number(original.precio_unitario);
      const descuentoCambiado = Number(editado.descuento || 0) !== Number(original.descuento || 0);

      return cantidadCambiada || precioCambiado || descuentoCambiado;
    });
  }, [detallesOriginales, detallesEditados]);

  const handleChange = (id, name, value, original) => {
    const cantidad = name === "cantidad" ? Number(value) : Number(original.cantidad);
    const precio_unitario = name === "precio_unitario" ? Number(value) : Number(original.precio_unitario);
    const descuento = name === "descuento" ? Number(value) : Number(original.descuento || 0);

    if (isNaN(cantidad) || isNaN(precio_unitario) || isNaN(descuento)) return;

    if (cantidad >= 1000) return toast.error('La cantidad no puede ser mayor a 1000');

    if (descuento > 100) return toast.error('El descuento no puede ser mayor a 100');

    let total_precio = cantidad * precio_unitario;

    if (descuento) {
      total_precio = total_precio * (1 - descuento / 100);
    }

    const actualizado = {
      ...original,
      producto_id: id,
      cantidad,
      precio_unitario,
      descuento: descuento || 0,
      total_precio,
    };

    actualizarDetalle(actualizado);
  };

  const handleGuardarCambios = async (e) => {
    if (pedidoLoading) return;

    e.preventDefault();

    const detallesFormateados = detallesEditados.map(detalle => ({
      cantidad: detalle.cantidad,
      precio_unitario: Number(detalle.precio_unitario),
      producto_id: detalle.producto.producto_id,
      descuento: Number(detalle.descuento || 0)
    }));

    const formData = {
      estado_pedido: 'esperando_aprobacion',
      detalles: detallesFormateados,
    };

    try {
      setPedidoLoading(true)
      await editarPedido(pedido_id, formData);
      toast.success('Pedido actualizado con éxito');
      navigate(-1)
    } catch (error) {
      console.log(error);
      toast.error('Error al actualizar el pedido');
    } finally {
      setPedidoLoading(false)
      limpiarCambios()
    }
  }

  const handleEliminarProducto = async (producto_id) => {
    if (!producto_id) return toast.error('Error al eliminar el producto');

    eliminarDetalle(producto_id);
  }

  return (
    <>
      <div className="div-gral-panel-principal">
        <div className="wrapper-editar-pedido">
          <div className="wrapper-editar-pedido-container">
            <div className="wrapper-editar-pedido-header">
              <div className="header-editar-pedido">
                <button className="boton-regresar btn" onClick={() => {
                  if (hayCambios) return toast.error('Debe guardar los cambios antes de regresar');
                  navigate(-1)
                }}>Regresar</button>
                <button className="boton-agregar btn" onClick={() =>setAgregarProducto(true)}>
                    Agregar Producto
                </button>
              </div>

              <div className="header-editar-pedido">
                <h3>Editar Pedido</h3>
              </div>
            </div>

            <div className="container-editar-pedido">
              <div className="container-editar-pedido-header">
                {
                  header.map((item, index) =>
                    <div key={index} className={`container-editar-pedido-default ${index === 0 && 'container-editar-pedido-producto'}`}>
                      <h4>{item}</h4>
                    </div>
                  )
                }
              </div>

              {loading && (
                  <section className="dots-container-inicio">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="dot-inicio"></div>
                    ))}
                  </section>
              ) }

              { error && <p>Error al cargar los detalles del pedido.</p> }

              {!loading && !error && detallesEditados.map((detalleEditado) => {

                 return (
                   <div className="container-editar-pedido-wrapper" key={detalleEditado.detalles_pedidos_id}>
                     <div className="container-editar-pedido-producto container-editar-pedido-default">
                       <span>{detalleEditado.producto?.nombre || "N/A"}</span>
                     </div>

                     <div className="container-editar-pedido-default">
                       <input
                         type="text"
                         name="cantidad"
                         onWheel={(e) => e.target.blur()}
                         value={detalleEditado.cantidad}
                         onChange={(e) => handleChange(detalleEditado.producto.producto_id, "cantidad", e.target.value, detalleEditado)}
                       />
                     </div>

                     <div className="container-editar-pedido-default">
                       <input
                         type="text"
                         name="precio_unitario"
                         onWheel={(e) => e.target.blur()}
                         value={detalleEditado.precio_unitario}
                         onChange={(e) => handleChange(detalleEditado.producto.producto_id, "precio_unitario", e.target.value, detalleEditado)}
                       />
                     </div>

                     <div className="container-editar-pedido-default">
                       <input
                         type="text"
                         name="descuento"
                         onWheel={(e) => e.target.blur()}
                         value={+(detalleEditado.descuento || 0)}
                         onChange={(e) => handleChange(detalleEditado.producto.producto_id, "descuento", e.target.value, detalleEditado)}
                       />
                       <span>%</span>
                     </div>

                     <div className="container-editar-pedido-default">
                       <span>$ {(Number(detalleEditado.total_precio) || 0).toFixed(2)}</span>
                     </div>

                     <button className="container-editar-pedido-acciones" onClick={() => handleEliminarProducto(detalleEditado.producto.producto_id)}>
                        <i className="fa-solid fa-trash"></i>
                     </button>
                   </div>
                 );
              })}
            </div>

            <div className="header-editar-pedido-footer-wrapper">
              {
                totalPedido > 0 && <span><b>Monto Total: </b> ${totalPedido.toFixed(2)}</span>
              }
            </div>

            <div className="header-editar-pedido-footer">
                <button className="boton-cancelar btn" onClick={limpiarCambios}>
                  Deshacer Cambios
                </button>
                <button disabled={!hayCambios || pedidoLoading} className={`boton-aceptar btn ${!hayCambios && 'boton-aceptar-disabled'}`} onClick={handleGuardarCambios}>{ pedidoLoading ? (
                    <section className="dots-container-inicio">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="dot-inicio"></div>
                      ))}
                    </section>
                  ) : 'Guardar Cambios'}
                </button>
            </div>
          </div>
        </div>
      </div>
      { agregarProducto && <AgregarProducto setAgregarProducto={setAgregarProducto} />}
    </>
  )
}