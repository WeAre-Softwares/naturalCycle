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
import { LoginUserDto, ResetPasswordDto, RequestPasswordResetDto } from './dto';
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

  // Método para generar el token de recuperación
  async generateRecoveryToken(userId: string): Promise<string> {
    const payload = { userId };
    return this.jwtService.sign(payload, { expiresIn: '15min' });
  }

  // Solicitar restablecimiento de contraseña
  async requestPasswordReset(
    requestPasswordResetDto: RequestPasswordResetDto,
  ): Promise<void> {
    const { email } = requestPasswordResetDto;

    const usuario =
      await this.usuarioService.findByEmailForPasswordReset(email);

    if (!usuario) {
      // Mensaje genérico para no revelar si el email está registrado o si el usuario está inactivo
      throw new NotFoundException(
        'Si este correo está registrado, recibirás un enlace de recuperación.',
      );
    }

    // Verificar si ya ha solicitado un restablecimiento en los últimos 10 minutos
    const now = new Date();
    const lastRequest = usuario.last_password_reset_request;

    if (lastRequest && now.getTime() - lastRequest.getTime() < 10 * 60 * 1000) {
      throw new NotFoundException(
        'Ya has solicitado restablecer tu contraseña. Inténtalo más tarde.',
      );
    }

    // Generar el token JWT
    const token = await this.generateRecoveryToken(usuario.usuario_id);

    // Guardar el token y la fecha de la solicitud en la DB
    await this.usuarioService.updatePasswordResetFields(usuario.usuario_id, {
      last_password_reset_request: now,
      reset_password_token: token,
    });

    // Enviar correo de recuperación con el token
    await this.mailsService.sendRecoveryEmail(usuario, token);
  }

  // Método para validar el token y actualizar la contraseña
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { newPassword, token } = resetPasswordDto;

    // Verificar y decodificar el token para obtener el usuario
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      throw new NotFoundException('Token inválido o expirado.');
    }

    const { userId } = decoded;

    // Encontrar el usuario asociado al token
    const usuario =
      await this.usuarioService.findOneByResetPasswordToken(userId);
    console.log('Token almacenado:', usuario.reset_password_token);
    console.log('Token recibido:', token);

    if (!usuario || usuario.reset_password_token !== token) {
      throw new NotFoundException('Token inválido o ya utilizado');
    }

    // Actualizar la contraseña
    await this.usuarioService.updatePassword(userId, newPassword);

    // Limpiar el token después de que la contraseña ha sido actualizada
    await this.usuarioService.updatePasswordResetFields(usuario.usuario_id, {
      reset_password_token: null,
    });
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
