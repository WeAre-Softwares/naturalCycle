import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dto';
import { PaginationDto, SearchWithPaginationDto } from '../common/dtos';
import type {
  GetProductosResponse,
  ProductoPlainResponse,
  ProductoResponse,
} from './interfaces';
import { Auth } from '../auth/decorators';
import { Producto } from './entities/producto.entity';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @ApiBearerAuth()
  @Auth('admin')
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos para crear un nuevo producto junto con las imagenes',
    type: CreateProductoDto,
  })
  @UseInterceptors(FilesInterceptor('imagenes', 2)) // Manejo de archivo de imagen
  create(
    @Body() createProductoDto: CreateProductoDto,
    @UploadedFiles() files: Express.Multer.File[], // Permite múltiples archivos
  ): Promise<ProductoResponse> {
    return this.productosService.create(createProductoDto, files);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar productos por término' })
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
    productos: ProductoPlainResponse[];
    total: number;
    limit: number;
    offset: number;
  }> {
    return this.productosService.findAllByTerm(searchWithPaginationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todos los productos' })
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    return this.productosService.findAll(paginationDto);
  }

  @Get('destacados')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar todos los productos destacados' })
  findAllProductosDestacados(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    return this.productosService.findAllProductosDestacados(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar producto por id' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductoPlainResponse> {
    return this.productosService.getProductoForResponse(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Auth('admin')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos para actualizar un producto junto con las imagenes',
    type: UpdateProductoDto,
  })
  @UseInterceptors(FilesInterceptor('imagenes', 2)) // Se acepta solo dos imagenes
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductoDto: UpdateProductoDto,
    @UploadedFiles() files: Express.Multer.File[], // Manejo de archivo de imagen
  ): Promise<Producto> {
    return this.productosService.update(id, updateProductoDto, files);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Auth('admin')
  @ApiOperation({ summary: 'Desactivar un producto' })
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.productosService.deactivate(id);
  }

  @Patch('activate/:id')
  @ApiBearerAuth()
  @Auth('admin')
  @ApiOperation({ summary: 'Activar un producto' })
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.productosService.activate(id);
  }
}
