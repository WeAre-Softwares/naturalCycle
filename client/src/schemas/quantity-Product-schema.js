import * as yup from 'yup';

export const quantityProductSchema = yup.object().shape({
    quantityProduct:yup
    .number()
    .typeError('Debe ser un numero válido')
    .integer('La cantidad debe ser un numero entero')
    .min(1, 'Debe ser al menos 1')
    .max(999,'Demasiado para un solo carrito'),
})