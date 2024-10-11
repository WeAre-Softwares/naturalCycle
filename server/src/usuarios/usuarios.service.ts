import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import {
  CreateUsuarioDto,
  UpdateUserByAdminDto,
  type UpdateBasicUserDto,
} from './dto';
import { AuthService } from '../auth/auth.service';
import { MailsService } from '../mails/mails.service';
import type { CreateUserResponse, FindAllUsersResponse } from './interfaces';
import { PaginationDto, SearchWithPaginationDto } from '../common/dtos';
import { RolesUsuario } from './types/roles.enum';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger('UsuariosService');

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly authService: AuthService,
    private readonly MailsService: MailsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<CreateUserResponse> {
    try {
      const { password = '', ...userData } = createUsuarioDto;
      const usuario = this.usuarioRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.usuarioRepository.save(usuario);

      // Enviar notificación por correo
      await this.MailsService.sendAccountPendingApprovalEmail(usuario);

      // Eliminar campos sensibles del objeto: Usuario directamente
      delete usuario.email;
      delete usuario.email_verificado;
      delete usuario.usuario_id;
      delete usuario.esta_activo;
      delete usuario.password;
      delete usuario.roles;
      delete usuario.last_password_reset_request;
      delete usuario.reset_password_token;

      return {
        ...usuario,
        token: this.authService.getJwtToken({
          id: usuario.usuario_id,
          email: usuario.email,
          roles: usuario.roles,
        }),
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al crear el Usuario',
        error,
      );
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<FindAllUsersResponse> {
    const { limit = 5, offset = 0 } = paginationDto;
    try {
      const [usuarios, total] = await this.usuarioRepository.findAndCount({
        where: { esta_activo: true },
        take: limit,
        skip: offset,
      });

      return {
        usuarios,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar los usuarios',
        error,
      );
    }
  }

  async findOne(id: string, checkActive: boolean = true): Promise<Usuario> {
    try {
      const whereCondition = checkActive
        ? { usuario_id: id, esta_activo: true }
        : { usuario_id: id };

      const usuario = await this.usuarioRepository.findOne({
        where: whereCondition,
      });

      if (!usuario) {
        throw new NotFoundException(
          `No se encontro el usuario con el id: ${id}`,
        );
      }

      return usuario;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar el usuario',
        error,
      );
    }
  }

  async findOneByResetPasswordToken(
    id: string,
    checkActive: boolean = true,
  ): Promise<Usuario> {
    try {
      const whereCondition = checkActive
        ? { usuario_id: id, esta_activo: true }
        : { usuario_id: id };

      const usuario = await this.usuarioRepository.findOne({
        where: whereCondition,
        select: {
          last_password_reset_request: true,
          reset_password_token: true,
          usuario_id: true,
        },
      });

      if (!usuario) {
        throw new NotFoundException(
          `No se encontro el usuario con el id: ${id}`,
        );
      }

      return usuario;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar el usuario',
        error,
      );
    }
  }

  async findAllByTerm(
    SearchWithPaginationDto: SearchWithPaginationDto,
  ): Promise<Partial<Usuario>[]> {
    const { limit = 10, offset = 0, term } = SearchWithPaginationDto;

    try {
      const queryBuilder = this.usuarioRepository
        .createQueryBuilder('usuarios')
        .select([
          'usuarios.usuario_id',
          'usuarios.nombre',
          'usuarios.apellido',
          'usuarios.dni',
          'usuarios.nombre_comercio',
          'usuarios.dom_fiscal',
          'usuarios.email',
          'usuarios.telefono',
        ])
        .andWhere(
          '(LOWER(usuarios.nombre) LIKE LOWER(:term) OR LOWER(usuarios.apellido) LIKE LOWER(:term) OR CAST(usuarios.dni AS TEXT) LIKE :term)',
          {
            term: `%${term}%`,
          },
        )
        .take(limit)
        .skip(offset);

      // Verificar la consulta generada
      // console.log('SQL generada:', queryBuilder.getSql());
      // console.log('Término de búsqueda aplicado:', term);

      const usuarios = await queryBuilder.getMany();

      // Aplanar los resultados
      const listaUsuariosAplanados = usuarios.map((usuario) => ({
        id: usuario.usuario_id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        dni: usuario.dni,
        nombre_comercio: usuario.nombre_comercio,
        dom_fiscal: usuario.dom_fiscal,
        email: usuario.email,
        telefono: usuario.telefono,
      }));

      return listaUsuariosAplanados;
    } catch (error) {
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        'Error al buscar los usuarios por termino',
        error,
      );
    }
  }

  async findByEmailForLogin(email: string): Promise<Usuario | undefined> {
    try {
      return this.usuarioRepository.findOne({
        where: { email },
        select: {
          email: true,
          usuario_id: true,
          esta_activo: true,
          password: true,
          roles: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Ocurrió un problema al intentar acceder a su cuenta. Por favor, inténtelo más tarde.',
        error,
      );
    }
  }

  // Método para encontrar el usuario por email para el restablecimiento
  async findByEmailForPasswordReset(
    email: string,
  ): Promise<
    | Pick<
        Usuario,
        | 'usuario_id'
        | 'nombre'
        | 'apellido'
        | 'email'
        | 'reset_password_token'
        | 'last_password_reset_request'
      >
    | undefined
  > {
    try {
      return this.usuarioRepository.findOne({
        where: { email, esta_activo: true },
        select: {
          usuario_id: true,
          nombre: true,
          apellido: true,
          email: true,
          reset_password_token: true,
          last_password_reset_request: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Ocurrió un problema al intentar acceder a su cuenta. Por favor, inténtelo más tarde.',
        error,
      );
    }
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usuarioRepository.update(
      { usuario_id: userId },
      { password: hashedPassword },
    );
  }

  async updatePasswordResetFields(
    userId: string,
    resetFields: Partial<Usuario>,
  ): Promise<void> {
    const usuario = await this.findOne(userId, true); // Verifica si el usuario está activo

    // Combinar los campos recibidos con el objeto del usuario
    this.usuarioRepository.merge(usuario, resetFields);

    // Crear query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Guardar cambios en la DB
      await queryRunner.manager.save(usuario);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al actualizar los campos de restablecimiento del usuario`,
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateUserByAdmin(
    id: string,
    updateUserByAdminDto: UpdateUserByAdminDto,
  ): Promise<Partial<Usuario>> {
    const usuario = await this.findOne(id, false); // No verifica si el usuario está activo

    // Combinar las propiedades del DTO con la entidad existente
    this.usuarioRepository.merge(usuario, updateUserByAdminDto);

    // Verifica si el nuevo campo dado_de_alta ha cambiado a true
    const rolesChanged = updateUserByAdminDto.dado_de_alta === true;

    // Query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Guardar cambios en la DB
      await queryRunner.manager.save(usuario);

      // Enviar notificación por correo solo si el rol cambia de null a 'usuario'
      if (rolesChanged) {
        this.logger.debug(`Enviando correo a: ${usuario.email}`);
        await this.MailsService.sendAccountActivatedEmail(usuario);
      }

      // Confirmar transacción
      await queryRunner.commitTransaction();

      return {
        usuario_id: usuario.usuario_id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        roles: usuario.roles,
        esta_activo: usuario.esta_activo,
        dado_de_alta: usuario.dado_de_alta,
      };
    } catch (error) {
      // Revertir transacción en caso de error
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        `Error al actualizar el usuario con ID ${usuario.usuario_id}.`,
        error,
      );
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
  }

  async updateBasicUser(
    id: string,
    updateBasicUserDto: UpdateBasicUserDto,
  ): Promise<Partial<Usuario>> {
    const usuario = await this.findOne(id, true); // Verifica si el usuario está activo

    // Combinar las propiedades del DTO con la entidad existente
    this.usuarioRepository.merge(usuario, updateBasicUserDto);

    // Query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Guardar cambios en la DB
      await queryRunner.manager.save(usuario);
      // Confirmar transacción
      await queryRunner.commitTransaction();

      return {
        usuario_id: usuario.usuario_id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        dni: usuario.dni,
        nombre_comercio: usuario.nombre_comercio,
        telefono: usuario.telefono,
        dom_fiscal: usuario.dom_fiscal,
      };
    } catch (error) {
      // Revertir transacción en caso de error
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al actualizar el usuario con ID ${usuario.usuario_id}.`,
        error,
      );
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
  }

  async deactivate(id: string): Promise<{
    mensaje: string;
  }> {
    try {
      const usuario = await this.findOne(id);

      // Marcar como inactiva el usuario
      usuario.esta_activo = false;
      // Guardar en la DB
      await this.usuarioRepository.save(usuario);
      return {
        mensaje: `El usuario con ID ${id} ha sido marcado como inactivo.`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al marcar como inactivo el usuario con ID ${id}.`,
        error,
      );
    }
  }

  async activate(id: string): Promise<{
    mensaje: string;
  }> {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { usuario_id: id },
      });

      if (!usuario) {
        throw new NotFoundException(
          `No se encontro el usuario con el id: ${id}`,
        );
      }

      // Marcar como activo el usuario
      usuario.esta_activo = true;
      // Guardar en la DB
      await this.usuarioRepository.save(usuario);
      return {
        mensaje: `El usuario con ID ${id} ha sido marcado como activo.`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al marcar como activo el usuario con ID ${id}.`,
        error,
      );
    }
  }
}
