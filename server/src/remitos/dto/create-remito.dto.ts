import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateRemitoDto {
  @IsUUID()
  @IsNotEmpty()
  pedido_id: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  nombre_comprador: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  nombre_comercio_comprador: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  domicilio_comprador: string;

  @IsNumber()
  @IsNotEmpty()
  dni_comprador: number;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  nombre_vendedor: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  domicilio_vendedor: string;

  @IsNumber()
  @IsNotEmpty()
  dni_vendedor: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  total_precio: number;
}
