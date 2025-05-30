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
import type { EstadoPedido } from './types/estado-pedido.enum';

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un pedido' })
  @Auth() // Para crear un pedido tiene que estar autenticado
  create(
    @Body() createPedidoDto: CreatePedidoDto,
    @GetUser() usuario: Usuario,
  ): Promise<PedidoInterface> {
    return this.pedidosService.create(createPedidoDto, usuario.usuario_id);
  }
  @Post('/adminPedidos')
  @ApiOperation({ summary: 'Crear un pedido' })
  @Auth('admin', 'empleado') // Para crear un pedido tiene que estar autenticado
  createPedido(
    @Query('usuarioId') usuarioId: string,
    @Body() createPedidoDto: CreatePedidoDto,
  ): Promise<PedidoInterface> {
    return this.pedidosService.createPedidoAdmin(createPedidoDto, usuarioId);
  }
  @Get('search')
  @Auth('admin', 'empleado')
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

  @Get('ganancia-dia')
  @Auth('admin')
  @ApiOperation({ summary: 'Ganancia del día' })
  async getGananciaDelDia(): Promise<{ labels: string[]; data: number[] }> {
    return this.pedidosService.obtenerGananciasPorDia();
  }

  @Get('ganancia-mes')
  @Auth('admin')
  @ApiOperation({ summary: 'Ganancia del mes' })
  async getGananciaDelMes(): Promise<{ semana: string; ganancia: number }[]> {
    return this.pedidosService.obtenerGananciasPorSemana();
  }

  @Get('productos-vendidos/:rango')
  @Auth('admin')
  @ApiOperation({ summary: 'Productos más vendidos' })
  async getProductosVendidos(@Param('rango') rango: 'week' | 'month'): Promise<number>{
    return this.pedidosService.obtenerTotalProductosVendidos(rango);
  }

  @Get(':estado')
  @Auth('admin', 'empleado')
  async findPedidosByEstado(
    @Param('estado') estado: EstadoPedido,
    @Query() paginationDto: PaginationDto,
  ): Promise<GetPedidosResponse> {
    return this.pedidosService.findPedidosByEstado(estado, paginationDto);
  }

  @Get()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Buscar todos los pedidos' })
  findAll(@Query() paginationDto: PaginationDto): Promise<GetPedidosResponse> {
    return this.pedidosService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Buscar pedido por id' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PedidoInterface> {
    return this.pedidosService.findOne(id);
  }

  @Patch(':id')
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Actualizar un pedido' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ): Promise<Partial<Pedido>> {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Patch(':id/estado')
  @Auth('admin', 'empleado')
  async updateEstadoPedido(
    @Param('id') id: string,
    @Body() estadoDto: { estado_pedido: EstadoPedido },
  ): Promise<PedidoInterface> {
    return this.pedidosService.updateEstado(id, estadoDto.estado_pedido);
  }

  @Delete(':id')
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Desactivar un pedido' })
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.pedidosService.deactivate(id);
  }

  @Patch('activate/:id')
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Activar un pedido' })
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.pedidosService.activate(id);
  }
}
