import * as yup from 'yup';

const imagenesSchema = yup
  .array()
  .of(
    yup
      .mixed()
      .test('fileSize', 'Cada archivo debe ser menor de 4MB.', (file) =>
        file ? file.size <= 1024 * 1024 * 4 : true,
      )
      .test(
        'fileFormat',
        'Formato no soportado. Los formatos permitidos son .png, .jpeg, .jpg, .avif, .webp, .svg.',
        (file) =>
          file
            ? [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'image/avif',
                'image/webp',
                'image/svg+xml',
              ].includes(file.type)
            : true,
      ),
  )
  .min(1, 'Debes subir al menos una imagen.')
  .max(2, 'Solo puedes subir un máximo de 2 imágenes.');

const tipoPrecioEnum = ['por_kilo', 'por_unidad'];

export const createProductoSchema = yup.object().shape({
  nombre: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(255, 'El nombre debe tener como máximo 255 caracteres.')
    .required('El nombre es obligatorio.')
    .transform(
      (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    ), // Capitalizar la primera letra

  descripcion: yup
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres.')
    .required('La descripción es obligatoria.'),

  precio: yup
    .number()
    .min(0, 'El precio no puede ser negativo.')
    .max(999999.99, 'El precio no puede superar 999999.99.')
    .required('El precio es obligatorio.')
    .typeError('El precio debe ser un número válido con hasta 2 decimales.'),

  tipo_de_precio: yup
    .mixed()
    .oneOf(
      tipoPrecioEnum,
      `El tipo de precio debe ser uno de los siguientes valores: ${tipoPrecioEnum.join(
        ', ',
      )}`,
    )
    .required('El tipo de precio es obligatorio.'),

  producto_destacado: yup
    .boolean()
    .optional()
    .transform((value) => value === 'true' || value === true),

  en_promocion: yup
    .boolean()
    .optional()
    .transform((value) => value === 'true' || value === true),

  marca_id: yup
    .string()
    .uuid('El ID de la marca debe ser un UUID válido.')
    .required('El ID de la marca es obligatorio.'),

  productos_etiquetas: yup
    .array()
    .of(yup.string().uuid('ID de etiqueta inválido.'))
    .min(1, 'Debe seleccionar al menos una etiqueta.')
    .required('Las etiquetas son obligatorias.'),

  productos_categorias: yup
    .array()
    .of(yup.string().uuid('ID de categoría inválido.'))
    .min(1, 'Debe seleccionar al menos una categoría.')
    .required('Las categorías son obligatorias.'),

  imagenes: imagenesSchema.required('Las imágenes son obligatorias.'),
});
