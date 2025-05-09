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
  CardPedido,
  CrearProducto,
  EditarProducto,
  Marcas,
  Footer,
  Header,
  Inicio,
  Login,
  NotFound,
  NuevosIngresos,
  OlvideContraseña,
  PanelFiltrados,
  PanelPrincipal,
  PanelProducto,
  ProductDetails,
  ProductosPorBultoCerrado,
  Promociones,
  RegisterForm,
  RestablecerPassword,
  Categorias,
  EditarPedido,
} from './Pages';
import { ScrollToTop } from './Components/ScrolltoTop';
import { PrivateRoute } from './routes/PrivateRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import useCartStore from './store/use-cart-store';
import {
  FormularioActualizarCategoria,
  FormularioActualizarEtiqueta,
  FormularioActualizarMarca,
  FormularioCrearCategoria,
  FormularioCrearEtiqueta,
  FormularioCrearMarca,
} from './Components/panel-crear-filtros';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [isCartVisible, setIsCartVisible] = useState(false);

  const toggleCart = () => {
    setIsCartVisible((prev) => !prev);
  };

  return (
    <>
          <Router>
          <ScrollToTop />
          <Header
            carrito={carrito}
            toggleCart={toggleCart}
            cantidadTotalProductos={getTotalProducts()}
          />
          <div>
            <Routes>
              <Route path="/" element={<Navigate to="/inicio" />} />
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/login" element={<ProtectedRoute element={Login} />} />
              <Route
                path="/register"
                element={<ProtectedRoute element={RegisterForm} />}
              />
              <Route
                path="/olvide-password"
                element={<ProtectedRoute element={OlvideContraseña} />}
              />
              <Route
                path="/restablecer-password"
                element={<ProtectedRoute element={RestablecerPassword} />}
              />
              {/* End  ProtectedRoute */}
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/categorias/:categoriaNombre" element={<Categorias />} />
              <Route path="/about" element={<About />} />
              <Route path="/promociones" element={<Promociones />} />
              <Route path="/marcas" element={<Marcas />} />
              <Route path="/marcas/:marcaNombre" element={<Marcas />} />
              <Route path="/nuevos-ingresos" element={<NuevosIngresos />} />
              <Route
                path="/productos-por-bulto-cerrado"
                element={<ProductosPorBultoCerrado />}
              />
              <Route path="/producto/:id" element={<ProductDetails />} />
              <Route path="/usuario-info" element={<CardInfoUsuario />} />
              {/* Rutas Privadas (Solo Admin) */}
              <Route
                path="/panel-principal"
                element={<PrivateRoute element={PanelPrincipal} />}
              />
              <Route
                path="/panel-pedidos"
                element={<PrivateRoute element={AreaPedidos} />}
              />
              <Route
                path="/pedido/:pedido_id"
                element={<PrivateRoute element={CardPedido} />}
              />
              <Route
                path="/pedido/editar/:pedido_id"
                element={<PrivateRoute element={EditarPedido} />}
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
              <Route path="/" element={<PrivateRoute element={PanelFiltrados} />} />
              <Route
                path="/crear-marca"
                element={<PrivateRoute element={FormularioCrearMarca} />}
              />
              <Route
                path="/crear-categoria"
                element={<PrivateRoute element={FormularioCrearCategoria} />}
              />
              <Route
                path="/crear-etiqueta"
                element={<PrivateRoute element={FormularioCrearEtiqueta} />}
              />
              <Route
                path="/actualizar-marca/:marca_id"
                element={<PrivateRoute element={FormularioActualizarMarca} />}
              />
              <Route
                path="/actualizar-etiqueta/:etiqueta_id"
                element={<PrivateRoute element={FormularioActualizarEtiqueta} />}
              />
              <Route
                path="/actualizar-categoria/:categoria_id"
                element={<PrivateRoute element={FormularioActualizarCategoria} />}
              />
              {/* Ruta para manejar 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </Router>
        <ToastContainer />
    </>
  );
}

export default App;
