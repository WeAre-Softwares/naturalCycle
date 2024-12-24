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
import { EstadoPedido } from '../pedidos/types/estado-pedido.enum';
import type { GetAllRemitosResponse } from './interfaces';
import { PaginationDto } from '../common/dtos';
import { VENDEDOR_INFO } from './constants/vendedor-info.constant';
import { DetallesPedidosService } from '../detalles_pedidos/detalles_pedidos.service';
import { DetallesPedido } from '../detalles_pedidos/entities/detalles_pedido.entity';

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
    const estadosValidos = [
      EstadoPedido.aprobado,
      EstadoPedido.enviado,
      EstadoPedido.recibido,
    ];
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
    const detallesPedido = await this.detallesPedidosService.findByPedidoId(
      remito.pedido.pedido_id,
    );

    // Calcular el total a partir de los detalles del pedido
    const totalCalculado = detallesPedido.reduce((total, detalle) => {
      return total + detalle.precio_unitario * detalle.cantidad;
    }, 0);

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
      this.agregarTablaProductos(doc, detallesPedido);
      this.agregarTotales(doc, totalCalculado);

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
    const fechaFormateada = new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Argentina/Buenos_Aires',
    }).format(new Date());

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
      .text(`Fecha: ${fechaFormateada}`, { align: 'left' });

    // Ajuste del título REMITO
    doc
      .font('Helvetica-Bold')
      .fontSize(28)
      .fillColor('black')
      .text('REMITO', 0, 50, { align: 'right' });

    doc.fontSize(12).text(`ID PEDIDO: ${remito.remito_id}`, { align: 'right' });

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
      .text(`Dueño | ${remito.nombre_comercio_comprador}`)
      .text(`CUIT: ${remito.dni_comprador}`)
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
      .text(`CUIT: ${VENDEDOR_INFO.cuit}`)
      .text(`Domicilio: ${VENDEDOR_INFO.domicilio}.`);

    // Línea separadora
    doc
      .moveTo(50, 250)
      .lineTo(doc.page.width - 50, 250)
      .lineWidth(2)
      .stroke();
  }

  private agregarTablaProductos(
    doc: PDFKit.PDFDocument,
    detallesPedido: DetallesPedido[],
  ) {
    if (!detallesPedido || detallesPedido.length === 0) {
      console.error('No se encontraron productos en el detalle del pedido.');
      return;
    }

    const headers = ['#', 'DESCRIPCIÓN', 'PRECIO', 'CANTIDAD', 'SUBTOTAL'];
    const columnWidths = [50, 200, 80, 80, 100]; // Ajustar ancho para descripción
    let y = 270; // Posición inicial después del encabezado de la tabla
    const rowHeight = 30; // Altura de fila aumentada para mayor separación
    const pageBottomMargin = 50; // Margen inferior de la página
    const availableHeight = doc.page.height - pageBottomMargin;

    // Dibujar encabezados de la tabla
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .rect(50, y, doc.page.width - 100, rowHeight)
      .fill('#333');

    headers.forEach((header, i) => {
      doc.fillColor('white');
      doc.text(
        header,
        50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y + 8,
        { width: columnWidths[i], align: 'center' },
      );
    });

    y += rowHeight;

    // Dibujar filas de productos
    detallesPedido.forEach((detalle, index) => {
      const { producto, cantidad } = detalle;
      const total = Number(detalle.total_precio);

      // Verificar si queda espacio suficiente para la fila, si no, crear nueva página
      if (y + rowHeight > availableHeight) {
        doc.addPage();
        y = 50; // Reiniciar posición vertical en la nueva página

        // Redibujar encabezados en la nueva página
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .rect(50, y, doc.page.width - 100, rowHeight)
          .fill('#333');

        headers.forEach((header, i) => {
          doc.fillColor('white');
          doc.text(
            header,
            50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
            y + 8,
            { width: columnWidths[i], align: 'center' },
          );
        });

        y += rowHeight;
      }

      // Dibujar la fila de producto
      const row = [
        (index + 1).toString(), // Índice
        producto.nombre,
        `$${Number(producto.precio).toFixed(2)}`, // Precio unitario
        cantidad.toString(),
        `$${total.toFixed(2)}`, // Total calculado
      ];

      row.forEach((cell, i) => {
        doc.fillColor('#333');

        // Ajustar texto para la columna de descripción (nombre del producto)
        if (i === 1) {
          doc.text(
            cell,
            50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
            y + 8,
            {
              width: columnWidths[i],
              align: 'left', // Alineación izquierda para descripción
              lineGap: 2, // Espaciado entre líneas
              ellipsis: true, // Acorta el texto si es muy largo
            },
          );
        } else {
          doc.text(
            cell,
            50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
            y + 5,
            { width: columnWidths[i], align: 'center' },
          );
        }
      });

      // Separación entre filas
      y += rowHeight + 2; // Espacio adicional entre filas
    });
  }

  private agregarTotales(doc: PDFKit.PDFDocument, totalCalculado: number) {
    // Definir la posición inicial para dibujar el total
    let y = doc.y + 30;
    const startX = 50;
    const width = doc.page.width - 100;
    const height = 40;

    // Si no hay suficiente espacio en la página, añadir una nueva página
    if (y + height + 20 > doc.page.height) {
      doc.addPage();
      y = 50; // Reiniciar la posición vertical en la nueva página
    }

    // Dibujar el cuadro del total con fondo negro
    doc.rect(startX, y, width, height).fill('#333'); // Establecer el fondo negro sin transparencia

    // Texto "TOTAL" y el valor estático calculado
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('white') // Texto en blanco
      .text('TOTAL:', startX + 10, y + 12);

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('white') // Texto en blanco
      .text(
        `$${totalCalculado.toFixed(2)}`, // Mostrar el valor
        startX + width - 150, // Alinear a la derecha
        y + 12,
        {
          align: 'right',
        },
      );

    // Línea blanca debajo del cuadro del total
    doc
      .moveTo(startX, y + height - 1)
      .lineTo(startX + width, y + height - 1)
      .lineWidth(1.5)
      .stroke('white'); // Línea en blanco
  }
}
