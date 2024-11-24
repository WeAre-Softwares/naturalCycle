import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto';
import { SearchWithPaginationDto, PaginationDto } from '../common/dtos';
import type { CategoriaInterface, GetCategoriasResponse } from './interfaces';

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger('CategoriaService');
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<CategoriaInterface> {
    const { ...rest } = createCategoriaDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear la instancia
      const categoria = queryRunner.manager.create(Categoria, {
        ...rest,
      });

      // Guardar la categoria en la DB
      await queryRunner.manager.save(categoria);

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      return categoria;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al crear la categoria',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<GetCategoriasResponse> {
    const { limit, offset = 0 } = paginationDto;
    try {
      const [categorias, total] = await this.categoriaRepository.findAndCount({
        where: {
          esta_activo: true,
        },
        order: {
          nombre: 'ASC',
        },
        skip: offset,
        ...(limit ? { take: limit } : {}), // Solo agregar 'take' si 'limit' está definido y es distinto de 0
      });

      return {
        categorias,
        total,
        limit: limit ?? total, // Establece 'limit' al total si es indefinido o 0
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar las categorías',
        error,
      );
    }
  }

  async findAllInactive(
    paginationDto: PaginationDto,
  ): Promise<GetCategoriasResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [categorias, total] = await this.categoriaRepository.findAndCount({
        where: { esta_activo: false },
        take: limit,
        skip: offset,
      });

      return {
        categorias,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar las categorías inactivas',
        error,
      );
    }
  }

  async findOne(
    id: string,
    esta_activo?: boolean,
  ): Promise<CategoriaInterface> {
    try {
      // Construcción dinámica del filtro `where`
      const where: Record<string, any> = { categoria_id: id };
      if (esta_activo !== undefined) {
        where.esta_activo = esta_activo;
      }

      const categoria = await this.categoriaRepository.findOne({ where });

      if (!categoria) {
        throw new NotFoundException(
          `No se encontró la categoría con el id: ${id}`,
        );
      }

      return categoria;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar la categoría',
        error,
      );
    }
  }

  async findAllByTerm(
    SearchWithPaginationDto: SearchWithPaginationDto,
  ): Promise<{
    categorias: any;
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0, term } = SearchWithPaginationDto;

    try {
      const queryBuilder = this.categoriaRepository
        .createQueryBuilder('categorias')
        .select([
          'categorias.categoria_id',
          'categorias.nombre',
          'categorias.esta_activo',
        ])
        // .where('categorias.esta_activo = :esta_activo', { esta_activo: true })
        .andWhere('(LOWER(categorias.nombre) LIKE LOWER(:term))', {
          term: `%${term}%`,
        })
        .take(limit)
        .skip(offset);

      const [categorias, total] = await queryBuilder.getManyAndCount();

      // Aplanar los resultados
      const listaCategoriasAplanadas = categorias.map((categoria) => ({
        categoria_id: categoria.categoria_id,
        nombre: categoria.nombre,
        esta_activo: categoria.esta_activo,
      }));

      return {
        categorias: listaCategoriasAplanadas,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        'Error al buscar las categorías por termino',
        error,
      );
    }
  }

  async update(
    id: string,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<CategoriaInterface> {
    const { ...toUpdate } = updateCategoriaDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const categoria = await this.findOne(id);

      // Combinar las propiedades del DTO con la entidad existente
      this.categoriaRepository.merge(categoria, toUpdate);

      // Guardar la categoria en la DB
      await queryRunner.manager.save(categoria);

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      return categoria;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al actualizar la categoria',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deactivate(id: string): Promise<{ mensaje: string }> {
    try {
      const categoria = await this.findOne(id);

      // Marcar como inactiva la categoria
      categoria.esta_activo = false;
      // Guardar en la DB
      await this.categoriaRepository.save(categoria);
      return {
        mensaje: `La categoría con ID ${id} ha sido marcada como inactiva.`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al marcar como inactiva la categoría con ID ${id}.`,
        error,
      );
    }
  }

  async activate(id: string): Promise<{ mensaje: string }> {
    try {
      const categoria = await this.categoriaRepository.findOne({
        where: { categoria_id: id },
      });

      if (!categoria) {
        throw new NotFoundException(
          `No se encontro la categoría con el id: ${id}`,
        );
      }

      // Marcar como activa la categoria
      categoria.esta_activo = true;
      // Guardar en la DB
      await this.categoriaRepository.save(categoria);
      return {
        mensaje: `La categoría con ID ${id} ha sido marcada como activa.`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al marcar como activa la categoría con ID ${id}.`,
        error,
      );
    }
  }
}
