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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';
import {
  CreateUsuarioDto,
  UpdateUserByAdminDto,
  UpdateBasicUserDto,
} from './dto';
import { PaginationDto } from '../common/dtos';
import type { FindAllUsersResponse } from './interfaces';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todos los usuarios' })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<FindAllUsersResponse> {
    return this.usuariosService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar un usuario por id' })
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch('admin/:id')
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
  @ApiOperation({ summary: 'Desactivar un usuario' })
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.usuariosService.deactivate(id);
  }

  @Patch('activate/:id')
  @ApiOperation({ summary: 'Activar un usuario' })
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.usuariosService.activate(id);
  }
}
