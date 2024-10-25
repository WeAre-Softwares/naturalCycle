import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import {
  About,
  AreaPedidos,
  AreaUsuarios,
  CardInfoUsuario,
  Categorias,
  Checkout,
  CrearFiltrado,
  CrearProducto,
  EditarProducto,
  Footer,
  Header,
  Inicio,
  Login,
  Marcas,
  New,
  NotFound,
  OlvideContraseña,
  PanelFiltrados,
  PanelPrincipal,
  PanelProducto,
  ProductDetails,
  Promociones,
  RegisterForm,
} from './Pages';
import { MenuLateralPanel } from './Components/MenuLateralPanel';
import { BannerCarrusel } from './Components/home-ui';
import { ScrollToTop } from './Components/ScrolltoTop';
import { PrivateRoute } from './routes/PrivateRoute';
import useCartStore from './store/use-cart-store';

function App() {
  const {
    carrito,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalProducts,
    getTotalPrice,
  } = useCartStore();
  // Estado para controlar la visibilidad del carrito
  const [isCartVisible, setIsCartVisible] = useState(false);

  // Fn para alternar la visibilidad del carrito
  const toggleCart = () => {
    setIsCartVisible((prev) => !prev);
  };

  return (
    <Router>
      <ScrollToTop />
      <Header
        carrito={carrito}
        toggleCart={toggleCart}
        cantidadTotalProductos={getTotalProducts()}
      />
      <div>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Navigate to="/Inicio" />} />
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Banner" element={<BannerCarrusel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<RegisterForm />} />
          <Route path="/Password" element={<OlvideContraseña />} />
          <Route path="/Categorias" element={<Categorias />} />
          <Route path="/About" element={<About />} />
          <Route path="/Promociones" element={<Promociones />} />
          <Route path="/Marcas" element={<Marcas />} />
          <Route path="/New" element={<New />} />
          <Route path="/producto/:id" element={<ProductDetails />} />

          {/* <Route path="/checkout" element={<Checkout carrito={carrito} />} /> */}

          {/* Rutas Privadas (Solo Admin) */}
          <Route
            path="/Panel"
            element={<PrivateRoute element={MenuLateralPanel} />}
          />
          <Route
            path="/PanelPrincipal"
            element={<PrivateRoute element={PanelPrincipal} />}
          />
          <Route
            path="/panelpedidos"
            element={<PrivateRoute element={AreaPedidos} />}
          />
          <Route
            path="/panelusuarios"
            element={<PrivateRoute element={AreaUsuarios} />}
          />
          <Route
            path="/crearproducto"
            element={<PrivateRoute element={CrearProducto} />}
          />
          <Route
            path="/editarproducto/:producto_id"
            element={<PrivateRoute element={EditarProducto} />}
          />
          <Route
            path="/panelproducto"
            element={<PrivateRoute element={PanelProducto} />}
          />
          <Route
            path="/crearfiltrado"
            element={<PrivateRoute element={CrearFiltrado} />}
          />
          <Route
            path="/panelfiltrado"
            element={<PrivateRoute element={PanelFiltrados} />}
          />

          {/* Ruta para manejar 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
