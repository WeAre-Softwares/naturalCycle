import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RemitosService } from './remitos.service';
import { CreateRemitoDto } from './dto/create-remito.dto';
import { UpdateRemitoDto } from './dto/update-remito.dto';

@Controller('remitos')
export class RemitosController {
  constructor(private readonly remitosService: RemitosService) {}

  @Post()
  create(@Body() createRemitoDto: CreateRemitoDto) {
    return this.remitosService.create(createRemitoDto);
  }

  @Get()
  findAll() {
    return this.remitosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.remitosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRemitoDto: UpdateRemitoDto) {
    return this.remitosService.update(+id, updateRemitoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remitosService.remove(+id);
  }
}
