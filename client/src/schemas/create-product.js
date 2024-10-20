import * as yup from 'yup';

const imagenSchema = yup
  .mixed()
  .required('Debe proporcionar al menos una imagen.')
  .test(
    'fileSize',
    'El archivo es demasiado grande. El tamaño máximo es 4MB.',
    (value) => value && value.size <= 1024 * 1024 * 4,
  )
  .test(
    'fileFormat',
    'Formato no soportado. Los formatos permitidos son .png, .jpeg, .jpg, .avif, .webp, .svg.',
    (value) =>
      value &&
      [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/avif',
        'image/webp',
        'image/svg+xml',
      ].includes(value.type),
  );

const productosEtiquetasSchema = yup.object().shape({
  etiqueta_id: yup
    .string()
    .uuid('El ID de la etiqueta debe ser un UUID válido.')
    .required('El ID de la etiqueta es obligatorio.'),
});

const productosCategoriasSchema = yup.object().shape({
  categoria_id: yup
    .string()
    .uuid('El ID de la categoría debe ser un UUID válido.')
    .required('El ID de la categoría es obligatorio.'),
});

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
    .of(productosEtiquetasSchema)
    .min(1, 'Debe proporcionar al menos una etiqueta.')
    .required('Las etiquetas del producto son obligatorias.'),

  productos_categorias: yup
    .array()
    .of(productosCategoriasSchema)
    .min(1, 'Debe proporcionar al menos una categoría.')
    .required('Las categorías del producto son obligatorias.'),

  imagenes: yup
    .array()
    .of(imagenSchema)
    .min(1, 'Debe proporcionar al menos una imagen.')
    .max(2, 'No puede proporcionar más de 2 imágenes.')
    .required('Las imágenes son obligatorias.'),
});
