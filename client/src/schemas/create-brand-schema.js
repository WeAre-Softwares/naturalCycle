import * as yup from 'yup';

export const imagenSchema = yup
  .mixed()
  .test('fileSize', 'El archivo debe ser menor de 6MB.', (file) =>
    file instanceof File ? file.size <= 1024 * 1024 * 6 : true,
  )
  .test(
    'fileFormat',
    'Formato no soportado. Los formatos permitidos son .png, .jpeg, .jpg, .avif, .webp, .svg.',
    (file) =>
      file instanceof File
        ? [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/avif',
            'image/webp',
            'image/svg+xml',
          ].includes(file.type)
        : true,
  );

export const createBrandSchema = yup.object().shape({
  nombre: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(255, 'El nombre debe tener como máximo 255 caracteres.')
    .required('El nombre es obligatorio.')
    .transform(
      (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    ), // Capitalizar la primera letra
  marca_destacada: yup
    .boolean()
    .optional()
    .transform((value) => value === 'true' || value === true),
  imagen: imagenSchema.required('La imagen es obligatoria.'),
});
