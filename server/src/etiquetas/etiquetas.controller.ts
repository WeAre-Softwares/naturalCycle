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
import { EtiquetasService } from './etiquetas.service';
import type { GetEtiquetasResponse, EtiquetaInterface } from './interfaces';
import { CreateEtiquetaDto, UpdateEtiquetaDto } from './dto';
import { PaginationDto, SearchWithPaginationDto } from '../common/dtos';
import { Etiqueta } from './entities/etiqueta.entity';

@ApiTags('Etiquetas')
@Controller('etiquetas')
export class EtiquetasController {
  constructor(private readonly etiquetasService: EtiquetasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva etiqueta' })
  create(
    @Body() createCategoriaDto: CreateEtiquetaDto,
  ): Promise<EtiquetaInterface> {
    return this.etiquetasService.create(createCategoriaDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar etiquetas por término' })
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
  ): Promise<Partial<EtiquetaInterface>[]> {
    return this.etiquetasService.findAllByTerm(searchWithPaginationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todas las etiquetas' })
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetEtiquetasResponse> {
    return this.etiquetasService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una etiqueta por id' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<EtiquetaInterface> {
    return this.etiquetasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una etiqueta' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEtiquetaDto: UpdateEtiquetaDto,
  ): Promise<EtiquetaInterface> {
    return this.etiquetasService.update(id, updateEtiquetaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una etiqueta' })
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ mensaje: string }> {
    return this.etiquetasService.deactivate(id);
  }

  @Patch('activate/:id')
  @ApiOperation({ summary: 'Activar una etiqueta' })
  activate(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ mensaje: string }> {
    return this.etiquetasService.activate(id);
  }
}
