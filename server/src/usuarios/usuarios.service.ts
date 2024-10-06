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
import type { CreateUserResponse, FindAllUsersResponse } from './interfaces';
import { PaginationDto } from '../common/dtos';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger('UsuariosService');

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly authService: AuthService,
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

      // Eliminar campos sensibles del objeto: Usuario directamente
      delete usuario.email;
      delete usuario.email_verificado;
      delete usuario.usuario_id;
      delete usuario.esta_activo;
      delete usuario.password;
      delete usuario.roles;

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

  async findByEmailForPasswordReset(
    email: string,
  ): Promise<
    Pick<Usuario, 'usuario_id' | 'nombre' | 'email' | 'esta_activo'> | undefined
  > {
    try {
      return this.usuarioRepository.findOne({
        where: { email },
        select: {
          usuario_id: true,
          nombre: true,
          email: true,
          esta_activo: true,
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

  async requestPasswordReset(email: string): Promise<void> {
    const usuario = await this.findByEmailForPasswordReset(email);

    if (!usuario || !usuario.esta_activo) {
      // Mensaje genérico para no revelar si el email está registrado o si el usuario está inactivo
      throw new Error(
        'Si este correo está registrado, recibirás un enlace de recuperación.',
      );
    }

    const token = await this.authService.generateRecoveryToken(
      usuario.usuario_id,
    );
    await this.sendRecoveryEmail(
      { email: usuario.email, nombre: usuario.nombre },
      token,
    );
  }

  // FIXME: Implementar servicio de notificación por correo
  async sendRecoveryEmail(
    user: Pick<Usuario, 'email' | 'nombre'>,
    token: string,
  ): Promise<void> {
    const recoveryUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const emailContent = `
      <p>Hola ${user.nombre},</p>
      <p>Parece que has solicitado restablecer tu contraseña. Haz clic en el enlace de abajo para proceder:</p>
      <a href="${recoveryUrl}">Restablecer Contraseña</a>
      <p>Si no has solicitado esto, ignora este correo.</p>
    `;

    // await this.emailService.sendMail({
    //   to: user.email,
    //   subject: 'Recuperación de Contraseña',
    //   html: emailContent,
    // });
  }

  async updateUserByAdmin(
    id: string,
    updateUserByAdminDto: UpdateUserByAdminDto,
  ): Promise<Partial<Usuario>> {
    const usuario = await this.findOne(id, false); // No verifica si el usuario está activo

    // Combinar las propiedades del DTO con la entidad existente
    this.usuarioRepository.merge(usuario, updateUserByAdminDto);

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
        email: usuario.email,
        roles: usuario.roles,
        esta_activo: usuario.esta_activo,
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
