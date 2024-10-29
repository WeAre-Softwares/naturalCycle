import * as yup from 'yup';

export const createEtiquetaSchema = yup.object().shape({
  nombre: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(255, 'El nombre debe tener como máximo 255 caracteres.')
    .required('El nombre es obligatorio.')
    .transform(
      (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    ), // Capitalizar la primera letra
});
