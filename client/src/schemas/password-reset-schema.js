import * as yup from 'yup';

export const PasswordResetSchema = yup.object().shape({
  email: yup
    .string()
    .required('El correo electrónico es obligatorio.')
    .email('El correo electrónico no es válido.')
    .transform((value) => value.toLowerCase().trim()), // Minúsculas y sin espacios
});
