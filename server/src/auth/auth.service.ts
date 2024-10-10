import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { MailsService } from 'src/mails/mails.service';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { LoginUserDto, ResetPasswordDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @Inject(forwardRef(() => UsuariosService))
    private readonly usuarioService: UsuariosService,
    private readonly mailsService: MailsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    try {
      const { email, password } = loginUserDto;
      const usuario = await this.usuarioService.findByEmailForLogin(email);

      if (!usuario || !bcrypt.compareSync(password, usuario.password))
        throw new UnauthorizedException('Las credenciales no son válidas');

      if (!usuario.esta_activo)
        throw new UnauthorizedException(
          'Tu cuenta está inactiva. Por favor, contacta al soporte.',
        );

      return this.checkAuthStatus(usuario);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async checkAuthStatus(usuario: Usuario): Promise<{ token: string }> {
    return {
      token: this.getJwtToken({
        id: usuario.usuario_id,
        email: usuario.email,
        roles: usuario.roles,
      }),
    };
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  async generateRecoveryToken(userId: string): Promise<string> {
    const payload = { userId };
    return this.jwtService.sign(payload, { expiresIn: '15min' });
  }

  // Solicitar restablecimiento de contraseña
  async requestPasswordReset(email: string): Promise<void> {
    const usuario =
      await this.usuarioService.findByEmailForPasswordReset(email);

    if (!usuario) {
      // Mensaje genérico para no revelar si el email está registrado o si el usuario está inactivo
      throw new Error(
        'Si este correo está registrado, recibirás un enlace de recuperación.',
      );
    }

    // FIXME:
    // Verificar si ya ha solicitado un restablecimiento en los últimos 10 minutos
    // const now = new Date();
    // const lastRequest = usuario.last_password_reset_request;
    // if (lastRequest && now.getTime() - lastRequest.getTime() < 10 * 60 * 1000) {
    //   throw new Error(
    //     'Ya has solicitado restablecer tu contraseña. Inténtalo más tarde.',
    //   );
    // }

    // Generar el token JWT
    const token = await this.generateRecoveryToken(usuario.usuario_id);

    // Actualizar la fecha de la última solicitud
    // usuario.last_password_reset_request = now;
    // await this.usuarioService.updateUsuario(usuario);

    // Enviar correo de recuperación con el token
    await this.mailsService.sendRecoveryEmail(usuario, token);
  }

  // Método para validar el token y actualizar la contraseña
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { newPassword, token } = resetPasswordDto;

    // Verificar y decodificar el token
    const decoded = this.jwtService.verify(token);
    const { userId } = decoded;

    // Encontrar el usuario asociado al token
    const usuario = await this.usuarioService.findOne(userId);

    if (!usuario) {
      throw new Error('Token inválido o usuario no encontrado.');
    }

    // Actualizar la contraseña
    await this.usuarioService.updatePassword(userId, newPassword);
  }

  private handleDBExceptions(error: any): never {
    if (error instanceof NotFoundException) {
      this.logger.warn(`NotFoundException: ${error.message}`);
      throw new NotFoundException('Resource not found');
    }

    if (error instanceof UnauthorizedException) {
      this.logger.warn(`UnauthorizedException: ${error.message}`);
      throw new UnauthorizedException(error.message);
    }

    if (error.code === '23505') {
      // Unique constraint violation
      this.logger.warn(`Duplicate key error: ${error.detail}`);
      throw new BadRequestException('Duplicate key error');
    }

    if (error instanceof BadRequestException) {
      this.logger.warn(`BadRequestException: ${error.message}`);
      throw new BadRequestException(error.message);
    }

    // Catch-all for other errors
    this.logger.error('Unexpected error', error.stack);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
