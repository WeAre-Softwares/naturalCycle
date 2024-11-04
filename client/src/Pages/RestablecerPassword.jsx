import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/Olvide Contraseña/OlvideContraseña.css';
import { resetPasswordSchema } from '../schemas/reset-password-schema';
import { resetPasswordService } from '../services/resetPasswordService';

export const RestablecerPassword = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Obtener el token de la URL
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await resetPasswordService(token, data.newPassword);
      setErrorMessage('');

      toast.success('Contraseña restablecida con éxito', {
        position: 'top-center',
        autoClose: 5000,
      });

      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      const errorMsg = error.message || 'Error inesperado. Intenta nuevamente.';
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="olvide-contraseña-container">
      <ToastContainer />
      <h3>Crear nueva contraseña</h3>
      <div className="olvide-contraseña-form-container">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="olvide-contraseña-form-pass"
        >
          <div className="olvide-contraseña-form-group">
            <label htmlFor="newPassword">Nueva Contraseña</label>
            <input
              {...register('newPassword')}
              type="password"
              placeholder="Ingresa tu nueva contraseña"
            />
            {errors.newPassword && (
              <p style={{ color: 'red' }}>{errors.newPassword.message}</p>
            )}
          </div>
          <button type="submit" className="olvide-contraseña-form-submit-btn">
            Restablecer
          </button>
        </form>
      </div>
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};
