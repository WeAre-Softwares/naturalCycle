import { IsString, MaxLength } from 'class-validator';

export class CreateProductosImageneDto {
  @IsString()
  @MaxLength(500)
  url: string;

  @IsString()
  @MaxLength(255)
  public_id: string;
}
