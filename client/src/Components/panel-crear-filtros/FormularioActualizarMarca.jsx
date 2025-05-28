import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { updateBrandSchema } from '../../schemas/update-brand-schema';
import { useUpdateBrand } from '../../hooks/hooks-brand/useUpdateBrand';
import { useGetBrandById } from '../../hooks/hooks-brand/useGetBrandById';
import { preventFormSubmitOnEnter } from '../../helpers/formHelpers';

export const FormularioActualizarMarca = () => {
  const { marca_id } = useParams();
  const { marca, loading: loadingBrand } = useGetBrandById(marca_id);
  const { updateBrand, loading } = useUpdateBrand();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateBrandSchema),
  });

  useEffect(() => {
    if (marca) {
      setValue('nombre', marca.nombre);
      setValue('marca_destacada', marca.marca_destacada);
    }
  }, [marca, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('marca_destacada', data.marca_destacada);
    if (data.imagen?.[0]) {
      formData.append('imagen', data.imagen[0]);
    }

    await updateBrand(marca_id, formData); // Pasar `marca_id` aquí
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={preventFormSubmitOnEnter}
        className="crear-producto-container panel-margin-necesario"
      >
        <Link to="/panel-filtrado">
          <button className="button-volver-panel-producto">
            <i className="fas fa-arrow-left"></i> Volver
          </button>
        </Link>
        <h1 className="crear-producto-header">Actualizar Marca</h1>
        {loadingBrand ? (
          <p>Cargando marca...</p>
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
          </>
        )}
      </form>
    </>
  );
};
