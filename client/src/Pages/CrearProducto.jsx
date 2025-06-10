import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { createProductoSchema } from '../schemas/create-product-schema';
import { createProductService } from '../services/products-services/create-product';
import { useProductoFormulario } from '../hooks/hooks-product/useProductoFormulario';
import useAuthStore from '../store/use-auth-store';
import { preventFormSubmitOnEnter } from '../helpers/formHelpers';

export const CrearProducto = () => {
  const { categorias, error, etiquetas, loading, marcas } =
    useProductoFormulario();
  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createProductoSchema),
    defaultValues: {
      precio_antes_oferta: null,
      imagenes: [],
    },
  });

  // Mapea las opciones para React-Select
  const categoriasOptions = categorias.map((categoria) => ({
    value: categoria.categoria_id,
    label: categoria.nombre,
  }));

  const etiquetasOptions = etiquetas.map((etiqueta) => ({
    value: etiqueta.etiqueta_id,
    label: etiqueta.nombre,
  }));

  // Verificar si el checkbox "en_promocion" está activo
  const enPromocion = watch('en_promocion');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setSelectedFiles(files);
    setValue('imagenes', files, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true); // Desactivar el botón
    const formData = new FormData();

    // Agregar archivos de imagen
    selectedFiles.forEach((file) => formData.append('imagenes', file));

    // Agregar otros campos básicos
    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);
    formData.append('precio', data.precio);
    formData.append('precio_antes_oferta', data.precio_antes_oferta);
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
    formData.append('nuevo_ingreso', !!data.nuevo_ingreso);


    try {
      const response = await createProductService(token, formData);

      // Verifica que la respuesta tenga un indicativo de éxito
      if (response) {
        toast.success('Producto creado con éxito!', { autoClose: 5000 });
        setTimeout(() => navigate('/panel-producto'), 3000);
      } else {
        toast.error('Error al crear el producto');
        throw new Error('Error al crear el producto.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al procesar la solicitud.');
    } finally {
      setIsSubmitting(false); // Reactivar el botón
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={preventFormSubmitOnEnter}
        className="crear-producto-container"
      >
        <Link to="/panel-producto">
          <button className="button-volver-panel-producto">
            {' '}
            <i className="fas fa-arrow-left"></i>
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
          <option value="por_bulto_cerrado">Por bulto cerrado</option>
        </select>
        {errors.tipo_de_precio && (
          <p style={{ color: 'red' }}>{errors.tipo_de_precio.message}</p>
        )}
        <input
          {...register('precio')}
          type="number"
          placeholder="Precio final oferta"
          className="crear-producto-input"
        />
        {errors.precio && (
          <p style={{ color: 'red' }}>{errors.precio.message}</p>
        )}

        {/* Mostrar campo "precio_antes_oferta" solo si "en_promocion" es true */}
        {enPromocion && (
          <input
            {...register('precio_antes_oferta')}
            type="number"
            placeholder="Precio antiguo"
            className="crear-producto-input"
          />
        )}
        {errors.precio_antes_oferta && (
          <p style={{ color: 'red' }}>{errors.precio_antes_oferta.message}</p>
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
        <Select
          options={categoriasOptions}
          isMulti
          className="crear-producto-select"
          placeholder="Selecciona categorías"
          onChange={(selectedOptions) => {
            const values = selectedOptions.map((option) => option.value);
            setValue('productos_categorias', values, { shouldValidate: true });
          }}
        />
        {errors.productos_categorias && (
          <p style={{ color: 'red' }}>{errors.productos_categorias.message}</p>
        )}
        {/* End Categoria */}

        {/* Etiquetas */}
        <span style={{ marginBottom: '1rem', fontWeight: 600 }}>Etiqueta</span>
        <Select
          options={etiquetasOptions}
          isMulti
          className="crear-producto-select"
          placeholder="Selecciona etiquetas"
          onChange={(selectedOptions) => {
            const values = selectedOptions.map((option) => option.value);
            setValue('productos_etiquetas', values, { shouldValidate: true });
          }}
        />
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

        <label className="crear-producto-label">
          <input
            type="checkbox"
            {...register('nuevo_ingreso')}
            className="crear-producto-checkbox"
          />
          Nuevo ingreso
        </label>
        <button disabled={isSubmitting} className="crear-producto-button">
          {isSubmitting ? 'Creando...' : 'Crear Producto'}
        </button>
      </form>
    </>
  );
};
