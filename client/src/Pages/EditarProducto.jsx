import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UpdateProductoSchema } from '../schemas/';
import { updateProductService } from '../services/products-services/update-product';
import { useProductoFormulario } from '../hooks/hooks-product/useProductoFormulario';
import { useGetProductById } from '../hooks/hooks-product/useGetProductById';
import useAuthStore from '../store/use-auth-store';

export const EditarProducto = () => {
  // Obtener el Id del producto desde los parámetros de la URL
  const { producto_id } = useParams();
  // Hook para obtener marcas, etiquetas y categorías desde el backend
  const { categorias, error, etiquetas, loading, marcas } =
    useProductoFormulario();
  // Hook para obtener el producto por su ID
  const {
    product,
    loading: productLoading,
    error: productError,
  } = useGetProductById(producto_id);
  // Extraer el JWT del localStorage usando el estado global
  const { token } = useAuthStore();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UpdateProductoSchema),
    defaultValues: {
      imagenes: [],
    },
  });

  useEffect(() => {
    if (product) {
      setValue(
        'productos_categorias',
        product.categorias.map((c) => c.categoria_id),
      );
      setValue(
        'productos_etiquetas',
        product.etiquetas.map((e) => e.etiqueta_id),
      );
    }
  }, [product, setValue]);

  // Cargar los datos del producto en el formulario
  useEffect(() => {
    if (product) {
      setValue('nombre', product.nombre);
      setValue('descripcion', product.descripcion);
      setValue('precio', product.precio);
      setValue('tipo_de_precio', product.tipo_de_precio);
      setValue('marca_id', product.marca.marca_id);

      // Establecer categorías y etiquetas seleccionadas
      setValue(
        'productos_categorias',
        product.categorias.map((c) => c.categoria_id),
      );
      setValue(
        'productos_etiquetas',
        product.etiquetas.map((e) => e.etiqueta_id),
      );

      // Establece las imágenes actuales en el estado
      setSelectedFiles(product.imagenes || []);
      setValue('imagenes', product.imagenes || []);

      setValue('en_promocion', product.en_promocion);
      setValue('producto_destacado', product.producto_destacado);
      setValue('nuevo_ingreso', product.nuevo_ingreso);
    }
  }, [product, setValue]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setValue('imagenes', files, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    console.log('Datos enviados:', data);
    console.log('Selected Files:', selectedFiles);

    const formData = new FormData();

    // Manejo de imágenes: Si no se selecciona nada, usa las existentes
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => formData.append('imagenes', file));
    } else {
      product.imagenes.forEach((url) => formData.append('imagenes', url));
    }

    // Manejo de categorías: Si no hay cambios, usa las categorías previas
    const categorias = data.productos_categorias.length
      ? data.productos_categorias
      : product.categorias.map((cat) => cat.categoria_id);

    categorias.forEach((categoriaId, index) =>
      formData.append(
        `productos_categorias[${index}][categoria_id]`,
        categoriaId,
      ),
    );

    // Manejo de etiquetas: Si no hay cambios, usa las etiquetas previas
    const etiquetas = data.productos_etiquetas.length
      ? data.productos_etiquetas
      : product.etiquetas.map((et) => et.etiqueta_id);

    etiquetas.forEach((etiquetaId, index) =>
      formData.append(`productos_etiquetas[${index}][etiqueta_id]`, etiquetaId),
    );

    // Agregar otros campos básicos
    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);
    formData.append('precio', data.precio);
    formData.append('tipo_de_precio', data.tipo_de_precio);
    formData.append('marca_id', data.marca_id);

    // Convertir checkboxes a booleanos explícitamente
    formData.append('en_promocion', !!data.en_promocion);
    formData.append('producto_destacado', !!data.producto_destacado);
    formData.append('nuevo_ingreso', !!data.nuevo_ingreso);

    try {
      const response = await updateProductService(token, producto_id, formData);

      if (response) {
        toast.success('Producto actualizado con éxito!', { autoClose: 3000 });
        setTimeout(() => navigate('/panel-principal'), 3000);
      } else {
        toast.error('Error al actualizar el producto');
        throw new Error('Error al actualizar el producto.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al procesar la solicitud.');
    }
  };

  if (loading || productLoading) return <section class="dots-container">
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
</section>;
  if (error || productError) return <p>Error al cargar los datos</p>;

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="crear-producto-container"
      >
        <Link to="/panelproducto">
          <button className="button-volver-panel-producto">
            <i className="fas fa-arrow-left"></i>&nbsp;&nbsp;Volver
          </button>
        </Link>
        <h1 className="crear-producto-header">Editar Producto</h1>

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

        <span style={{ marginBottom: '1rem', fontWeight: 600 }}>Categoría</span>
        <select
          className="crear-producto-select"
          {...register('productos_categorias')}
          multiple
          value={watch('productos_categorias') || []}
          onChange={(e) =>
            setValue(
              'productos_categorias',
              Array.from(e.target.selectedOptions, (option) => option.value),
              { shouldValidate: true },
            )
          }
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

        <span style={{ marginBottom: '1rem', fontWeight: 600 }}>Etiqueta</span>
        <select
          className="crear-producto-select"
          {...register('productos_etiquetas')}
          multiple
          value={watch('productos_etiquetas') || []}
          onChange={(e) =>
            setValue(
              'productos_etiquetas',
              Array.from(e.target.selectedOptions, (option) => option.value),
              { shouldValidate: true },
            )
          }
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

        <button className="crear-producto-button">Actualizar Producto</button>
      </form>
    </>
  );
};
