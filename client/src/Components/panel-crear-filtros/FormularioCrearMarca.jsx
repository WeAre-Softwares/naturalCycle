import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createBrandSchema } from '../../schemas/create-brand-schema';
import { useCreateBrand } from '../../hooks/useCreatedBrand';

export const FormularioCrearMarca = () => {
  const { createBrand, loading } = useCreateBrand();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createBrandSchema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('marca_destacada', data.marca_destacada);
    formData.append('imagen', data.imagen[0]); // Adjunta la imagen seleccionada
    console.log(formData);

    await createBrand(formData);
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
        <h1 className="crear-producto-header">Crear Marca</h1>
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

        <input
          type="file"
          {...register('imagen')}
          className="crear-producto-input"
        />
        {errors.imagen && (
          <p style={{ color: 'red' }}>{errors.imagen.message}</p>
        )}

        <label className="crear-producto-label">
          <input
            type="checkbox"
            {...register('marca_destacada')}
            className="crear-producto-checkbox"
          />
          Marca destacada
        </label>

        <button
          type="submit"
          className="crear-producto-button"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Marca'}
        </button>
      </form>
    </>
  );
};
