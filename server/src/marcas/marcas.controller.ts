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
} from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { CreateMarcaDto, UpdateMarcaDto } from './dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Marca } from './entities/marca.entity';
import type { GetMarcasResponse } from './interfaces';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Marcas')
@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @Post()
  create(@Body() createMarcaDto: CreateMarcaDto): Promise<Marca> {
    return this.marcasService.create(createMarcaDto);
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
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMarcaDto: UpdateMarcaDto,
  ): Promise<Marca> {
    return this.marcasService.update(id, updateMarcaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.marcasService.remove(id);
  }
}
