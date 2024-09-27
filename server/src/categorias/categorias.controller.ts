import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto';
import { SearchWithPaginationDto, PaginationDto } from '../common/dtos';
import type { CategoriaInterface, GetCategoriasResponse } from './interfaces';

@ApiTags('Categorías')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  create(
    @Body() createCategoriaDto: CreateCategoriaDto,
  ): Promise<CategoriaInterface> {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar categorías por término' })
  @ApiQuery({
    name: 'term',
    required: false,
    description: 'Término de búsqueda',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Límite de resultados',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Desplazamiento de resultados',
  })
  async findByTerm(
    @Query() searchWithPaginationDto: SearchWithPaginationDto,
  ): Promise<Partial<CategoriaInterface>[]> {
    return this.categoriasService.findAllByTerm(searchWithPaginationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todas las categorías' })
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetCategoriasResponse> {
    return this.categoriasService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una categoría por id' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CategoriaInterface> {
    return this.categoriasService.findOne(id);
  }

  // FIXME:
  // @Patch(':id')
  // @ApiOperation({ summary: 'Actualizar una categoría' })
  // update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateCategoriaDto: UpdateCategoriaDto,
  // ): Promise<CategoriaInterface> {
  //   return this.categoriasService.update(id, updateCategoriaDto);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una categoría' })
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ mensaje: string }> {
    return this.categoriasService.deactivate(id);
  }

  @Patch('activate/:id')
  @ApiOperation({ summary: 'Activar una categoría' })
  activate(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ mensaje: string }> {
    return this.categoriasService.activate(id);
  }
}
