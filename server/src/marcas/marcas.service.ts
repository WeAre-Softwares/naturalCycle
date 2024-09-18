import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateMarcaDto, UpdateMarcaDto } from './dto';
import { Marca } from './entities/marca.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import type { GetMarcasResponse } from './interfaces';

@Injectable()
export class MarcasService {
  private readonly logger = new Logger('MarcasService');

  constructor(
    @InjectRepository(Marca)
    private readonly marcaRepository: Repository<Marca>,
    private readonly dataSource: DataSource,
  ) {}

  //TODO: Integrar servicio de Cloundinary
  async create(createMarcaDto: CreateMarcaDto): Promise<Marca> {
    // const { imagen_url, public_id, ...rest } = createMarcaDto;
    const { ...rest } = createMarcaDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Creo la instancia
      const nuevaMarca = queryRunner.manager.create(Marca, {
        ...rest,
      });

      // Guardo la nueva marca
      await queryRunner.manager.save(nuevaMarca);
      // Confirmo la transacción
      await queryRunner.commitTransaction();

      return nuevaMarca;
    } catch (error) {
      await queryRunner.rollbackTransaction();
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

  async findOne(marca_id: string): Promise<Marca> {
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

  //TODO: Integrar servicio de Cloundinary
  async update(
    marca_id: string,
    updateMarcaDto: UpdateMarcaDto,
  ): Promise<Marca> {
    // const { imagen_url, public_id, ...rest } = createMarcaDto;
    const { ...toUpdate } = updateMarcaDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const marca = await this.findOne(marca_id);

      // Combinar las propiedades del DTO con la entidad existente
      this.marcaRepository.merge(marca, toUpdate);

      // Guardo la Marca actualizada en la DB
      await queryRunner.manager.save(marca);

      // Confirmo la transacción
      await queryRunner.commitTransaction();

      return marca;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al actualizar la marca con ID ${marca_id}.`,
        error,
      );
    }
  }

  async remove(id: string) {
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
}
