import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Olvide Contraseña/OlvideContraseña.css';

export const OlvideContraseña = () => {
  return (
    <div className="olvide-contraseña-container">
      <h3>
        Rellená el siguiente formulario y te llegará un mail para reestablecer
        tu contraseña.
      </h3>
      <div className="olvide-contraseña-form-container">
        <div className="olvide-contraseña-logo-container">
          Olvidé mi contraseña
        </div>

        <form className="olvide-contraseña-form-pass">
          <div className="olvide-contraseña-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingresa tu Email"
              required
            />
          </div>

          <button className="olvide-contraseña-form-submit-btn" type="submit">
            Enviar
          </button>
        </form>

        <p className="olvide-contraseña-signup-link">
          ¿Aún no tienes una cuenta?
          <Link
            to="/register"
            className="olvide-contraseña-signup-link olvide-contraseña-link"
          >
            {' '}
            Registrarme
          </Link>
        </p>
      </div>
    </div>
  );
};
