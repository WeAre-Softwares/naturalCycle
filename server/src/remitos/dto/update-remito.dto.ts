import { PartialType } from '@nestjs/swagger';
import { CreateRemitoDto } from './create-remito.dto';

export class UpdateRemitoDto extends PartialType(CreateRemitoDto) {}
