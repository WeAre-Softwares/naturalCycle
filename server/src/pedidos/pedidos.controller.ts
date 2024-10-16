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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Pedido } from './entities/pedido.entity';
import { Auth, GetUser } from '../auth/decorators';
import { CreatePedidoDto, UpdatePedidoDto } from './dto';
import { PaginationDto, SearchWithPaginationDto } from '../common/dtos';
import { PedidoInterface, GetPedidosResponse } from './interfaces';

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un pedido' })
  @Auth() // Para crear un pedido tiene que esta autenticado
  create(
    @Body() createPedidoDto: CreatePedidoDto,
    @GetUser() usuario: Usuario,
  ): Promise<PedidoInterface> {
    return this.pedidosService.create(createPedidoDto, usuario.usuario_id);
  }

  @Get('search')
  @Auth('admin')
  @ApiOperation({ summary: 'Buscar pedidos por término' })
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
  ): Promise<Partial<PedidoInterface>[]> {
    return this.pedidosService.findAllByTerm(searchWithPaginationDto);
  }

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: 'Buscar todos los pedidos' })
  findAll(@Query() paginationDto: PaginationDto): Promise<GetPedidosResponse> {
    return this.pedidosService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Buscar pedido por id' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PedidoInterface> {
    return this.pedidosService.findOne(id);
  }

  @Patch(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Actualizar un pedido' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ): Promise<Partial<Pedido>> {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Desactivar un pedido' })
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.pedidosService.deactivate(id);
  }

  @Patch('activate/:id')
  @Auth('admin')
  @ApiOperation({ summary: 'Activar un pedido' })
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.pedidosService.activate(id);
  }
}
