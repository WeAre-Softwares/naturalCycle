import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RemitosService } from './remitos.service';
import { PaginationDto } from '../common/dtos';
import { Remito } from './entities/remito.entity';
import type { GetAllRemitosResponse } from './interfaces';

@ApiTags('remitos')
@Controller('remitos')
export class RemitosController {
  constructor(private readonly remitosService: RemitosService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar todos los remitos' })
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetAllRemitosResponse> {
    return this.remitosService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar un remito por id' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Remito> {
    return this.remitosService.findOne(id);
  }

  @Get('pdf/download')
  async downloadPDF(
    @Query('pedidoId') pedidoId: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!pedidoId) {
      throw new BadRequestException('El pedidoId es requerido');
    }

    try {
      const buffer = await this.remitosService.crearRemitoPdf(pedidoId);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=remito_${pedidoId}.pdf`,
        'Content-Length': buffer.length,
      });

      res.end(buffer);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        `Error al generar el PDF: ${error.message}`,
      );
    }
  }
}
