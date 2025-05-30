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
    const { limit, offset = 0 } = paginationDto;
    try {
      const [marcas, total] = await this.marcaRepository.findAndCount({
        where: {
          esta_activo: true,
        },
        order: {
          nombre: 'ASC',
        },
        ...(limit ? { take: limit } : {}), // Solo agregar 'take' si 'limit' está definido y es distinto de 0
        skip: offset,
      });

      return {
        marcas,
        total,
        limit: limit ?? total, // Establece 'limit' al total si es indefinido o 0
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

  async findAllInactive(
    paginationDto: PaginationDto,
  ): Promise<GetMarcasResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [marcas, total] = await this.marcaRepository.findAndCount({
        where: { esta_activo: false },
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
        'Error al buscar las marcas inactivas',
        error,
      );
    }
  }

  async findAllMarcasDestacadas(
    paginationDto: PaginationDto,
  ): Promise<GetMarcasResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      // Filtrar solo las marcas destacadas
      const [marcas, total] = await this.marcaRepository.findAndCount({
        where: {
          esta_activo: true,
          marca_destacada: true,
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
        'Error al buscar las marcas destacadas',
        error,
      );
    }
  }

  async findOne(
    marca_id: string,
    esta_activo?: boolean,
  ): Promise<MarcaInterface> {
    try {
      // Construcción dinámica del filtro `where`
      const where: Record<string, any> = { marca_id };
      if (esta_activo !== undefined) {
        where.esta_activo = esta_activo;
      }

      const marca = await this.marcaRepository.findOne({
        where,
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
  ): Promise<{
    marcas: any;
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0, term } = SearchWithPaginationDto;

    try {
      const queryBuilder = this.marcaRepository
        .createQueryBuilder('marcas')
        .select([
          'marcas.marca_id',
          'marcas.nombre',
          'marcas.marca_destacada',
          'marcas.imagen_url',
          'marcas.esta_activo',
        ])
        // .where('marcas.esta_activo = :esta_activo', { esta_activo: true })
        .andWhere(
          'unaccent(LOWER(marcas.nombre)) ILIKE unaccent(LOWER(:term))',
          {
            term: `%${term}%`,
          },
        )
        .take(limit)
        .skip(offset);


      const [marcas, total] = await queryBuilder.getManyAndCount();

      // Aplanar los resultados
      const listaMarcasAplanadas = marcas.map((marca) => ({
        marca_id: marca.marca_id,
        nombre: marca.nombre,
        marca_destacada: marca.marca_destacada,
        imagen_url: marca.imagen_url,
        esta_activo: marca.esta_activo,
      }));

      return {
        marcas: listaMarcasAplanadas,
        total,
        limit,
        offset,
      };
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
    id: string,
    updateMarcaDto: UpdateMarcaDto,
    file: Express.Multer.File | undefined,
  ): Promise<MarcaInterface> {
    const { ...toUpdate } = updateMarcaDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let imageUpload: CloudinaryResponse | null = null;

    try {
      const marca = await this.findOne(id);

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

        // Verificar que la imagen se subió correctamente
        if ('secure_url' in imageUpload && 'public_id' in imageUpload) {
          // Asignar la URL y publicId de la imagen
          marca.imagen_url = imageUpload.secure_url;
          marca.public_id = imageUpload.public_id;
        } else {
          throw new Error(
            'Error al subir la imagen a Cloudinary: ' +
              JSON.stringify(imageUpload),
          );
        }
      }

      // Guardar la marca con las actualizaciones y la URL de la imagen si aplica
      await queryRunner.manager.save(marca);

      await queryRunner.commitTransaction();

      // Intentar eliminar la imagen anterior solo si se subió una nueva y es diferente
      if (file && previousPublicId && previousPublicId !== marca.public_id) {
        try {
          await this.cloudinaryService.deleteImage(previousPublicId);
        } catch (error) {
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
        `Error al actualizar la marca con ID ${id}.`,
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
