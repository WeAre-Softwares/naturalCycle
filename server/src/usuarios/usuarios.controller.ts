import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';
import {
  CreateUsuarioDto,
  UpdateUserByAdminDto,
  UpdateBasicUserDto,
} from './dto';
import { PaginationDto, SearchWithPaginationDto } from '../common/dtos';
import type { FindAllUsersResponse } from './interfaces';
import { Auth } from '../auth/decorators';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get('search')
  @ApiBearerAuth()
  @Auth('admin')
  @ApiOperation({
    summary: 'Buscar usuarios por término(nombre, apellido y dni)',
  })
  @ApiQuery({
    name: 'term',
    required: false,
    description: 'Término de búsqueda',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Límite de resultados',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Desplazamiento de resultados',
  })
  async findByTerm(
    @Query() searchWithPaginationDto: SearchWithPaginationDto,
  ): Promise<Partial<Usuario>[]> {
    return this.usuariosService.findAllByTerm(searchWithPaginationDto);
  }

  @Get()
  @ApiBearerAuth()
  @Auth('admin')
  @ApiOperation({ summary: 'Buscar todos los usuarios' })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<FindAllUsersResponse> {
    return this.usuariosService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @Auth('admin')
  @ApiOperation({ summary: 'Buscar un usuario por id' })
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch('admin/:id')
  @ApiBearerAuth()
  @Auth('admin')
  @ApiOperation({
    summary: 'El administrador actualiza datos relevante al usuario',
  })
  async updateUserByAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserByAdminDto: UpdateUserByAdminDto,
  ): Promise<Partial<Usuario>> {
    return this.usuariosService.updateUserByAdmin(id, updateUserByAdminDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  //TODO: Fix ver como manejar que el usuario sea el dueño real de la cuenta
  @Auth() // El usuario tiene que esta autenticado para poder actualiar sus datos
  @ApiOperation({
    summary: 'Actualización de datos básicos para el usuario con rol: usuario',
  })
  // @ApiBearerAuth()
  // @Auth() // Permite el acceso a cualquier usuario autenticado
  async updateBasicUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBasicUserDto: UpdateBasicUserDto,
  ): Promise<Partial<Usuario>> {
    return this.usuariosService.updateBasicUser(id, updateBasicUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Auth('admin')
  @ApiOperation({ summary: 'Desactivar un usuario' })
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.usuariosService.deactivate(id);
  }

  @Patch('activate/:id')
  @ApiBearerAuth()
  @Auth('admin')
  @ApiOperation({ summary: 'Activar un usuario' })
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.usuariosService.activate(id);
  }
}
