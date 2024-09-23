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
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MarcasService } from './marcas.service';
import { CreateMarcaDto, UpdateMarcaDto } from './dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
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

  @Get()
  findAll(@Query() paginationDto: PaginationDto): Promise<GetMarcasResponse> {
    return this.marcasService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Marca> {
    return this.marcasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una nueva marca' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos para actualizar una nueva marca junto con la imagen',
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
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.marcasService.remove(id);
  }
}
