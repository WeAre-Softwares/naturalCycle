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
import { Usuario } from '../usuarios/entities/usuario.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginUserDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @Inject(forwardRef(() => UsuariosService))
    private readonly usuarioService: UsuariosService,
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
  //TODO: Ver si es conveniente dejarlo como código asincrono o quitarlo ya que el código es sincrono
  async checkAuthStatus(usuario: Usuario): Promise<{ token: string }> {
    return {
      token: this.getJwtToken({
        id: usuario.usuario_id,
        email: usuario.email,
        roles: [usuario.roles],
      }),
    };
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  //TODO: Ver si es conveniente dejarlo como código asincrono o quitarlo ya que el código es sincrono
  async generateRecoveryToken(userId: string): Promise<string> {
    const payload = { userId };
    return this.jwtService.sign(payload, { expiresIn: '15min' });
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
