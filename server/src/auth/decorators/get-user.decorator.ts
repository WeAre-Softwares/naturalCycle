import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const usuario = req.user;

    if (!usuario)
      throw new InternalServerErrorException('No se encontró un usuario');

    return !data ? usuario : usuario[data];
  },
);
