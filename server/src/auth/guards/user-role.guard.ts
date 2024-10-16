import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';
import {
  VALID_ROLES,
  type ValidRoles,
} from '../constants/valid-roles.constant';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles || validRoles.length === 0) return true; // Si no se especifican roles, se permite el acceso.

    const req = context.switchToHttp().getRequest();
    const usuario = req.user as Usuario;

    if (!usuario) throw new BadRequestException('Usuario no encontrado');

    // Verificamos que user.roles sea un arreglo y no sea nulo
    if (!Array.isArray(usuario.roles) || usuario.roles.length === 0) {
      throw new BadRequestException(
        'Roles del usuario no definidos o no son un arreglo',
      );
    }

    // Verificamos si el usuario tiene al menos uno de los roles requeridos
    const hasRole = usuario.roles.some((role) => validRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('No tienes los permisos o el rol necesario');
    }

    return true; // El acceso está permitido
  }
}
