import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PasswordResetSchema } from '../schemas';
import '../Styles/Olvide Contraseña/OlvideContraseña.css';
import { requestResetPasswordService } from '../services/requestResetPasswordService';

export const OlvideContraseña = () => {
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PasswordResetSchema),
  });

  const onSubmit = async (data) => {
    try {
      await requestResetPasswordService(data.email);

      // Verifica que la respuesta tenga un indicativo de éxito
      // Limpia el mensaje de error
      setErrorMessage('');
      toast.success(
        'Si este correo está registrado, recibirás un enlace de recuperación.',
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        },
      );

      setTimeout(() => {
        navigate('/inicio');
      }, 7000);
    } catch (error) {
      const errorMsg = error.message || 'Error inesperado. Intenta nuevamente.';
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="olvide-contraseña-container">
      <ToastContainer />
      <h3>
        Rellená el siguiente formulario y te llegará un mail para reestablecer
        tu contraseña.
      </h3>
      <div className="olvide-contraseña-form-container">
        <div className="olvide-contraseña-logo-container">
          Olvidé mi contraseña
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="olvide-contraseña-form-pass"
        >
          <div className="olvide-contraseña-form-group">
            <label htmlFor="email">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="Ingresa tu Email"
            />
            {errors.email && (
              <p style={{ color: 'red' }}>{errors.email.message}</p>
            )}{' '}
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
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}{' '}
    </div>
  );
};
