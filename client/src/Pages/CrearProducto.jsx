import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createProductoSchema } from '../schemas/create-product-schema';
import { createProductService } from '../services/products-services/create-product';
import { useProductoFormulario } from '../hooks/useProductoFormulario';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/use-auth-store';

export const CrearProducto = () => {
  const { categorias, error, etiquetas, loading, marcas } =
    useProductoFormulario();
  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createProductoSchema),
    defaultValues: {
      imagenes: [],
    },
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setSelectedFiles(files);
    setValue('imagenes', files, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Agregar archivos de imagen
    selectedFiles.forEach((file) => formData.append('imagenes', file));

    // Agregar otros campos básicos
    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);
    formData.append('precio', data.precio);
    formData.append('tipo_de_precio', data.tipo_de_precio);
    formData.append('marca_id', data.marca_id);

    // Agregar categorías y etiquetas en el formato anidado esperado por el backend
    data.productos_categorias.forEach((categoriaId, index) => {
      formData.append(
        `productos_categorias[${index}][categoria_id]`,
        categoriaId,
      );
    });

    data.productos_etiquetas.forEach((etiquetaId, index) => {
      formData.append(`productos_etiquetas[${index}][etiqueta_id]`, etiquetaId);
    });

    // Convertir checkboxes a booleanos explícitamente
    formData.append('en_promocion', !!data.en_promocion);
    formData.append('producto_destacado', !!data.producto_destacado);

    console.log([...formData]);

    try {
      const response = await createProductService(token, formData);

      // Verifica que la respuesta tenga un indicativo de éxito
      if (response) {
        toast.success('Producto creado con éxito!', { autoClose: 5000 });
        setTimeout(() => navigate('/PanelPrincipal'), 6000);
      } else {
        toast.error('Error al crear el producto');
        throw new Error('Error al crear el producto.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al procesar la solicitud.');
    }
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="crear-producto-container"
      >
        <Link to="/panelproducto">
          <button className="button-volver-panel-producto">
            {' '}
            <i class="fas fa-arrow-left"></i>
            &nbsp;&nbsp;Volver
          </button>
        </Link>
        <h1 className="crear-producto-header">Crear Producto</h1>

        <input
          type="text"
          {...register('nombre')}
          placeholder="Nombre del producto"
          className="crear-producto-input"
        />
        {errors.nombre && (
          <p style={{ color: 'red' }}>{errors.nombre.message}</p>
        )}
        <textarea
          {...register('descripcion')}
          placeholder="Descripción"
          className="crear-producto-textarea"
        />
        {errors.descripcion && (
          <p style={{ color: 'red' }}>{errors.descripcion.message}</p>
        )}

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="crear-producto-input"
        />
        {errors.imagenes && (
          <p style={{ color: 'red' }}>{errors.imagenes.message}</p>
        )}

        <span style={{ marginBottom: '1rem', fontWeight: 600 }}>
          Tipo precio
        </span>
        <select
          {...register('tipo_de_precio')}
          className="crear-producto-select"
        >
          <option value="por_unidad">Por unidad</option>
          <option value="por_kilo">Por kilogramo</option>
        </select>
        {errors.tipo_de_precio && (
          <p style={{ color: 'red' }}>{errors.tipo_de_precio.message}</p>
        )}
        <input
          {...register('precio')}
          type="number"
          placeholder="Precio"
          className="crear-producto-input"
        />
        {errors.precio && (
          <p style={{ color: 'red' }}>{errors.precio.message}</p>
        )}
        {/* Marca */}
        <span style={{ marginBottom: '1rem', fontWeight: 600 }}>Marca</span>
        <select {...register('marca_id')} className="crear-producto-select">
          {marcas.map((marca) => (
            <option key={marca.marca_id} value={marca.marca_id}>
              {marca.nombre}
            </option>
          ))}
        </select>
        {errors.marca_id && (
          <p style={{ color: 'red' }}>{errors.marca_id.message}</p>
        )}
        {/* End Marca */}
        {/* Categoria */}
        <span style={{ marginBottom: '1rem', fontWeight: 600 }}>Categoría</span>
        <select
          {...register('productos_categorias')}
          multiple
          className="crear-producto-select"
        >
          {categorias.map((categoria) => (
            <option key={categoria.categoria_id} value={categoria.categoria_id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        {errors.productos_categorias && (
          <p style={{ color: 'red' }}>{errors.productos_categorias.message}</p>
        )}
        {/* End Categoria */}

        {/* Etiquetas */}
        <span style={{ marginBottom: '1rem', fontWeight: 600 }}>Etiqueta</span>
        <select
          {...register('productos_etiquetas')}
          multiple
          className="crear-producto-select"
        >
          {etiquetas.map((etiqueta) => (
            <option key={etiqueta.etiqueta_id} value={etiqueta.etiqueta_id}>
              {etiqueta.nombre}
            </option>
          ))}
        </select>
        {errors.productos_etiquetas && (
          <p style={{ color: 'red' }}>{errors.productos_etiquetas.message}</p>
        )}
        {/* End Etiquetas */}

        <label className="crear-producto-label">
          <input
            type="checkbox"
            {...register('en_promocion')}
            className="crear-producto-checkbox"
          />
          Producto en promoción
        </label>
        <label className="crear-producto-label">
          <input
            type="checkbox"
            {...register('producto_destacado')}
            className="crear-producto-checkbox"
          />
          Producto destacado
        </label>
        {/* TODO: Agregar campo nuevo_ingreso en el backend */}
        {/* <label className="crear-producto-label">
            <input
              type="checkbox"
              {...register('nuevo_ingreso')}
              className="crear-producto-checkbox"
            />
            Nuevo ingreso
          </label> */}
        <button className="crear-producto-button">Crear Producto</button>
      </form>
    </>
  );
};
