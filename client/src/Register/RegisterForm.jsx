import React from 'react';
import InputField from './InputField';
import FormButton from './FormButton';
import RegisterLink from './RegisterLink';
import RegisterFormContainer from './RegisterFormContainer';
import './Register.css';

const RegisterForm = () => {
  
  return (
    <RegisterFormContainer>
      <form className="form-register">
        <h2>Solicitud de registro</h2>
        
        <InputField
          label="Nombre del Comercio"
          placeholder="Ingresa el nombre del comercio"
          type="text"
          className="input-register"
          required
        />

        <InputField
          label="Nombre y Apellido del Representante"
          placeholder="Ingresa tu nombre y apellido"
          type="text"
          className="input-register"
          required
        />

        <InputField
          label="Número de Teléfono"
          placeholder="Ingresa tu número de teléfono"
          type="tel"
          className="input-register"
          required
        />

        <InputField
          label="Correo Electrónico"
          placeholder="Ingresa tu correo electrónico"
          type="email"
          className="input-register"
          required
        />

        <InputField
          label="CUIT/CUIL"
          placeholder="Ingresa tu CUIT/CUIL"
          type="text"
          className="input-register"
          required
        />

        <InputField
          label="Domicilio Fiscal"
          placeholder="Calle"
          type="text"
          className="input-register"
          required
        />
        <InputField
          label=""
          placeholder="Ciudad"
          type="text"
          className="input-register"
          required
        />
        <InputField
          label=""
          placeholder="Provincia"
          type="text"
          className="input-register"
          required
        />

        <InputField
          label="Redes Sociales del Comercio (Opcional)"
          placeholder="Ingresa redes sociales (ej. Instagram)"
          type="text"
          className="input-register"
        />

        <FormButton buttonText="Enviar solicitud" />
        <RegisterLink />
      </form>
    </RegisterFormContainer>
  );
};

export default RegisterForm;
