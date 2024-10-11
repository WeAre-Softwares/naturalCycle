import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { LoginUserDto, ResetPasswordDto, RequestPasswordResetDto } from './dto';
import { Auth, GetUser } from './decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<{
    token: string;
  }> {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @ApiBearerAuth()
  @Auth() // Permite el acceso a cualquier usuario autenticado
  async checkAuthStatus(@GetUser() usuario: Usuario): Promise<{
    token: string;
  }> {
    return this.authService.checkAuthStatus(usuario);
  }

  @Post('request-password-reset')
  async requestPasswordReset(
    @Body() requestPasswordResetDto: RequestPasswordResetDto,
  ): Promise<void> {
    return this.authService.requestPasswordReset(requestPasswordResetDto);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
