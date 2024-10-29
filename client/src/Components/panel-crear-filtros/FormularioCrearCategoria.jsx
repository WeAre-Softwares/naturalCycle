import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createCategorySchema } from '../../schemas/create-category-schema';
import { useCreateCategory } from '../../hooks/hooks-category/useCreateCategory';

export const FormularioCrearCategoria = () => {
  const { createCategory, loading } = useCreateCategory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createCategorySchema),
  });

  const onSubmit = async (data) => {
    await createCategory(data); // Envíar `data` directamente como JSON
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
        <h1 className="crear-producto-header">Crear Categoría</h1>
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
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Categoría'}
        </button>
      </form>
    </>
  );
};
