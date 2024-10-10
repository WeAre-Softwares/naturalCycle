import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  // Método para enviar el correo de recuperación con el token
  async sendRecoveryEmail(
    usuario: Partial<Usuario>,
    token: string,
  ): Promise<void> {
    // const recoveryUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const recoveryUrl = `${process.env.BACKEND_URL}/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: usuario.email,
      subject: 'Restablecimiento de Contraseña',
      template: './password-reset',
      context: {
        name: usuario.nombre + ' ' + usuario.apellido,
        recoveryUrl,
      },
    });
  }
}
