import { Injectable } from '@nestjs/common';
import { CreateDetallesPedidoDto } from './dto/create-detalles_pedido.dto';
import { UpdateDetallesPedidoDto } from './dto/update-detalles_pedido.dto';

@Injectable()
export class DetallesPedidosService {
  create(createDetallesPedidoDto: CreateDetallesPedidoDto) {
    return 'This action adds a new detallesPedido';
  }

  findAll() {
    return `This action returns all detallesPedidos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detallesPedido`;
  }

  update(id: number, updateDetallesPedidoDto: UpdateDetallesPedidoDto) {
    return `This action updates a #${id} detallesPedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} detallesPedido`;
  }
}
