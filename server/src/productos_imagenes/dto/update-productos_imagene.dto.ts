import { PartialType } from '@nestjs/swagger';
import { CreateProductosImageneDto } from './create-productos_imagene.dto';

export class UpdateProductosImageneDto extends PartialType(CreateProductosImageneDto) {}
