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
  CrearProducto,
  EditarProducto,
  Footer,
  Header,
  Inicio,
  Login,
  Marcas,
  NotFound,
  NuevoIngreso,
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
import {
  FormularioActualizarCategoria,
  FormularioActualizarEtiqueta,
  FormularioActualizarMarca,
  FormularioCrearCategoria,
  FormularioCrearEtiqueta,
  FormularioCrearMarca,
} from './Components/panel-crear-filtros';

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
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/banner" element={<BannerCarrusel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/password" element={<OlvideContraseña />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/:categoriaNombre" element={<Categorias />} />
          <Route path="/about" element={<About />} />
          <Route path="/promociones" element={<Promociones />} />
          <Route path="/marcas" element={<Marcas />} />
          <Route path="/marcas/:marcaNombre" element={<Marcas />} />
          <Route path="/nuevos-ingresos" element={<NuevoIngreso />} />
          <Route path="/producto/:id" element={<ProductDetails />} />
          {/* 
          <Route path="/checkout" element={<Checkout />} /> */}

          {/* Rutas Privadas (Solo Admin) */}
          <Route
            path="/panel"
            element={<PrivateRoute element={MenuLateralPanel} />}
          />
          <Route
            path="/panel-principal"
            element={<PrivateRoute element={PanelPrincipal} />}
          />
          <Route
            path="/panel-pedidos"
            element={<PrivateRoute element={AreaPedidos} />}
          />
          <Route
            path="/panel-usuarios"
            element={<PrivateRoute element={AreaUsuarios} />}
          />
          <Route
            path="/crear-producto"
            element={<PrivateRoute element={CrearProducto} />}
          />
          <Route
            path="/editar-producto/:producto_id"
            element={<PrivateRoute element={EditarProducto} />}
          />
          <Route
            path="/panel-producto"
            element={<PrivateRoute element={PanelProducto} />}
          />
          <Route
            path="/panel-filtrado"
            element={<PrivateRoute element={PanelFiltrados} />}
          />
          <Route path="/" element={<PanelFiltrados />} />
          <Route path="/crear-marca" element={<FormularioCrearMarca />} />
          <Route
            path="/crear-categoria"
            element={<FormularioCrearCategoria />}
          />
          <Route path="/crear-etiqueta" element={<FormularioCrearEtiqueta />} />
          <Route
            path="/crear-categoria"
            element={<FormularioCrearCategoria />}
          />

          <Route
            path="/actualizar-marca/:marca_id"
            element={<FormularioActualizarMarca />}
          />

          <Route
            path="/actualizar-etiqueta/:etiqueta_id"
            element={<FormularioActualizarEtiqueta />}
          />

          <Route
            path="/actualizar-categoria/:categoria_id"
            element={<FormularioActualizarCategoria />}
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
