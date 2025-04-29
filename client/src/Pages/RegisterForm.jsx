import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateUsuarioSchema } from '../schemas';
import { InputField } from '../Components/InputField2';
import { FormButton } from '../Components/FormButton';
import { RegisterLink } from '../Components/RegisterLink';
import { RegisterFormContainer } from '../Components/RegisterFormContainer';
import '../Styles/Register/Register.css';
import { registerService } from '../services/registerService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateUsuarioSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true); // Deshabilitar botón al enviar
    try {
      const response = await registerService(
        data.nombre,
        data.apellido,
        data.dni,
        data.nombre_comercio,
        data.telefono,
        data.dom_fiscal,
        data.email,
        data.password,
      );

      // Verifica que la respuesta tenga un indicativo de éxito
      if (response && response.token) {
        // Limpia el mensaje de error
        setErrorMessage('');

        toast.success(
          '¡Bienvenido a NaturalCycle! Recibirás una confirmación cuando tu cuenta sea activada.',
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
      } else {
        throw new Error('Error al registrarse. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      setErrorMessage(
        'Hubo un error en al registrarse. Intente nuevamente más tarde.',
      );
    } finally {
      setIsSubmitting(false); // Habilitar el botón nuevamente
    }
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  return (
    <RegisterFormContainer>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)} className="form-register">
        <h2>Solicitud de registro</h2>
        <InputField
          label="Nombre del Comercio"
          placeholder="Ingresa el nombre del comercio"
          type="text"
          className="input-register"
          register={register('nombre_comercio')}
          error={errors.nombre_comercio}
          required
        />
        <InputField
          label="Nombre del Representante"
          placeholder="Ingresa tu nombre"
          type="text"
          className="input-register"
          register={register('nombre')}
          error={errors.nombre}
          required
        />
        <InputField
          label="Apellido del Representante"
          placeholder="Ingresa tu apellido"
          type="text"
          className="input-register"
          register={register('apellido')}
          error={errors.apellido}
          required
        />
        <InputField
          label="CUIT/CUIL"
          placeholder="Ingresa tu CUIT/CUIL"
          type="number"
          className="input-register"
          register={register('dni')}
          error={errors.dni}
          required
        />
        <InputField
          label="Número de Teléfono"
          placeholder="Ingresa tu número de teléfono"
          type="tel"
          className="input-register"
          register={register('telefono')}
          error={errors.telefono}
          required
        />
        <InputField
          label="Domicilio Fiscal"
          placeholder="Calle junto a su numeración"
          type="text"
          className="input-register"
          register={register('dom_fiscal')}
          error={errors.dom_fiscal}
          required
        />
        <InputField
          label="Correo Electrónico"
          placeholder="Ingresa tu correo electrónico"
          type="email"
          className="input-register"
          register={register('email')}
          error={errors.email}
          required
        />
        <InputField
          label="Contraseña"
          placeholder="Ingresa su contraseña"
          type="password"
          className="input-register"
          register={register('password')}
          error={errors.password}
          required
        />
        <FormButton disabled={isSubmitting} buttonText="Enviar solicitud" />
        <RegisterLink />
      </form>
      {/* Mostrar el error si existe */}
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}{' '}
    </RegisterFormContainer>
  );
};
