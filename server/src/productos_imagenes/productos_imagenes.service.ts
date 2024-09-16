import { Injectable } from '@nestjs/common';
import { CreateProductosImageneDto } from './dto/create-productos_imagene.dto';
import { UpdateProductosImageneDto } from './dto/update-productos_imagene.dto';

@Injectable()
export class ProductosImagenesService {
  create(createProductosImageneDto: CreateProductosImageneDto) {
    return 'This action adds a new productosImagene';
  }

  findAll() {
    return `This action returns all productosImagenes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productosImagene`;
  }

  update(id: number, updateProductosImageneDto: UpdateProductosImageneDto) {
    return `This action updates a #${id} productosImagene`;
  }

  remove(id: number) {
    return `This action removes a #${id} productosImagene`;
  }
}
