import * as yup from 'yup';

const UpdateimagenesSchema = yup
  .array()
  .of(
    yup
      .mixed()
      .test('fileSize', 'Cada archivo debe ser menor de 6MB.', (file) =>
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
      ),
  )
  .max(2, 'Solo puedes subir un máximo de 2 imágenes.');

const tipoPrecioEnum = ['por_kilo', 'por_unidad', 'por_bulto_cerrado'];

export const UpdateProductoSchema = yup.object().shape({
  nombre: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(255, 'El nombre debe tener como máximo 255 caracteres.')
    .optional()
    .transform(
      (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    ), // Capitalizar la primera letra

  descripcion: yup
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres.')
    .optional(),

  precio: yup
    .number()
    .min(0, 'El precio no puede ser negativo.')
    .max(999999.99, 'El precio no puede superar 999999.99.')
    .optional()
    .typeError('El precio debe ser un número válido con hasta 2 decimales.'),

  precio_antes_oferta: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(0, 'El precio no puede ser negativo.')
    .max(999999.99, 'El precio no puede superar 999999.99.')
    .typeError('El precio debe ser un número válido con hasta 2 decimales.')
    .optional(),

  tipo_de_precio: yup
    .mixed()
    .oneOf(
      tipoPrecioEnum,
      `El tipo de precio debe ser uno de los siguientes valores: ${tipoPrecioEnum.join(
        ', ',
      )}`,
    )
    .optional(),

  disponible: yup
    .boolean()
    .optional()
    .transform((value) => value === 'true' || value === true),

  producto_destacado: yup
    .boolean()
    .optional()
    .transform((value) => value === 'true' || value === true),

  en_promocion: yup
    .boolean()
    .optional()
    .transform((value) => value === 'true' || value === true),

  nuevo_ingreso: yup
    .boolean()
    .optional()
    .transform((value) => value === 'true' || value === true),

  marca_id: yup
    .string()
    .uuid('El ID de la marca debe ser un UUID válido.')
    .optional(),

  productos_etiquetas: yup
    .array()
    .of(yup.string().uuid('ID de etiqueta inválido.'))
    .optional(),

  productos_categorias: yup
    .array()
    .of(yup.string().uuid('ID de categoría inválido.'))
    .optional(),

  imagenes: UpdateimagenesSchema.optional(),
});
