import * as yup from 'yup';

export const Loginschema = yup.object().shape({
  email: yup
    .string()
    .email('Email inválido')
    .required('El email es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
});
