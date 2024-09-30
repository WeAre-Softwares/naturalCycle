import {
  BadRequestException,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';
import { CLOUDINARY_CARPETAS } from './constants/cloudinary-folders.constant';

@ApiTags('Cloudinary')
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Subir una imagen a una carpeta específica' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({
    name: 'folder',
    required: true,
    description:
      'Nombre de la carpeta en Cloudinary. Valores permitidos: narutalcycle-productos, naturalcycle-marcas',
  }) // Define la query parameter para la carpeta
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }), // 4Mb
          new FileTypeValidator({ fileType: '.png|jpeg|jpg|avif|webp|svg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('folder') folder: string, // Recibe la carpeta desde el query parameter
  ) {
    // Validar que el nombre de la carpeta sea válida
    if (!Object.values(CLOUDINARY_CARPETAS).includes(folder)) {
      throw new BadRequestException('Invalid folder name');
    }
    return this.cloudinaryService.uploadFile(file, folder);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un archivo por su ID y carpeta específica',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'El ID del archivo a obtener',
  })
  @ApiQuery({
    name: 'folder',
    required: true,
    description:
      'Nombre de la carpeta en Cloudinary. Valores permitidos: narutalcycle-productos, naturalcycle-marcas',
  })
  async getFile(@Param('id') id: string, folder: string) {
    const file = await this.cloudinaryService.getFile(id, folder);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una imagen por su ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'El ID de la imagen a eliminar en Cloudinary',
  })
  remove(@Param('id') id: string) {
    return this.cloudinaryService.deleteImage(id);
  }
}
