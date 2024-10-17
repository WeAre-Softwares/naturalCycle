import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import '../Styles/Login/Login.css';
import { UserInfo } from '../Components/UserInfo';
import { LoginHeader } from '../Components/LoginHeader';
import { InputField } from '../Components/InputField';
import { RememberMe } from '../Components/RememberMe';
import { Loginschema } from '../schemas/login-schema';
import { loginService } from '../services/loginService';
import useAuthStore from '../store/use-auth-store';

export const Login = () => {
  const [isOpen, setIsOpen] = useState(false); // Mover el estado aquí
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
  const login = useAuthStore((state) => state.login); // Acción de Zustand para loguear
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Loginschema),
  });

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      const response = await loginService(email, password);

      if (response?.token) {
        const { token } = response;
        login(token); // Guardar el token en el estado global

        // Redirigir al inicio tras el login exitoso
        navigate('/Inicio');
      }
    } catch (error) {
      setErrorMessage(
        'Credenciales incorrectas. Por favor, intente nuevamente.',
      );
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Cambiar el estado
  };

  return (
    <div className="conteiner-general-login">
      <UserInfo />
      <LoginHeader />
      <div className="conteiner-login">
        <form onSubmit={handleSubmit(onSubmit)} className="form-login">
          <InputField
            label="Email"
            type="text"
            placeholder=" Ingresa tu Email"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
              >
                <g data-name="Layer 3" id="Layer_3">
                  <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
                </g>
              </svg>
            }
            register={register('email')}
            error={errors.email}
          />
          <InputField
            label="Contraseña"
            type="password"
            placeholder=" Ingresa tu contraseña"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="-64 0 512 512"
              >
                <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
                <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
              </svg>
            }
            register={register('password')}
            error={errors.password}
          />
          {errorMessage && (
            <div style={{ color: 'red' }} className="error-message">
              {errorMessage}
            </div>
          )}{' '}
          {/* Mostrar el error si existe */}
          <RememberMe />
          <button type="submit" className="button-submit-login">
            Iniciar sesión
          </button>
          <p className="p-login">
            No tienes una cuenta?{' '}
            <span className="span-login">
              <Link to="/Register" onClick={toggleMenu}>
                {' '}
                Registrarme
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};
