import * as Yup from 'yup';

export const cantidadSchema = Yup.number()
  .min(1, 'La cantidad mínima es 1')
  .max(1000, 'La cantidad máxima es 1000')
  .required('La cantidad es obligatoria');
