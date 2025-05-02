import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
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
import { NotificacionesService } from 'src/notificaciones/notificaciones.service';
import { TipoNotificacion } from 'src/notificaciones/entities/notificacion.entity';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger('UsuariosService');

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly MailsService: MailsService,
    private readonly dataSource: DataSource,
    private readonly notificacionesService: NotificacionesService,
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

      // try {
      //   // Enviar notificación por correo
      //   await this.MailsService.sendAccountPendingApprovalEmail(usuario);
      //   // Enviar correo de notificación al admin
      //   await this.MailsService.sendNotificationNewUser();
      // } catch (error) {
      //   this.logger.warn('Error al enviar correos de notificación:', error);
      // }

      try {
        await this.notificacionesService.createNotification(TipoNotificacion.USUARIO)
      } catch (error) {
        this.logger.warn('Error al crear una notificación de usuario:', error);
      }

      // Eliminar campos sensibles del objeto: Usuario directamente
      delete usuario.email;
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
      const queryBuilder = this.usuarioRepository.createQueryBuilder('usuario');
      // se excluyen los usuarios con el rol admin en el resultado de la consulta
      queryBuilder
        .where('usuario.esta_activo = :estaActivo', { estaActivo: true })
        .andWhere(':adminRole != ANY(usuario.roles)', {
          adminRole: RolesUsuario.admin,
        })
        .select([
          'usuario.usuario_id',
          'usuario.nombre',
          'usuario.apellido',
          'usuario.dni',
          'usuario.telefono',
          'usuario.nombre_comercio',
          'usuario.dom_fiscal',
          'usuario.email',
          'usuario.esta_activo',
          'usuario.roles',
          'usuario.dado_de_alta',
        ])
        .orderBy('usuario.nombre', 'ASC') // Ordenar por nombre
        .addOrderBy('usuario.apellido', 'ASC') // Luego ordenar por apellido
        .take(limit)
        .skip(offset);

      const [usuarios, total] = await queryBuilder.getManyAndCount();

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

  async findAllInactive(
    paginationDto: PaginationDto,
  ): Promise<FindAllUsersResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [usuarios, total] = await this.usuarioRepository.findAndCount({
        where: { esta_activo: false },
        select: {
          usuario_id: true,
          nombre: true,
          apellido: true,
          dni: true,
          nombre_comercio: true,
          dom_fiscal: true,
          email: true,
          telefono: true,
          esta_activo: true,
          roles: true,
          dado_de_alta: true,
        },
        order: { created_at: 'DESC' }, // Ordenar por fecha de creación
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
        'Error al buscar los usuarios inactivos',
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

  async findOneWithRoles(
    id: string,
    checkActive: boolean = true,
  ): Promise<Usuario> {
    try {
      const whereCondition = checkActive
        ? { usuario_id: id, esta_activo: true }
        : { usuario_id: id };

      const usuario = await this.usuarioRepository.findOne({
        where: whereCondition,
        select: [
          'usuario_id',
          'nombre',
          'apellido',
          'email',
          'roles',
          'esta_activo',
        ],
      });

      if (!usuario) {
        throw new NotFoundException(
          `No se encontró el usuario con el id: ${id}`,
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
  ): Promise<{
    usuarios: any;
    total: number;
    limit: number;
    offset: number;
  }> {
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
          'usuarios.esta_activo',
          'usuarios.roles',
          'usuarios.dado_de_alta',
        ])
        .where(
          `(
          unaccent(LOWER(usuarios.nombre)) ILIKE unaccent(LOWER(:term))
          OR unaccent(LOWER(usuarios.apellido)) ILIKE unaccent(LOWER(:term))
          OR CAST(usuarios.dni AS TEXT) ILIKE :term
        )`,
          {
            term: `%${term}%`,
          },
        )
        .andWhere('NOT (:admin = ANY(usuarios.roles))', {
          admin: RolesUsuario.admin,
        })
        .take(limit)
        .skip(offset);

      const [usuarios, total] = await queryBuilder.getManyAndCount();

      // Aplanar los resultados
      const listaUsuariosAplanados = usuarios.map((usuario) => ({
        usuario_id: usuario.usuario_id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        dni: usuario.dni,
        nombre_comercio: usuario.nombre_comercio,
        dom_fiscal: usuario.dom_fiscal,
        email: usuario.email,
        telefono: usuario.telefono,
        esta_activo: usuario.esta_activo,
        roles: usuario.roles,
        dado_de_alta: usuario.dado_de_alta,
      }));

      return {
        usuarios: listaUsuariosAplanados,
        total,
        limit,
        offset,
      };
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

  async darDeAltaUsuario(id: string): Promise<Partial<Usuario>> {
    const usuario = await this.findOne(id, false);

    // Si el usuario ya está dado de alta, no hace nada
    if (usuario.dado_de_alta === true) {
      throw new BadRequestException('El usuario ya está dado de alta.');
    }

    // Actualizar el estado de activación
    usuario.esta_activo = true;
    usuario.dado_de_alta = true;
    usuario.roles = [RolesUsuario.usuario];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(usuario);

      // Enviar correo de notificación de activación
      this.logger.debug(`Enviando correo a: ${usuario.email}`);
      // await this.MailsService.sendAccountActivatedEmail(usuario);

      await queryRunner.commitTransaction();

      return {
        usuario_id: usuario.usuario_id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        esta_activo: usuario.esta_activo,
        dado_de_alta: usuario.dado_de_alta,
        roles: usuario.roles,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al dar de alta al usuario con ID ${usuario.usuario_id}.`,
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async darDeBajaUsuario(id: string): Promise<Partial<Usuario>> {
    const usuario = await this.findOne(id, false);

    // Si el usuario ya está inactivo, no hace nada
    if (usuario.esta_activo === false) {
      throw new BadRequestException('El usuario ya está dado de baja.');
    }

    usuario.esta_activo = false;
    usuario.dado_de_alta = false;
    usuario.roles = []; // Dejar sin roles con array vacio

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(usuario);
      await queryRunner.commitTransaction();

      return {
        usuario_id: usuario.usuario_id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        esta_activo: usuario.esta_activo,
        dado_de_alta: usuario.dado_de_alta,
        roles: usuario.roles,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al dar de baja al usuario con ID ${usuario.usuario_id}.`,
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async darRolEmpleado(id: string): Promise<Partial<Usuario>> {
    const usuario = await this.findOne(id, false);

    usuario.esta_activo = true;
    usuario.dado_de_alta = true;
    usuario.roles = [RolesUsuario.empleado];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(usuario);
      await queryRunner.commitTransaction();

      return {
        usuario_id: usuario.usuario_id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        esta_activo: usuario.esta_activo,
        dado_de_alta: usuario.dado_de_alta,
        roles: usuario.roles,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al darle rol empleado al usuario con ID ${usuario.usuario_id}.`,
        error,
      );
    } finally {
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
