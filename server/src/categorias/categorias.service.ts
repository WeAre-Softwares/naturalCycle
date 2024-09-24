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
import type { GetCategoriasResponse } from './interfaces';

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger('CategoriaService');
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
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
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [categorias, total] = await this.categoriaRepository.findAndCount({
        where: {
          esta_activo: true,
        },
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
        'Error al buscar las categorías',
        error,
      );
    }
  }

  async findOne(id: string) {
    try {
      const categoria = await this.categoriaRepository.findOne({
        where: {
          categoria_id: id,
          esta_activo: true,
        },
      });

      if (!categoria) {
        throw new NotFoundException(
          `No se encontro la categoria con el id: ${id}`,
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

  async findAllByTerm(SearchWithPaginationDto: SearchWithPaginationDto) {
    const { limit = 10, offset = 0, term } = SearchWithPaginationDto;

    try {
      const queryBuilder = this.categoriaRepository
        .createQueryBuilder('categorias')
        .select(['categorias.categoria_id', 'categorias.nombre'])
        .where('categorias.esta_activo = :esta_activo', { esta_activo: true })
        .andWhere('(LOWER(categorias.nombre) LIKE LOWER(:term))', {
          term: `%${term}%`,
        })
        .take(limit)
        .skip(offset);

      const categorias = await queryBuilder.getMany();

      // Aplanar los resultados
      const listaCategoriasAplanadas = categorias.map((categoria) => ({
        id: categoria.categoria_id,
        nombre: categoria.nombre,
      }));

      return listaCategoriasAplanadas;
    } catch (error) {
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        'Error al buscar las categorías por termino',
        error,
      );
    }
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
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

  async deactivate(id: string) {
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

  async activate(id: string) {
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
