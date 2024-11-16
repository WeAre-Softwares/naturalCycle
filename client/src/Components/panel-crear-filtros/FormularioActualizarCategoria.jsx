import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createCategorySchema } from '../../schemas/create-category-schema';
import { useUpdateCategory } from '../../hooks/hooks-category/useUpdateCategory';
import { useGetCategoryById } from '../../hooks/hooks-category/useGetCategoryById';

export const FormularioActualizarCategoria = () => {
  const { categoria_id } = useParams();

  const { categoria, loading: loadingCategory } =
    useGetCategoryById(categoria_id);

  const { UpdateCategory, loading } = useUpdateCategory();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createCategorySchema),
  });

  useEffect(() => {
    if (categoria) {
      setValue('nombre', categoria.nombre); // Prellenar el campo con los datos de la categoría
    }
  }, [categoria, setValue]);

  const onSubmit = async (data) => {
    await UpdateCategory(categoria_id, data); // Pasar el id para actualizar la categoría
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="crear-producto-container panel-margin-necesario"
      >
        <Link to="/panel-filtrado">
          <button className="button-volver-panel-producto">
            <i className="fas fa-arrow-left"></i> Volver
          </button>
        </Link>
        <h1 className="crear-producto-header">Actualizar Categoría</h1>
        {loadingCategory ? (
          <p>Cargando categoría...</p>
        ) : (
          <>
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
          </>
        )}
      </form>
    </>
  );
};
