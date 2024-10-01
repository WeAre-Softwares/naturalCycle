import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductoDto, UpdateProductoDto } from './dto';
import { PaginationDto, SearchWithPaginationDto } from '../common/dtos';
import { Producto } from './entities/producto.entity';
import { ProductosImagenes } from '../productos_imagenes/entities/productos_imagenes.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CLOUDINARY_CARPETAS } from '../cloudinary/constants/cloudinary-folders.constant';
import type { ProductoInterface } from './interfaces/producto.interface';
import { MarcasService } from '../marcas/marcas.service';
import { EtiquetasService } from '../etiquetas/etiquetas.service';
import { CategoriasService } from '../categorias/categorias.service';
import { ProductosCategorias, ProductosEtiquetas } from './entities';

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
  ) {
    const { marca_id, categoria_id, etiqueta_id, ...rest } = createProductoDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let imagesUpload: { secure_url: string; public_id: string }[] = [];

    try {
      // *Crear entidades relacionadas y guardarlas primero

      // Asignar la marca al producto verificando que ya exista
      const marca = await this.marcasService.findOne(marca_id);

      // Validar categorías y etiquetas antes de asignarlas
      const categoria = await this.categoriasService.findOne(categoria_id);
      const etiqueta = await this.etiquetasService.findOne(etiqueta_id);

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
        categoria,
        etiqueta,
        marca,
      });

      // Guardar el nuevo producto
      await queryRunner.manager.save(nuevoProducto);

      // * Guardar las relaciones en las tablas intermedias

      // Relación con Categoría
      if (categoria) {
        const nuevoProductoCategoria = queryRunner.manager.create(
          ProductosCategorias,
          {
            producto: nuevoProducto,
            categoria: categoria,
            esta_activo: true,
          },
        );
        await queryRunner.manager.save(nuevoProductoCategoria);
      }

      // Relación con Etiqueta
      if (etiqueta) {
        const nuevoProductoEtiqueta = queryRunner.manager.create(
          ProductosEtiquetas,
          {
            producto: nuevoProducto,
            etiqueta: etiqueta,
            esta_activo: true,
          },
        );
        await queryRunner.manager.save(nuevoProductoEtiqueta);
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
        marca: {
          nombre: nuevoProducto.marca.nombre,
          marca_destacada: nuevoProducto.marca.marca_destacada,
          imagen_url: nuevoProducto.marca.imagen_url,
        },
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
      console.log(error);
      throw new InternalServerErrorException(
        'Error al crear el Producto',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto) {
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

      return this.plainProduct(producto);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar el producto',
        error,
      );
    }
  }

  private plainProduct(producto: Producto): any {
    return {
      producto_id: producto.producto_id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      tipo_de_precio: producto.tipo_de_precio,
      disponible: producto.disponible,
      marca: {
        nombre: producto.marca.nombre,
      },
      imagenes: producto.imagenes.map((imagen) => ({
        url: imagen.url,
      })),
      categorias: producto.productosCategorias.map((pc) => ({
        nombre: pc.categoria.nombre,
      })),
      etiquetas: producto.productosEtiquetas.map((pe) => ({
        nombre: pe.etiqueta.nombre,
      })),
    };
  }

  async findAllByTerm(searchWithPaginationDto: SearchWithPaginationDto) {
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

      // Ejecutar la consulta y obtener los productos
      const productos = await queryBuilder.getMany();

      // Aplicar el formateo a los productos obtenidos
      const productosPlains = productos.map(this.plainProduct);

      // Devolver los productos formateados
      return productosPlains;
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
  ) {
    const { marca_id, categoria_id, etiqueta_id, ...toUpdate } =
      updateProductoDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let newImagesUpload: { secure_url: string; public_id: string }[] = [];
    let previousPublicIds: string[] = [];

    try {
      // Buscar el producto existente
      const producto = await this.productoRepository.findOne({
        where: { producto_id: id },
        relations: {
          marca: true,
          imagenes: true,
          productosCategorias: { categoria: true },
          productosEtiquetas: { etiqueta: true },
        },
      });

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      // Guardar los `public_id` de las imágenes actuales
      previousPublicIds = producto.imagenes.map((img) => img.public_id);

      // Actualizar las relaciones de Marca, Categoría, Etiqueta
      const marca = await this.marcasService.findOne(marca_id);

      // Actualizar relación con Categorías (Entidad Intermedia)
      if (categoria_id) {
        await this.productosCategoriasRepository.delete({
          producto: { producto_id: id },
        });

        const nuevaRelacionCategoria =
          this.productosCategoriasRepository.create({
            producto,
            categoria: await this.categoriasService.findOne(categoria_id),
          });

        await queryRunner.manager.save(nuevaRelacionCategoria);
      }

      // Actualizar relación con Etiquetas (Entidad Intermedia)
      if (etiqueta_id) {
        await this.productosEtiquetasRepository.delete({
          producto: { producto_id: id },
        });

        const nuevaRelacionEtiqueta = this.productosEtiquetasRepository.create({
          producto,
          etiqueta: await this.etiquetasService.findOne(etiqueta_id),
        });

        await queryRunner.manager.save(nuevaRelacionEtiqueta);
      }

      // Subir nuevas imágenes a Cloudinary
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
      }

      // Actualizar el producto
      this.productoRepository.merge(producto, {
        ...toUpdate,
        marca: marca || producto.marca,
      });

      // Guardar las nuevas imágenes en la base de datos
      if (newImagesUpload.length > 0) {
        // Primero eliminar imágenes anteriores de la base de datos
        await this.productosImagenesRepository.delete({
          producto: { producto_id: id },
        });

        const savedImages = await Promise.all(
          newImagesUpload.map((img) =>
            queryRunner.manager.save(
              this.productosImagenesRepository.create({
                url: img.secure_url,
                public_id: img.public_id,
                producto: producto,
              }),
            ),
          ),
        );
        producto.imagenes = savedImages;
      }

      // Guardar los cambios en el producto
      await queryRunner.manager.save(producto);

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      // Eliminar las imágenes antiguas de Cloudinary si fueron reemplazadas
      if (previousPublicIds.length > 0 && newImagesUpload.length > 0) {
        await Promise.all(
          previousPublicIds.map((public_id) =>
            this.cloudinaryService.deleteImage(public_id),
          ),
        );
      }

      return this.plainProduct(producto);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Si las nuevas imágenes fueron subidas pero ocurre un error, eliminarlas
      if (newImagesUpload.length > 0) {
        await Promise.all(
          newImagesUpload.map((img) =>
            this.cloudinaryService.deleteImage(img.public_id),
          ),
        );
      }

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
      throw new InternalServerErrorException(
        `Error al marcar como activo el producto con ID ${id}.`,
        error,
      );
    }
  }
}
