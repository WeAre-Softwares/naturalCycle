import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Checkout/Checkout.css';

//!Componente cancelado
export const Checkout = () => {
  const [carrito, setCarrito] = useState([]);
  const [billingInfo, setBillingInfo] = useState({
    nombre: '',
    apellido: '',
    email: '',
    dni: '',
    telefono: '',
    ciudad: '',
    provincia: '',
    direccion: '',
    codigoPostal: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera el carrito de localStorage cuando el componente se monta
    const carritoLocal = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoLocal);
  }, []);

  const calcularSubtotal = () => {
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const realizarCompra = () => {
    const isBillingComplete = Object.values(billingInfo).every(
      (value) => value.trim() !== '',
    );

    if (isBillingComplete) {
      // Realiza la lógica de compra aquí (enviar datos al backend, etc.)
      alert('Pedido realizado. Nos contactaremos para realizar el pago.');
      localStorage.removeItem('carrito'); // Limpia el carrito después de la compra
      navigate('/'); // Redireccionar a la página principal
    } else {
      alert('Por favor, completa todos los datos de facturación.');
    }
  };

  return (
    <div className="checkout-container-general">
      <div className="div-h2-checkout-compra">
        <h2>Resumen de compra</h2>
      </div>

      {/* Formulario de facturación */}
      <div className="div-h3-form-facturacion">
        <h3>Datos de Facturación</h3>
      </div>

      <div className="div-form-productos">
        <div className="form-facturacion">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={billingInfo.nombre}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={billingInfo.apellido}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={billingInfo.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="dni"
            placeholder="DNI"
            value={billingInfo.dni}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="telefono"
            placeholder="Número de Teléfono"
            value={billingInfo.telefono}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            value={billingInfo.ciudad}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="provincia"
            placeholder="Provincia"
            value={billingInfo.provincia}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={billingInfo.direccion}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="codigoPostal"
            placeholder="Código Postal"
            value={billingInfo.codigoPostal}
            onChange={handleInputChange}
          />
        </div>

        {carrito.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <div className="container-prod-checkout">
            {carrito.map((item) => (
              <div key={item.id} className="checkout-item">
                <p>{item.nombre}</p>
                <p>Cantidad: {item.cantidad}</p>
                <p>Total: ${item.precio * item.cantidad}</p>
              </div>
            ))}
            <h3>Precio total del pedido: ${calcularSubtotal()}</h3>
            <div className="div-button-container-prod-checkout">
              {' '}
              <button className="btn-finalizar-compra" onClick={realizarCompra}>
                Confirmar Pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
