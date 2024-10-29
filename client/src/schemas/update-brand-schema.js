import * as yup from 'yup';
import { imagenSchema } from './create-brand-schema';

// Esquema para actualización donde todos los campos son opcionales
export const updateBrandSchema = yup.object().shape({
  nombre: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(255, 'El nombre debe tener como máximo 255 caracteres.')
    .transform((value) =>
      value
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value,
    ),
  marca_destacada: yup
    .boolean()
    .optional()
    .transform((value) => value === 'true' || value === true),
  imagen: imagenSchema.optional(),
});
