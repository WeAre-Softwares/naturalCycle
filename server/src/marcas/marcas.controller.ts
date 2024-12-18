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
  ApiBearerAuth,
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
import type { GetMarcasResponse, MarcaInterface } from './interfaces';
import { Auth } from '../auth/decorators';

@ApiTags('Marcas')
@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @Post()
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Crear una nueva marca' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos para crear una nueva marca junto con la imagen',
    type: CreateMarcaDto,
  })
  @UseInterceptors(FileInterceptor('imagen')) // Se acepta solo una imagen
  create(
    @Body() createMarcaDto: CreateMarcaDto,
    @UploadedFile() file: Express.Multer.File, // Manejo de archivo de imagen
  ): Promise<MarcaInterface> {
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
  async findByTerm(
    @Query() searchWithPaginationDto: SearchWithPaginationDto,
  ): Promise<{
    marcas: any;
    total: number;
    limit: number;
    offset: number;
  }> {
    return this.marcasService.findAllByTerm(searchWithPaginationDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar todas las marcas' })
  findAll(@Query() paginationDto: PaginationDto): Promise<GetMarcasResponse> {
    return this.marcasService.findAll(paginationDto);
  }

  @Get('/inactivos')
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Buscar todas las marcas inactivas' })
  findAllInactive(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetMarcasResponse> {
    return this.marcasService.findAllInactive(paginationDto);
  }

  @Get('/destacadas')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar todas las marcas destacadas' })
  findAllMarcasDestacadas(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetMarcasResponse> {
    return this.marcasService.findAllMarcasDestacadas(paginationDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar marca por id' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<MarcaInterface> {
    return this.marcasService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Actualizar una marca' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos para actualizar una marca junto con la imagen',
    type: CreateMarcaDto,
  })
  @UseInterceptors(FileInterceptor('imagen')) // Se acepta solo una imagen
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMarcaDto: UpdateMarcaDto,
    @UploadedFile() file: Express.Multer.File, // Manejo de archivo de imagen
  ): Promise<MarcaInterface> {
    return this.marcasService.update(id, updateMarcaDto, file);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Desactivar una marca' })
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.marcasService.deactivate(id);
  }

  @Patch('activate/:id')
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Activar una marca' })
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.marcasService.activate(id);
  }
}
