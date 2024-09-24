import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Marca } from './entities/marca.entity';
import { CreateMarcaDto, UpdateMarcaDto } from './dto';
import { SearchWithPaginationDto, PaginationDto } from '../common/dtos';
import type { GetMarcasResponse, MarcaInterface } from './interfaces';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CLOUDINARY_CARPETAS } from '../cloudinary/constants/cloudinary-folders.constant';
import { CloudinaryResponse } from '../cloudinary/types/cloudinary-response.type';

@Injectable()
export class MarcasService {
  private readonly logger = new Logger('MarcasService');

  constructor(
    @InjectRepository(Marca)
    private readonly marcaRepository: Repository<Marca>,
    private readonly dataSource: DataSource,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createMarcaDto: CreateMarcaDto,
    file: Express.Multer.File,
  ): Promise<MarcaInterface> {
    const { ...rest } = createMarcaDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let imageUpload: CloudinaryResponse | null = null;

    try {
      // Crear la instancia
      const nuevaMarca = queryRunner.manager.create(Marca, {
        ...rest,
      });

      // Subir la imagen a Cloudinary
      imageUpload = await this.cloudinaryService.uploadFile(
        file,
        CLOUDINARY_CARPETAS.MARCAS,
      );

      // Comprobar si la respuesta es un error
      if ('secure_url' in imageUpload && 'public_id' in imageUpload) {
        // Asignar la URL y publicId de la imagen
        nuevaMarca.imagen_url = imageUpload.secure_url;
        nuevaMarca.public_id = imageUpload.public_id;
      } else {
        throw new Error(
          'Error al subir la imagen a Cloudinary: ' +
            JSON.stringify(imageUpload),
        );
      }

      // Guardar la marca con la URL de la imagen
      await queryRunner.manager.save(nuevaMarca);

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      return nuevaMarca;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Verificar que imageUpload no sea null antes de acceder a public_id
      if (imageUpload && imageUpload.public_id) {
        await this.cloudinaryService.deleteImage(imageUpload.public_id);
      }

      this.logger.error(error);
      throw new InternalServerErrorException('Error al crear la marca', error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<GetMarcasResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [marcas, total] = await this.marcaRepository.findAndCount({
        where: {
          esta_activo: true,
        },
        take: limit,
        skip: offset,
      });

      return {
        marcas,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar las marcas',
        error,
      );
    }
  }

  async findOne(marca_id: string): Promise<MarcaInterface> {
    try {
      const marca = await this.marcaRepository.findOne({
        where: { marca_id, esta_activo: true },
      });

      if (!marca) {
        throw new NotFoundException(
          `No se encontro la marca con el id: ${marca_id}`,
        );
      }

      return marca;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error al buscar la marca', error);
    }
  }

  async findAllByTerm(
    SearchWithPaginationDto: SearchWithPaginationDto,
  ): Promise<Partial<MarcaInterface>[]> {
    const { limit = 10, offset = 0, term } = SearchWithPaginationDto;

    try {
      const queryBuilder = this.marcaRepository
        .createQueryBuilder('marcas')
        .select([
          'marcas.marca_id',
          'marcas.nombre',
          'marcas.marca_destacada',
          'marcas.imagen_url',
        ])
        .where('marcas.esta_activo = :esta_activo', { esta_activo: true })
        .andWhere('(LOWER(marcas.nombre) LIKE LOWER(:term))', {
          term: `%${term}%`,
        })
        .take(limit)
        .skip(offset);

      // Verificar la consulta generada
      // console.log('SQL generada:', queryBuilder.getSql());
      // console.log('Término de búsqueda aplicado:', term);

      const marcas = await queryBuilder.getMany();

      // Aplanar los resultados
      const listaMarcasAplanadas = marcas.map((marca) => ({
        id: marca.marca_id,
        nombre: marca.nombre,
        marca_destacada: marca.marca_destacada,
        imagen_url: marca.imagen_url,
      }));

      return listaMarcasAplanadas;
    } catch (error) {
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        'Error al buscar las marcas por termino',
        error,
      );
    }
  }

  async update(
    marca_id: string,
    updateMarcaDto: UpdateMarcaDto,
    file: Express.Multer.File,
  ): Promise<MarcaInterface> {
    const { ...toUpdate } = updateMarcaDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let imageUpload: CloudinaryResponse | null = null;

    try {
      const marca = await this.findOne(marca_id);

      // Guardar el public_id anterior antes de sobreescribirlo
      const previousPublicId = marca.public_id;

      // Combinar las propiedades del DTO con la entidad existente
      this.marcaRepository.merge(marca, toUpdate);

      if (file) {
        // Subir la nueva imagen a Cloudinary
        imageUpload = await this.cloudinaryService.uploadFile(
          file,
          CLOUDINARY_CARPETAS.MARCAS,
        );
      }

      // Verificar que la imagen se subió correctamente
      if ('secure_url' in imageUpload && 'public_id' in imageUpload) {
        // Asignar la URL y publicId de la imagen
        marca.imagen_url = imageUpload.secure_url;
        marca.public_id = imageUpload.public_id;
      } else {
        // Si falla la subida de la imagen nueva, lanzar error
        throw new Error(
          'Error al subir la imagen a Cloudinary: ' +
            JSON.stringify(imageUpload),
        );
      }

      // Guardar la marca con las actualizaciones y la URL de la imagen si aplica
      await queryRunner.manager.save(marca);

      // Confirmar la transacción si todo salió bien
      await queryRunner.commitTransaction();

      // Intentar eliminar la imagen anterior fuera de la transacción
      if (previousPublicId && previousPublicId !== marca.public_id) {
        try {
          await this.cloudinaryService.deleteImage(previousPublicId);
        } catch (error) {
          // Manejar el error de eliminación de la imagen anterior sin detener la operación
          this.logger.error(
            `Error al eliminar la imagen anterior con public_id ${previousPublicId}: ${error.message}`,
          );
        }
      }

      return marca;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Si la imagen nueva se subió pero falló la transacción, eliminar la nueva imagen
      if (imageUpload && imageUpload.public_id) {
        await this.cloudinaryService.deleteImage(imageUpload.public_id);
      }

      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al actualizar la marca con ID ${marca_id}.`,
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
      const marca = await this.findOne(id);

      // Marcar como inactiva la marca
      marca.esta_activo = false;
      // Guardar en la DB
      await this.marcaRepository.save(marca);
      return {
        mensaje: `La marca con ID ${id} ha sido marcada como inactiva.`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al marcar como inactiva la marca con ID ${id}.`,
        error,
      );
    }
  }

  async activate(id: string): Promise<{
    mensaje: string;
  }> {
    try {
      const marca = await this.marcaRepository.findOne({
        where: { marca_id: id },
      });

      if (!marca) {
        throw new NotFoundException(`No se encontro la marca con el id: ${id}`);
      }

      // Marcar como activa la marca
      marca.esta_activo = true;
      // Guardar en la DB
      await this.marcaRepository.save(marca);
      return {
        mensaje: `La marca con ID ${id} ha sido marcada como activa.`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al marcar como activa la marca con ID ${id}.`,
        error,
      );
    }
  }
}
