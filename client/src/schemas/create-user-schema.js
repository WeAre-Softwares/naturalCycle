import * as yup from 'yup';

export const CreateUsuarioSchema = yup.object().shape({
  nombre: yup
    .string()
    .required('El nombre es obligatorio.')
    .min(1, 'El nombre debe tener al menos 1 carácter.')
    .max(150, 'El nombre no puede exceder los 150 caracteres.')
    .transform(
      (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    ), // Capitaliza la primera letra
  apellido: yup
    .string()
    .required('El apellido es obligatorio.')
    .min(1, 'El apellido debe tener al menos 1 carácter.')
    .max(150, 'El apellido no puede exceder los 150 caracteres.')
    .transform(
      (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    ), // Capitaliza la primera letra
  dni: yup
    .number()
    .required('El DNI es obligatorio.')
    .typeError('El DNI debe ser un número válido.'),
  nombre_comercio: yup
    .string()
    .required('El nombre del comercio es obligatorio.')
    .min(1, 'El nombre del comercio debe tener al menos 1 carácter.')
    .max(255, 'El nombre del comercio no puede exceder los 255 caracteres.'),
  telefono: yup
    .string()
    .required('El teléfono es obligatorio.')
    .min(1, 'El teléfono debe tener al menos 1 carácter.')
    .max(18, 'El teléfono no puede exceder los 18 caracteres.'),
  dom_fiscal: yup
    .string()
    .required('El domicilio fiscal es obligatorio.')
    .min(1, 'El domicilio fiscal debe tener al menos 1 carácter.')
    .max(255, 'El domicilio fiscal no puede exceder los 255 caracteres.'),
  email: yup
    .string()
    .required('El correo electrónico es obligatorio.')
    .email('El correo electrónico no es válido.')
    .transform((value) => value.toLowerCase().trim()), // Minúsculas y sin espacios
  password: yup
    .string()
    .required('La contraseña es obligatoria.')
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .max(255, 'La contraseña no puede exceder los 255 caracteres.')
    .matches(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).+$/,
      'La contraseña debe incluir al menos una letra mayúscula, un número y un carácter especial (como *, $, #, etc.).',
    ),
});
