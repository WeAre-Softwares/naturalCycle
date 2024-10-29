import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createEtiquetaSchema } from '../../schemas/create-etiqueta-schema';
import { useCreateEtiqueta } from '../../hooks/useCreateEtiqueta';

export const FormularioCrearEtiqueta = () => {
  const { createEtiqueta, loading } = useCreateEtiqueta();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createEtiquetaSchema),
  });

  const onSubmit = async (data) => {
    await createEtiqueta(data);
    console.log('Etiqueta creada:', data);
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="crear-producto-container"
      >
        <Link to="/panel-filtrado">
          <button className="button-volver-panel-producto">
            <i className="fas fa-arrow-left"></i> Volver
          </button>
        </Link>
        <h1 className="crear-producto-header">Crear Etiqueta</h1>
        <input
          type="text"
          {...register('nombre')}
          placeholder="Nombre"
          className="crear-producto-input"
        />
        {errors.nombre && (
          <p style={{ color: 'red', marginBottom: '1rem' }}>
            {errors.nombre.message}
          </p>
        )}
        <button
          type="submit"
          className="crear-producto-button"
          disabled={loading} // Deshabilitar el botón mientras se carga
        >
          {loading ? 'Guardando...' : 'Guardar Etiqueta'}
        </button>
      </form>
    </>
  );
};
