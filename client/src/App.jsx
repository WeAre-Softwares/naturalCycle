import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Inicio } from './Pages/Inicio';
import { Login } from './Pages/Login';
import { CardInfoUsuario } from './Pages/CardInfoUsuario';
import { RegisterForm } from './Pages/RegisterForm';
import { OlvideContraseña } from './Pages/OlvideContraseña';
import { Categorias } from './Pages/Categorias';
import { About } from './Pages/About';
import { Promociones } from './Pages/Promociones';
import { Marcas } from './Pages/Marcas';
import { Header } from './Pages/Header';
import { Footer } from './Pages/Footer';
import { PanelAdmin } from './Pages/PanelAdmin';
import { ProductDetails } from './Pages/ProductDetail';
import { AreaPedidos } from './Pages/AreaPedidos';
import { AreaUsuarios } from './Pages/AreaUsuarios';
import { Permisos } from './Pages/Permisos';
import { CrearProducto } from './Pages/CrearProducto';
import { CrearFiltrado } from './Pages/CrearFiltrado';
import { New } from './Pages/New';
import { ScrollToTop } from './Components/ScrolltoTop';
import { PrivateRoute } from './routes/PrivateRoute';
import { NotFound } from './Pages/NotFound';
// import { Checkout } from './Pages/Checkout';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <div>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Navigate to="/Inicio" />} />
          <Route path="/Inicio" element={<Inicio />} />
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
            element={<PrivateRoute element={PanelAdmin} />}
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
            path="/panelpermisos"
            element={<PrivateRoute element={Permisos} />}
          />
          <Route
            path="/panelproducto"
            element={<PrivateRoute element={CrearProducto} />}
          />
          <Route
            path="/panelfiltrado"
            element={<PrivateRoute element={CrearFiltrado} />}
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
