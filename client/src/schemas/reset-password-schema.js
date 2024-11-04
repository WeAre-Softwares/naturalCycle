import * as yup from 'yup';

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required('La contraseña es obligatoria.')
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .max(255, 'La contraseña no puede exceder los 255 caracteres.')
    .matches(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).+$/,
      'La contraseña debe incluir al menos una letra mayúscula, un número y un carácter especial (como *, $, #, etc.).',
    ),
});
