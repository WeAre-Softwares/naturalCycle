import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MarcasService } from './marcas.service';
import { CreateMarcaDto, UpdateMarcaDto } from './dto';
import { PaginationDto, SearchWithPaginationDto } from '../common/dtos';
import { Marca } from './entities/marca.entity';
import type { GetMarcasResponse } from './interfaces';

@ApiTags('Marcas')
@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva marca' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos para crear una nueva marca junto con la imagen',
    type: CreateMarcaDto,
  })
  @UseInterceptors(FileInterceptor('image')) // Se acepta solo una imagen
  create(
    @Body() createMarcaDto: CreateMarcaDto,
    @UploadedFile() file: Express.Multer.File, // Manejo de archivo de imagen
  ): Promise<Marca> {
    return this.marcasService.create(createMarcaDto, file);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar marcas por término' })
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
  async findByTerm(@Query() searchWithPaginationDto: SearchWithPaginationDto) {
    return this.marcasService.findAllByTerm(searchWithPaginationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todas las marcas' })
  findAll(@Query() paginationDto: PaginationDto): Promise<GetMarcasResponse> {
    return this.marcasService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar marca por id' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Marca> {
    return this.marcasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una marca' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos para actualizar una marca junto con la imagen',
    type: CreateMarcaDto,
  })
  @UseInterceptors(FileInterceptor('image')) // Se acepta solo una imagen
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMarcaDto: UpdateMarcaDto,
    @UploadedFile() file: Express.Multer.File, // Manejo de archivo de imagen
  ): Promise<Marca> {
    return this.marcasService.update(id, updateMarcaDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una marca' })
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.marcasService.deactivate(id);
  }

  @Patch('activate/:id')
  @ApiOperation({ summary: 'Activar una marca' })
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.marcasService.activate(id);
  }
}
