import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createEtiquetaSchema } from '../../schemas/create-etiqueta-schema';
import { useUpdateEtiqueta } from '../../hooks/hooks-etiqueta/useUpdateEtiqueta';
import { useGetEtiquetaById } from '../../hooks/hooks-etiqueta/useGetEtiquetaById';

export const FormularioActualizarEtiqueta = () => {
  const { etiqueta_id } = useParams();

  const { etiqueta, loading: loadingCategory } =
    useGetEtiquetaById(etiqueta_id);

  const { UpdateEtiqueta, loading } = useUpdateEtiqueta();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createEtiquetaSchema),
  });

  useEffect(() => {
    if (etiqueta) {
      setValue('nombre', etiqueta.nombre); // Prellenar el campo con los datos de la etiqueta
    }
  }, [etiqueta, setValue]);

  const onSubmit = async (data) => {
    await UpdateEtiqueta(etiqueta_id, data); // Pasar el id para actualizar la etiqueta
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
        <h1 className="crear-producto-header">Actualizar Etiqueta</h1>
        {loadingCategory ? (
          <p>Cargando Etiqueta...</p>
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
              {loading ? 'Guardando...' : 'Guardar Etiqueta'}
            </button>
          </>
        )}
      </form>
    </>
  );
};
