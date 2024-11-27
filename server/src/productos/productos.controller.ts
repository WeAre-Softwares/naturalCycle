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
import { CreateProductoDto, UpdateProductoDto, CategoryFilterDto } from './dto';
import { PaginationDto, SearchWithPaginationDto } from '../common/dtos';
import type {
  GetProductosResponse,
  ProductoPlainResponse,
  ProductoResponse,
} from './interfaces';
import { Auth } from '../auth/decorators';
import { Producto } from './entities/producto.entity';
import { validate as isUUID } from 'uuid';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  private createFilterDto(filter: string): CategoryFilterDto {
    const filterDto = new CategoryFilterDto();
    if (isUUID(filter)) {
      filterDto.id = filter;
    } else {
      filterDto.nombre = filter;
    }
    return filterDto;
  }

  @Post()
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
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

  @Get('/inactivos')
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Buscar todas los productos inactivos' })
  findAllInactive(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    return this.productosService.findAllInactive(paginationDto);
  }

  @Get('/nuevos-ingresos')
  @ApiOperation({ summary: 'Buscar todos los nuevos ingresos de productos' })
  findNewArrivalProducts(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    return this.productosService.findNewArrivalProducts(paginationDto);
  }

  @Get('/productos-promocion')
  @ApiOperation({ summary: 'Buscar todos los productos en promoción' })
  findPromotionalProducts(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    return this.productosService.findPromotionalProducts(paginationDto);
  }

  @Get('/marca/:filter')
  @ApiOperation({ summary: 'Buscar productos por marca' })
  findByBrand(
    @Param('filter') filter: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    // Determina si el filtro es un UUID o un nombre de categoría
    const filterDto = this.createFilterDto(filter);
    return this.productosService.findProductsByBrand(filterDto, paginationDto);
  }

  @Get('/categoria/:filter')
  @ApiOperation({ summary: 'Buscar productos por categoria' })
  findByCategory(
    @Param('filter') filter: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    // Determina si el filtro es un UUID o un nombre de categoría
    const filterDto = this.createFilterDto(filter);

    return this.productosService.findProductsByCategory(
      filterDto,
      paginationDto,
    );
  }

  @Get('destacados')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar todos los productos destacados' })
  findAllProductosDestacados(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    return this.productosService.findAllProductosDestacados(paginationDto);
  }

  @Get('bultocerrado')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar todos los productos por bulto cerrado' })
  findBultoCerradoProducts(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    return this.productosService.findBultoCerradoProducts(paginationDto);
  }

  @Get('sinstock')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar todos los productos sin stock' })
  findProductsSinStock(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetProductosResponse> {
    return this.productosService.findProductsSinStock(paginationDto);
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
  @Auth('admin', 'empleado')
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
  ): Promise<Partial<Producto>> {
    return this.productosService.update(id, updateProductoDto, files);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Desactivar un producto' })
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.productosService.deactivate(id);
  }

  @Patch('activate/:id')
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Activar un producto' })
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.productosService.activate(id);
  }
}
