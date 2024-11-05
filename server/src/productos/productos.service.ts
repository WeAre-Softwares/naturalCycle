import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import {
  CreateProductoDto,
  UpdateProductoDto,
  type CategoryFilterDto,
  type CreateProductosCategoriasDto,
  type CreateProductosEtiquetasDto,
} from './dto';
import { PaginationDto, SearchWithPaginationDto } from '../common/dtos';
import { Producto } from './entities/producto.entity';
import { ProductosImagenes } from '../productos_imagenes/entities/productos_imagenes.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CLOUDINARY_CARPETAS } from '../cloudinary/constants/cloudinary-folders.constant';
import type {
  GetProductosResponse,
  ProductoPlainResponse,
  ProductoResponse,
} from './interfaces';
import { MarcasService } from '../marcas/marcas.service';
import { EtiquetasService } from '../etiquetas/etiquetas.service';
import { CategoriasService } from '../categorias/categorias.service';
import { ProductosCategorias, ProductosEtiquetas } from './entities';
import { Marca } from '../marcas/entities/marca.entity';
import { Categoria } from '../categorias/entities/categoria.entity';

@Injectable()
export class ProductosService {
  private readonly logger = new Logger('ProductosService');

  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(ProductosImagenes)
    private readonly productosImagenesRepository: Repository<ProductosImagenes>,
    @InjectRepository(ProductosCategorias)
    private readonly productosCategoriasRepository: Repository<ProductosCategorias>,
    @InjectRepository(ProductosEtiquetas)
    private readonly productosEtiquetasRepository: Repository<ProductosEtiquetas>,
    private readonly dataSource: DataSource,
    private readonly marcasService: MarcasService,
    private readonly etiquetasService: EtiquetasService,
    private readonly categoriasService: CategoriasService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createProductoDto: CreateProductoDto,
    files: Express.Multer.File[], // Esperamos varios archivos
  ): Promise<ProductoResponse> {
    const { marca_id, productos_categorias, productos_etiquetas, ...rest } =
      createProductoDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let imagesUpload: { secure_url: string; public_id: string }[] = [];
    let savedCategorias = [];
    let savedEtiquetas = [];

    try {
      // *Crear entidades relacionadas y guardarlas primero

      // Asignar la marca al producto verificando que ya exista
      const marca = await this.marcasService.findOne(marca_id);

      // Subir las imágenes a Cloudinary**
      if (files && files.length > 0) {
        imagesUpload = await Promise.all(
          files.map(async (file) => {
            const response = await this.cloudinaryService.uploadFile(
              file,
              CLOUDINARY_CARPETAS.PRODUCTOS,
            );

            // Verificamos si la respuesta fue un error
            if ('error' in response) {
              throw new InternalServerErrorException(
                `Error al subir la imagen: ${response.error.message}`,
              );
            }

            return {
              secure_url: response.secure_url,
              public_id: response.public_id,
            };
          }),
        );
      }

      // Crear la instancia de Productos
      const nuevoProducto = queryRunner.manager.create(Producto, {
        ...rest,
        marca,
      });

      // Guardar el nuevo producto
      await queryRunner.manager.save(nuevoProducto);

      // * Guardar las relaciones en las tablas intermedias

      // Relación con Categorías
      if (productos_categorias && productos_categorias.length > 0) {
        for (const categoriaDto of productos_categorias) {
          const categoria = await this.categoriasService.findOne(
            categoriaDto.categoria_id,
          ); // Obtener cada categoría individualmente

          const nuevoProductoCategoria = queryRunner.manager.create(
            ProductosCategorias,
            {
              producto: nuevoProducto,
              categoria,
            },
          );
          await queryRunner.manager.save(nuevoProductoCategoria);

          savedCategorias.push(categoria);
        }
      }

      // Relación con Etiquetas
      if (productos_etiquetas && productos_etiquetas.length > 0) {
        for (const etiquetaDto of productos_etiquetas) {
          const etiqueta = await this.etiquetasService.findOne(
            etiquetaDto.etiqueta_id,
          ); // Obtener cada etiqueta individualmente
          console.log('etiquea', etiqueta);
          const nuevoProductoEtiqueta = queryRunner.manager.create(
            ProductosEtiquetas,
            {
              producto: nuevoProducto,
              etiqueta,
            },
          );
          await queryRunner.manager.save(nuevoProductoEtiqueta);
          savedEtiquetas.push(etiqueta);
        }
      }
      // Guardar las imágenes relacionadas**
      if (imagesUpload.length > 0) {
        const savedImages = await Promise.all(
          imagesUpload.map((img) =>
            queryRunner.manager.save(
              this.productosImagenesRepository.create({
                url: img.secure_url,
                public_id: img.public_id,
                producto: nuevoProducto,
              }),
            ),
          ),
        );

        nuevoProducto.imagenes = savedImages;
      }

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      return {
        producto_id: nuevoProducto.producto_id,
        nombre: nuevoProducto.nombre,
        descripcion: nuevoProducto.descripcion,
        precio: nuevoProducto.precio,
        tipo_de_precio: nuevoProducto.tipo_de_precio,
        producto_destacado: nuevoProducto.producto_destacado,
        en_promocion: nuevoProducto.en_promocion,
        nuevo_ingreso: nuevoProducto.nuevo_ingreso,
        marca: {
          nombre: nuevoProducto.marca.nombre,
          marca_destacada: nuevoProducto.marca.marca_destacada,
          imagen_url: nuevoProducto.marca.imagen_url,
        },
        categorias: savedCategorias.map((categoria) => ({
          nombre: categoria.nombre,
        })),
        etiquetas: savedEtiquetas.map((etiqueta) => ({
          nombre: etiqueta.nombre,
        })),
        imagenes: nuevoProducto.imagenes.map((img) => ({
          url: img.url,
        })),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Si hubo subida de imágenes y ocurre un error, eliminarlas
      if (imagesUpload.length > 0) {
        await Promise.all(
          imagesUpload.map((img) =>
            this.cloudinaryService.deleteImage(img.public_id),
          ),
        );
      }
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Error al crear el Producto',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<GetProductosResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [productos, total] = await this.productoRepository.findAndCount({
        where: {
          esta_activo: true,
        },
        relations: {
          marca: true,
          imagenes: true,
          productosCategorias: {
            categoria: true, // Cargar la relación con la tabla `Categoria`
          },
          productosEtiquetas: {
            etiqueta: true, // Cargar la relación con la tabla `Etiqueta`
          },
        },
        take: limit,
        skip: offset,
      });

      // Aplano los productos en una estructura más simple
      const productosPlains = productos.map(this.plainProduct);

      return {
        productos: productosPlains,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar los productos',
        error,
      );
    }
  }

  async findAllInactive(
    paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [productos, total] = await this.productoRepository.findAndCount({
        where: { esta_activo: false },
        relations: {
          marca: true,
          imagenes: true,
          productosCategorias: {
            categoria: true, // Cargar la relación con la tabla `Categoria`
          },
          productosEtiquetas: {
            etiqueta: true, // Cargar la relación con la tabla `Etiqueta`
          },
        },
        take: limit,
        skip: offset,
      });

      // Aplano los productos en una estructura más simple
      const productosPlains = productos.map(this.plainProduct);

      return {
        productos: productosPlains,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar las etiquetas inactivas',
        error,
      );
    }
  }

  async findProductsByBrand(
    marcaId: string,
    paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [productos, total] = await this.productoRepository.findAndCount({
        where: {
          esta_activo: true,
          marca: { marca_id: marcaId }, // Filtrar por la marca usando el ID
        },
        relations: {
          marca: true,
          imagenes: true,
          productosCategorias: {
            categoria: true,
          },
          productosEtiquetas: {
            etiqueta: true,
          },
        },
        take: limit,
        skip: offset,
      });

      // Aplano los productos en una estructura más simple
      const productosPlains = productos.map(this.plainProduct);

      return {
        productos: productosPlains,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar los productos por marca',
        error,
      );
    }
  }

  async findProductsByCategory(
    filterDto: CategoryFilterDto,
    paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    const { id, nombre } = filterDto;
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [productos, total] = await this.productoRepository.findAndCount({
        where: {
          esta_activo: true,
          productosCategorias: {
            categoria: id ? { categoria_id: id } : { nombre },
          },
        },
        relations: {
          marca: true,
          imagenes: true,
          productosCategorias: {
            categoria: true,
          },
          productosEtiquetas: {
            etiqueta: true,
          },
        },
        take: limit,
        skip: offset,
      });

      // Aplano los productos en una estructura más simple
      const productosPlains = productos.map(this.plainProduct);

      return {
        productos: productosPlains,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar los productos por categoria',
        error,
      );
    }
  }

  async findAllProductosDestacados(
    paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [productos, total] = await this.productoRepository.findAndCount({
        where: {
          esta_activo: true,
          producto_destacado: true, // Filtrar solo productos destacados
        },
        relations: {
          marca: true,
          imagenes: true,
          productosCategorias: {
            categoria: true,
          },
          productosEtiquetas: {
            etiqueta: true,
          },
        },
        take: limit,
        skip: offset,
      });

      const productosPlains = productos.map(this.plainProduct);

      return {
        productos: productosPlains,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar los productos destacados',
        error,
      );
    }
  }

  async findNewArrivalProducts(
    paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [productos, total] = await this.productoRepository.findAndCount({
        where: {
          esta_activo: true,
          nuevo_ingreso: true, // Filtrar nuevos ingresos de productos
        },
        relations: {
          marca: true,
          imagenes: true,
          productosCategorias: {
            categoria: true,
          },
          productosEtiquetas: {
            etiqueta: true,
          },
        },
        take: limit,
        skip: offset,
      });

      const productosPlains = productos.map(this.plainProduct);

      return {
        productos: productosPlains,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar nuevos ingresos de productos',
        error,
      );
    }
  }

  async findPromotionalProducts(
    paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [productos, total] = await this.productoRepository.findAndCount({
        where: {
          esta_activo: true,
          en_promocion: true, // Filtrar productos en promoción
        },
        relations: {
          marca: true,
          imagenes: true,
          productosCategorias: {
            categoria: true,
          },
          productosEtiquetas: {
            etiqueta: true,
          },
        },
        take: limit,
        skip: offset,
      });

      const productosPlains = productos.map(this.plainProduct);

      return {
        productos: productosPlains,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar productos en promoción',
        error,
      );
    }
  }

  async findOne(producto_id: string): Promise<Producto> {
    try {
      const producto = await this.productoRepository.findOne({
        where: { producto_id: producto_id, esta_activo: true },

        relations: {
          marca: true,
          imagenes: true,
          productosCategorias: {
            categoria: true, // Cargar la relación con la tabla `Categoria`
          },
          productosEtiquetas: {
            etiqueta: true, // Cargar la relación con la tabla `Etiqueta`
          },
        },
      });

      if (!producto) {
        throw new NotFoundException(
          `No se encontro el producto con el id: ${producto_id}`,
        );
      }

      return producto;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar el producto',
        error,
      );
    }
  }

  async getProductoForResponse(
    producto_id: string,
  ): Promise<ProductoPlainResponse> {
    const producto = await this.findOne(producto_id);
    return this.plainProduct(producto);
  }

  private plainProduct(producto: Producto): ProductoPlainResponse {
    return {
      producto_id: producto.producto_id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      tipo_de_precio: producto.tipo_de_precio,
      disponible: producto.disponible,
      producto_destacado: producto.producto_destacado,
      en_promocion: producto.en_promocion,
      nuevo_ingreso: producto.nuevo_ingreso,
      esta_activo: producto.esta_activo,
      marca: {
        marca_id: producto.marca.marca_id,
        nombre: producto.marca.nombre,
      },
      imagenes: producto.imagenes.map((imagen) => ({
        url: imagen.url,
      })),
      categorias: producto.productosCategorias.map((pc) => ({
        categoria_id: pc.categoria.categoria_id,
        nombre: pc.categoria.nombre,
      })),
      etiquetas: producto.productosEtiquetas.map((pe) => ({
        etiqueta_id: pe.etiqueta.etiqueta_id,
        nombre: pe.etiqueta.nombre,
      })),
    };
  }

  async findAllByTerm(
    searchWithPaginationDto: SearchWithPaginationDto,
  ): Promise<{
    productos: ProductoPlainResponse[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0, term } = searchWithPaginationDto;

    try {
      // Crear el queryBuilder para buscar productos
      const queryBuilder = this.productoRepository
        .createQueryBuilder('productos')
        .leftJoinAndSelect('productos.marca', 'marca')
        .leftJoinAndSelect('productos.imagenes', 'imagenes')
        .leftJoinAndSelect(
          'productos.productosCategorias',
          'productosCategorias',
        )
        .leftJoinAndSelect('productosCategorias.categoria', 'categoria')
        .leftJoinAndSelect('productos.productosEtiquetas', 'productosEtiquetas')
        .leftJoinAndSelect('productosEtiquetas.etiqueta', 'etiqueta')
        .where('productos.esta_activo = :esta_activo', { esta_activo: true })
        .andWhere('(LOWER(productos.nombre) LIKE LOWER(:term))', {
          term: `%${term}%`,
        })
        .take(limit)
        .skip(offset);

      // Obtener los productos y el total
      const [productos, total] = await queryBuilder.getManyAndCount();

      // Aplicar el formateo a los productos obtenidos
      const productosPlains = productos.map(this.plainProduct);

      // Devolver los productos formateados
      return {
        productos: productosPlains,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        'Error al buscar los productos por término',
        error,
      );
    }
  }

  async update(
    id: string,
    updateProductoDto: UpdateProductoDto,
    files: Express.Multer.File[],
  ): Promise<Partial<Producto>> {
    const { marca_id, productos_categorias, productos_etiquetas, ...toUpdate } =
      updateProductoDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let newImagesUpload: { secure_url: string; public_id: string }[] = [];
    let previousPublicIds: string[] = [];

    try {
      // 1. Buscar y obtener el producto existente
      const producto = await this.findOne(id);

      // 2. Guardar los public_id de las imágenes actuales
      previousPublicIds = producto.imagenes.map((img) => img.public_id);

      // 3. Actualizar la marca si se proporciona una nueva
      if (marca_id) {
        const marca = await this.marcasService.findOne(marca_id);
        producto.marca = marca;
      }

      // 4. Actualizar el producto directamente usando `save`
      const productoActualizado = await queryRunner.manager.save(
        this.productoRepository.create({ ...producto, ...toUpdate }),
      );

      // 5. Asegurar que productoActualizado tenga `producto_id`
      const productoId = productoActualizado.producto_id;

      // 6. Crear relaciones en tablas intermedias
      if (productos_categorias && productos_categorias.length > 0) {
        await this.productosCategoriasRepository.delete({
          producto: { producto_id: productoId },
        });
        for (const categoriaDto of productos_categorias) {
          const categoria = await this.categoriasService.findOne(
            categoriaDto.categoria_id,
          );
          const nuevaRelacionCategoria =
            this.productosCategoriasRepository.create({
              producto: { producto_id: productoId }, // Asignación explícita de producto_id
              categoria,
            });
          await queryRunner.manager.save(nuevaRelacionCategoria);
        }
      }

      if (productos_etiquetas && productos_etiquetas.length > 0) {
        await this.productosEtiquetasRepository.delete({
          producto: { producto_id: productoId },
        });
        for (const etiquetaDto of productos_etiquetas) {
          const etiqueta = await this.etiquetasService.findOne(
            etiquetaDto.etiqueta_id,
          );
          const nuevaRelacionEtiqueta =
            this.productosEtiquetasRepository.create({
              producto: { producto_id: productoId }, // Asignación explícita de producto_id
              etiqueta,
            });
          await queryRunner.manager.save(nuevaRelacionEtiqueta);
        }
      }

      // 7. Subir nuevas imágenes a Cloudinary si las hay
      if (files && files.length > 0) {
        newImagesUpload = await Promise.all(
          files.map(async (file) => {
            const response = await this.cloudinaryService.uploadFile(
              file,
              CLOUDINARY_CARPETAS.PRODUCTOS,
            );

            if ('error' in response) {
              throw new InternalServerErrorException(
                `Error al subir la imagen: ${response.error.message}`,
              );
            }

            return {
              secure_url: response.secure_url,
              public_id: response.public_id,
            };
          }),
        );

        // Guardar nuevas imágenes en la base de datos
        await this.productosImagenesRepository.delete({
          producto: { producto_id: productoId },
        });

        const savedImages = await Promise.all(
          newImagesUpload.map((img) =>
            queryRunner.manager.save(
              this.productosImagenesRepository.create({
                url: img.secure_url,
                public_id: img.public_id,
                producto: { producto_id: productoId },
              }),
            ),
          ),
        );
        productoActualizado.imagenes = savedImages;
      }

      // 8. Confirmar la transacción
      await queryRunner.commitTransaction();

      // 9. Eliminar las imágenes antiguas de Cloudinary si se subieron nuevas
      if (previousPublicIds.length > 0 && newImagesUpload.length > 0) {
        await Promise.all(
          previousPublicIds.map((public_id) =>
            this.cloudinaryService.deleteImage(public_id),
          ),
        );
      }

      // 10. Consultar el producto con relaciones actualizadas y retornarlo
      return await this.productoRepository.findOne({
        where: { producto_id: productoId, esta_activo: true },
        relations: {
          marca: true,
          imagenes: true,
          productosCategorias: { categoria: true },
          productosEtiquetas: { etiqueta: true },
        },
      });
    } catch (error) {
      // Revertir transacción y eliminar nuevas imágenes en caso de error
      await queryRunner.rollbackTransaction();
      if (newImagesUpload.length > 0) {
        await Promise.all(
          newImagesUpload.map((img) =>
            this.cloudinaryService.deleteImage(img.public_id),
          ),
        );
      }
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al actualizar el producto',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deactivate(id: string): Promise<{
    mensaje: string;
  }> {
    try {
      const producto = await this.productoRepository.findOne({
        where: { producto_id: id },
      });

      if (!producto) {
        throw new NotFoundException(
          `No se encontro el producto con el id: ${id}`,
        );
      }

      // Marcar como inactiva el producto
      producto.esta_activo = false;
      // Guardar en la DB
      await this.productoRepository.save(producto);
      return {
        mensaje: `El producto con ID ${id} ha sido marcado como inactivo.`,
      };
    } catch (error) {
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        `Error al marcar como inactivo el producto con ID ${id}.`,
        error,
      );
    }
  }

  async activate(id: string): Promise<{
    mensaje: string;
  }> {
    try {
      const producto = await this.productoRepository.findOne({
        where: { producto_id: id },
      });

      if (!producto) {
        throw new NotFoundException(
          `No se encontro el producto con el id: ${id}`,
        );
      }

      // Marcar como activo el producto
      producto.esta_activo = true;
      // Guardar en la DB
      await this.productoRepository.save(producto);
      return {
        mensaje: `El producto con ID ${id} ha sido marcado como activo.`,
      };
    } catch (error) {
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        `Error al marcar como activo el producto con ID ${id}.`,
        error,
      );
    }
  }
}
