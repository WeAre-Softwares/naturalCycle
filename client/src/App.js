import Header from './Header/Header'; // Verifica que el nombre y la ruta sean correctos.
import Footer from './Footer/Footer'; // Verifica que el nombre y la ruta sean correctos.
import Login from './Login/Login'; 
import RegisterForm from './Register/RegisterForm';
import OlvideContraseña from './Olvide Contraseña/OlvideContraseña';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import Inicio from './Inicio/Inicio';
import CardInfoUsuario from './CardUsuario/CardInfoUsuario';



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
      </Routes>
    <Footer />
    </div>
  </Router>


  );
}

export default App;


