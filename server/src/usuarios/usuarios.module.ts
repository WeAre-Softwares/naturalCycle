import { forwardRef, Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { AuthModule } from '../auth/auth.module';
import { NotificacionesModule } from 'src/notificaciones/notificaciones.module';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [TypeOrmModule.forFeature([Usuario]), forwardRef(() => AuthModule), NotificacionesModule],
  exports: [UsuariosService, TypeOrmModule],
})
export class UsuariosModule {}
