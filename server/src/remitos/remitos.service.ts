import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
const PDFDocument = require('pdfkit-table');
import { PedidosService } from '../pedidos/pedidos.service';
import { Remito } from './entities/remito.entity';
import { CreateRemitoDto } from './dto';
import { EstadoPedido } from '../pedidos/types/estado-pedido.enum';
import type { GetAllRemitosResponse } from './interfaces';
import { PaginationDto } from '../common/dtos';
import { VENDEDOR_INFO } from './constants/vendedor-info.constant';
import { DetallesPedidosService } from '../detalles_pedidos/detalles_pedidos.service';
import type { DetallesPedido } from 'src/detalles_pedidos/entities/detalles_pedido.entity';

@Injectable()
export class RemitosService {
  private readonly logger = new Logger('RemitoService');
  constructor(
    @InjectRepository(Remito)
    private readonly remitoRepository: Repository<Remito>,
    private readonly pedidoService: PedidosService,
    private readonly detallesPedidosService: DetallesPedidosService,
    private readonly dataSource: DataSource,
  ) {}

  async crearRemitoPdf(pedidoId: string): Promise<Buffer> {
    // 1. Verificar si el pedido existe
    const pedido = await this.pedidoService.findOne(pedidoId);

    // 2. Verificar si el estado del pedido permite generar un remito
    const estadosValidos = [EstadoPedido.aprobado, EstadoPedido.enviado];
    if (!estadosValidos.includes(pedido.estado_pedido)) {
      throw new BadRequestException(
        `El pedido con ID ${pedidoId} no tiene un estado válido para generar un remito. Estado actual: ${pedido.estado_pedido}`,
      );
    }

    // 3. Buscar si ya existe un remito para el pedido
    const remito = await this.findOneByPedidoId(pedidoId);

    // 4. Generar el PDF con los datos del remito o pedido
    return this.generarPDF(remito);
  }

  async create(createRemitoDto: CreateRemitoDto): Promise<Remito> {
    // Crear una nueva instancia de Remito
    const remito = this.remitoRepository.create(createRemitoDto);

    // Guardar el remito en la base de datos
    return await this.remitoRepository.save(remito);
  }

  async findAll(paginationDto: PaginationDto): Promise<GetAllRemitosResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [remitos, total] = await this.remitoRepository.findAndCount({
        take: limit,
        skip: offset,
      });

