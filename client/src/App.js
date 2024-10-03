import Header from './Header/Header'; 
import Footer from './Footer/Footer'; 
import Login from './Login/Login'; 
import RegisterForm from './Register/RegisterForm';
import OlvideContraseña from './Olvide Contraseña/OlvideContraseña';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import Inicio from './Inicio/Inicio';
import CardInfoUsuario from './CardUsuario/CardInfoUsuario';
import Categorias from './Categorías/Categorias';
import About from './Sobre nosotros/About';


function App() {
  return (<Router>
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
      </Routes>
    <Footer />
    </div>
  </Router>


  );
}

export default App;


