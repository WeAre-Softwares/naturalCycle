import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Etiqueta } from './entities/etiqueta.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../categorias/dto';
import { PaginationDto, SearchWithPaginationDto } from 'src/common/dtos';
import type { GetEtiquetasResponse } from './interfaces/get-etiquetas-response.interface';
import type { EtiquetaInterface } from './interfaces';
import e from 'express';

@Injectable()
export class EtiquetasService {
  private readonly logger = new Logger('EtiquetasService');
  constructor(
    @InjectRepository(Etiqueta)
    private readonly etiquetaRepository: Repository<Etiqueta>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<EtiquetaInterface> {
    const { ...rest } = createCategoriaDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear la instancia
      const etiqueta = queryRunner.manager.create(Etiqueta, {
        ...rest,
      });

      // Guardar la etiqueta en la DB
      await queryRunner.manager.save(etiqueta);

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      return etiqueta;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al crear la etiqueta',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<GetEtiquetasResponse> {
    const { limit, offset = 0 } = paginationDto;
    try {
      const [etiquetas, total] = await this.etiquetaRepository.findAndCount({
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
        etiquetas,
        total,
        limit: limit ?? total, // Establece 'limit' al total si es indefinido o 0
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar las etiquetas',
        error,
      );
    }
  }

  async findAllInactive(
    paginationDto: PaginationDto,
  ): Promise<GetEtiquetasResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [etiquetas, total] = await this.etiquetaRepository.findAndCount({
        where: { esta_activo: false },
        take: limit,
        skip: offset,
      });

      return {
        etiquetas,
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

  async findOne(id: string, esta_activo?: boolean): Promise<EtiquetaInterface> {
    try {
      // Construcción dinámica del filtro `where`
      const where: Record<string, any> = { etiqueta_id: id };
      if (esta_activo !== undefined) {
        where.esta_activo = esta_activo;
      }

      const etiqueta = await this.etiquetaRepository.findOne({
        where,
      });

      if (!etiqueta) {
        throw new NotFoundException(
          `No se encontro la etiqueta con el id: ${id}`,
        );
      }

      return etiqueta;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar la etiqueta',
        error,
      );
    }
  }

  async findAllByTerm(
    SearchWithPaginationDto: SearchWithPaginationDto,
  ): Promise<{
    etiquetas: any;
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0, term } = SearchWithPaginationDto;

    try {
      const queryBuilder = this.etiquetaRepository
        .createQueryBuilder('etiquetas')
        .select([
          'etiquetas.etiqueta_id',
          'etiquetas.nombre',
          'etiquetas.esta_activo',
        ])
        // .where('etiquetas.esta_activo = :esta_activo', { esta_activo: true })
        .andWhere(
          'unaccent(LOWER(etiquetas.nombre)) ILIKE unaccent(LOWER(:term))',
          {
            term: `%${term}%`,
          },
        )
        .take(limit)
        .skip(offset);

      const [etiquetas, total] = await queryBuilder.getManyAndCount();

      // Aplanar los resultados
      const listaEtiquetasAplanadas = etiquetas.map((etiqueta) => ({
        etiqueta_id: etiqueta.etiqueta_id,
        nombre: etiqueta.nombre,
        esta_activo: etiqueta.esta_activo,
      }));

      return {
        etiquetas: listaEtiquetasAplanadas,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        'Error al buscar las etiquetas por termino',
        error,
      );
    }
  }

  async update(
    id: string,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<EtiquetaInterface> {
    const { ...toUpdate } = updateCategoriaDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const etiqueta = await this.findOne(id);

      // Combinar las propiedades del DTO con la entidad existente
      this.etiquetaRepository.merge(etiqueta, toUpdate);

      // Guardar la Etiqueta en la DB
      await queryRunner.manager.save(etiqueta);

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      return etiqueta;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al actualizar la etiqueta',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deactivate(id: string): Promise<{ mensaje: string }> {
    try {
      const etiqueta = await this.findOne(id);

      // Marcar como inactiva la etiqueta
      etiqueta.esta_activo = false;
      // Guardar en la DB
      await this.etiquetaRepository.save(etiqueta);
      return {
        mensaje: `La etiqueta con ID ${id} ha sido marcada como inactiva.`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al marcar como inactiva la etiqueta con ID ${id}.`,
        error,
      );
    }
  }

  async activate(id: string): Promise<{ mensaje: string }> {
    try {
      const etiqueta = await this.etiquetaRepository.findOne({
        where: { etiqueta_id: id },
      });

      if (!etiqueta) {
        throw new NotFoundException(
          `No se encontro la etiqueta con el id: ${id}`,
        );
      }

      // Marcar como activa la etiqueta
      etiqueta.esta_activo = true;
      // Guardar en la DB
      await this.etiquetaRepository.save(etiqueta);
      return {
        mensaje: `La etiqueta con ID ${id} ha sido marcada como activa.`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al marcar como activa la etiqueta con ID ${id}.`,
        error,
      );
    }
  }
}