      return {
        remitos,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar los remitos',
        error,
      );
    }
  }

  async findOne(id: string): Promise<Remito> {
    try {
      const remito = await this.remitoRepository.findOne({
        where: {
          remito_id: id,
        },
      });

      if (!remito) {
        throw new NotFoundException(
          `No se encontro el remito con el id: ${id}`,
        );
      }

      return remito;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar el remito',
        error,
      );
    }
  }

  async findOneByPedidoId(pedidoId: string): Promise<Remito> {
    try {
      const remito = await this.remitoRepository.findOne({
        where: {
          pedido: { pedido_id: pedidoId },
        },
        relations: ['pedido'],
      });

      if (!remito) {
        throw new NotFoundException(
          `No se encontró un remito para el pedido con id: ${pedidoId}`,
        );
      }

      return remito;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(
        'Error al buscar el remito',
        error.message,
      );
    }
  }

  async generarPDF(remito: Remito): Promise<Buffer> {
    const detallesPedido = await this.detallesPedidosService.findOneByPedidoId(
      remito.pedido.pedido_id,
    );

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
        autoFirstPage: true,
        margins: { top: 50, left: 50, right: 50, bottom: 50 },
      });

      let pageNumber = 0;

      // Manejar la numeración de páginas
      doc.on('pageAdded', () => {
        pageNumber++;
        const bottomMargin = doc.page.margins.bottom;

        if (pageNumber > 1) {
          // Línea de separación para las páginas
          doc
            .moveTo(50, 55)
            .lineTo(doc.page.width - 50, 55)
            .stroke();
        }

        // Numeración de páginas al pie
        doc.page.margins.bottom = 0;
        doc.font('Helvetica').fontSize(10);
        doc.text(
          `Pág. ${pageNumber}`,
          0.5 * (doc.page.width - 100),
          doc.page.height - 50,
          {
            width: 100,
            align: 'center',
            lineBreak: false,
          },
        );
        doc.page.margins.bottom = bottomMargin;
      });

      // Página principal
      this.agregarEncabezado(doc, remito);
      this.agregarInfoClienteYVendedor(doc, remito);
      //TODO: FIX
      this.agregarTablaProductos(doc, detallesPedido);
      this.agregarTotales(doc, remito.pedido.pedido_id);

      // Convertir el contenido a un buffer
      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });

      doc.end();
    });

    return pdfBuffer;
  }

  private agregarEncabezado(doc: PDFKit.PDFDocument, remito: Remito) {
    // Ajuste del encabezado NATURAL CYCLE y MAYORISTA
    doc
      .font('Helvetica-Bold')
      .fontSize(26)
      .fillColor('#008000') // Verde para NATURAL CYCLE
      .text('NATURAL CYCLE', 50, 50, { align: 'left' });

    doc
      .fontSize(12)
      .fillColor('gray') // Color gris para MAYORISTA
      .text('MAYORISTA', { align: 'left' });

    doc
      .moveDown(0.5)
      .fontSize(11)
      .text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'left' });

    // Ajuste del título REMITO
    doc
      .font('Helvetica-Bold')
      .fontSize(28)
      .fillColor('black')
      .text('REMITO', 0, 50, { align: 'right' });

    doc.fontSize(12).text(`PEDIDO N° ${remito.remito_id}`, { align: 'right' });

    // Línea separadora
    doc
      .moveTo(50, 150)
      .lineTo(doc.page.width - 50, 150)
      .lineWidth(2) // Línea más gruesa
      .stroke();
  }

  private agregarInfoClienteYVendedor(doc: PDFKit.PDFDocument, remito: Remito) {
    // Información del cliente
    doc
      .moveDown(0.5)
      .font('Helvetica-Bold')
      .fontSize(14)
      .fillColor('#008000') // Verde suave para el encabezado de CLIENTE
      .text('CLIENTE', 50, 180);

    doc
      .font('Helvetica-Bold')
      .fontSize(16)
      .fillColor('black')
      .text(remito.nombre_comprador, { align: 'left' });

    doc
      .fontSize(10)
      //TODO: Add campo
      // .text('Dueño | DIETÉTICA GONZALES')
      .text(`DNI: ${remito.dni_comprador}`)
      .text(`Domicilio: ${remito.domicilio_comprador}`);

    // Información del vendedor
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .fillColor('#008000')
      .text('VENDEDOR', 350, 180); // Alineado hacia la derecha

    doc
      .font('Helvetica-Bold')
      .fontSize(16)
      .fillColor('black')
      .text(VENDEDOR_INFO.nombre, { align: 'left' });

    doc
      .fontSize(10)
      .text('Dueño | NATURAL CYCLE')
      .text(`DNI: ${VENDEDOR_INFO.dni}`)
      .text(`Domicilio: ${VENDEDOR_INFO.domicilio}.`);

    // Línea separadora
    doc
      .moveTo(50, 250)
      .lineTo(doc.page.width - 50, 250)
      .lineWidth(2)
      .stroke();
  }

  //TODO: FIX
  private agregarTablaProductos(
    doc: PDFKit.PDFDocument,
    detalle: DetallesPedido | null, // Permitir que detalle sea null
  ) {
    // Comprobar si detalle es null
    if (!detalle) {
      console.error('No se encontró el detalle del pedido.');
      return; // O maneja el error de otra manera según tu lógica
    }

    const headers = ['#', 'DESCRIPCIÓN', 'PRECIO', 'CANTIDAD', 'TOTAL'];
    const columnWidths = [50, 250, 100, 100, 100];
    let y = 270;

    // **Encabezados de la tabla**
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .rect(50, y, doc.page.width - 100, 20)
      .fill('#333');

    headers.forEach((header, i) => {
      doc.fillColor('white');
      doc.text(
        header,
        50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y + 5,
        { width: columnWidths[i], align: 'center' },
      );
    });

    y += 20;

    // **Fila única de la tabla**
    const { producto, cantidad } = detalle; // Esto ya no fallará si detalle es null
    const total = Number(detalle.total_precio); // Cambiado a Number

    const row = [
      '1', // Índice (siempre 1)
      producto.nombre,
      `$${Number(producto.precio).toFixed(2)}`, // Cambiado a Number
      cantidad.toString(),
      `$${total.toFixed(2)}`, // El total también se cambia a Number
    ];

    row.forEach((cell, i) => {
      doc.fillColor('black');
      doc.text(
        cell,
        50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y + 5,
        { width: columnWidths[i], align: 'center' },
      );
    });
  }

  //TODO: FIX
  private async agregarTotales(
    doc: PDFKit.PDFDocument,
    pedidoId: string,
  ): Promise<void> {
    const detallePedido =
      await this.detallesPedidosService.findOneByPedidoId(pedidoId);

    const total = Number(detallePedido.total_precio); // Cambiado a Number

    const y = doc.y + 30;
    const width = doc.page.width - 100;
    const height = 40; // Sección más pequeña
    const startX = 50;
    const startY = y;

    doc.rect(startX, startY, width, height).fill('#f0f0f0'); // Fondo claro

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('black')
      .text('TOTAL:', startX + 10, startY + 10)
      .text(
        `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        startX + width - 70,
        startY + 10,
        {
          align: 'right',
        },
      );

    doc
      .moveTo(startX, startY + height - 1)
      .lineTo(startX + width, startY + height - 1)
      .lineWidth(1.5)
      .stroke('black'); // Cambiar st a stroke
  }
}
