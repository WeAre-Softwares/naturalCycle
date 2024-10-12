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

function App() {
  return (
    <>
      <Router>
        <Header />
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/Inicio" />} />
            <Route path="/Inicio" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/CardInfoUsuario" element={<CardInfoUsuario />} />
            <Route path="/Register" element={<RegisterForm />} />
            <Route path="/Password" element={<OlvideContraseña />} />
            <Route path="/Categorias" element={<Categorias />} />
            <Route path="/About" element={<About />} />
            <Route path="/Promociones" element={<Promociones />} />
            <Route path="/Marcas" element={<Marcas />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
