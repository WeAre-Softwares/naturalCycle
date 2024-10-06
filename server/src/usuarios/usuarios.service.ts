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
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto';
import { AuthService } from '../auth/auth.service';
import type { CreateUserResponse } from './interfaces';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger('UsuariosService');

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioReppository: Repository<Usuario>,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<CreateUserResponse> {
    try {
      const { password = '', ...userData } = createUsuarioDto;
      const usuario = this.usuarioReppository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.usuarioReppository.save(usuario);

      // Eliminar campos sensibles del objeto: User directamente
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
          roles: [usuario.roles],
        }),
      };
    } catch (error) {
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        'Error al crear el Usuario',
        error,
      );
    }
  }

  // async findAll(paginationDto: PaginationDto): Promise<FindAllUsersResponse> {
  //   const { limit = 5, offset = 0 } = paginationDto;
  //   try {
  //     const [users, total] = await this.userRepository.findAndCount({
  //       take: limit,
  //       skip: offset,
  //     });

  //     return {
  //       users,
  //       total,
  //       limit,
  //       offset,
  //     };
  //   } catch (error) {
  //     this.handleDBExceptions(error);
  //   }
  // }

  async findOne(id: string): Promise<Usuario> {
    try {
      const usuario = await this.usuarioReppository.findOne({
        where: { usuario_id: id },
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
      return this.usuarioReppository.findOne({
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
}

// async findByEmailForPasswordReset(
//   email: string,
// ): Promise<
//   Pick<User, 'id' | 'firstName' | 'email' | 'isActive'> | undefined
// > {
//   try {
//     return this.userRepository.findOne({
//       where: { email },
//       select: {
//         id: true,
//         firstName: true,
//         email: true,
//         isActive: true,
//       },
//     });
//   } catch (error) {
//     this.handleDBExceptions(error);
//   }
// }

// async requestPasswordReset(email: string): Promise<void> {
//   const user = await this.findByEmailForPasswordReset(email);

//   if (!user || !user.isActive) {
//     // Mensaje genérico para no revelar si el email está registrado o si el usuario está inactivo
//     throw new Error(
//       'Si este correo está registrado, recibirás un enlace de recuperación.',
//     );
//   }

//   const token = await this.authService.generateRecoveryToken(user.id);
//   await this.sendRecoveryEmail(
//     { email: user.email, firstName: user.firstName },
//     token,
//   );
// }

// async sendRecoveryEmail(
//   user: Pick<User, 'email' | 'firstName'>,
//   token: string,
// ): Promise<void> {
//   const recoveryUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
//   const emailContent = `
//     <p>Hola ${user.firstName},</p>
//     <p>Parece que has solicitado restablecer tu contraseña. Haz clic en el enlace de abajo para proceder:</p>
//     <a href="${recoveryUrl}">Restablecer Contraseña</a>
//     <p>Si no has solicitado esto, ignora este correo.</p>
//   `;

//   // await this.emailService.sendMail({
//   //   to: user.email,
//   //   subject: 'Recuperación de Contraseña',
//   //   html: emailContent,
//   // });
// }

// async updateUserByAdmin(
//   id: string,
//   updateUserByAdminDto: UpdateUserByAdminDto,
// ): Promise<User> {
//   const user = await this.findOne(id);

//   // Combinar las propiedades del DTO con la entidad existente
//   this.userRepository.merge(user, updateUserByAdminDto);

//   // Query runner
//   const queryRunner = this.dataSource.createQueryRunner();
//   await queryRunner.connect();
//   await queryRunner.startTransaction();
//   try {
//     // Guardar cambios en la DB
//     await queryRunner.manager.save(user);
//     // Confirmar transacción
//     await queryRunner.commitTransaction();

//     return user;
//   } catch (error) {
//     // Revertir transacción en caso de error
//     await queryRunner.rollbackTransaction();
//     this.handleDBExceptions(error);
//   } finally {
//     // Liberar el queryRunner
//     await queryRunner.release();
//   }
// }

// async updateBasicUser(
//   id: string,
//   updateBasicUserDto: UpdateBasicUserDto,
// ): Promise<User> {
//   const user = await this.findOne(id);

//   // Combinar las propiedades del DTO con la entidad existente
//   this.userRepository.merge(user, updateBasicUserDto);

//   // Query runner
//   const queryRunner = this.dataSource.createQueryRunner();
//   await queryRunner.connect();
//   await queryRunner.startTransaction();
//   try {
//     // Guardar cambios en la DB
//     await queryRunner.manager.save(user);
//     // Confirmar transacción
//     await queryRunner.commitTransaction();

//     return user;
//   } catch (error) {
//     // Revertir transacción en caso de error
//     await queryRunner.rollbackTransaction();
//     this.handleDBExceptions(error);
//   } finally {
//     // Liberar el queryRunner
//     await queryRunner.release();
//   }
// }

// async remove(id: string): Promise<{ message: string }> {
//   try {
//     const user = await this.userRepository.findOneOrFail({
//       where: { id },
//     });
//     // Colocamos el usuario como inactivo para mantener la integridad referencial
//     user.isActive = false;
//     await this.userRepository.save(user);
//     return {
//       message: `User with id: ${id} has been marked as inactive`,
//     };
//   } catch (error) {
//     this.handleDBExceptions(error);
//   }
// }
