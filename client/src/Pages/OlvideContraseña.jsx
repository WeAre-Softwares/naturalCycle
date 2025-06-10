import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PasswordResetSchema } from '../schemas';
import '../Styles/Olvide Contraseña/OlvideContraseña.css';
import { requestResetPasswordService } from '../services/requestResetPasswordService';

export const OlvideContraseña = () => {
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PasswordResetSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true); // Deshabilitar botón al enviar
    try {
      await requestResetPasswordService(data.email);

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
      }, 5000);
    } catch (error) {
      // Verifica si el mensaje de error contiene el texto específico
      const errorMsg = error.message || 'Error inesperado. Intenta nuevamente.';

      if (errorMsg.includes('Ya has solicitado restablecer tu contraseña')) {
        toast.warning(
          'Ya has solicitado restablecer tu contraseña. Inténtalo más tarde.',
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
      } else {
        // Mostrar mensaje genérico en caso de otro error
        toast.success(errorMsg, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
      setTimeout(() => {
        navigate('/inicio');
      }, 5000);
      // Almacenar el mensaje de error en el estado para posibles mensajes en pantalla
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false); // Habilitar el botón nuevamente
    }
  };
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
            )}
          </div>
          <button
            disabled={isSubmitting}
            className="olvide-contraseña-form-submit-btn"
            type="submit"
          >
            Enviar
          </button>
        </form>

        <p className="olvide-contraseña-signup-link">
          ¿Aún no tienes una cuenta?
        </p>
        <Link
          to="/register"
          className="olvide-contraseña-signup-link olvide-contraseña-link"
        >
          Registrarme
        </Link>
      </div>
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};
