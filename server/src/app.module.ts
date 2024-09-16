import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EnvConfiguration } from './config/app.config';
import { JoiSchemaValidation } from './config/schema-validation';
import { CommonModule } from './common/common.module';
import { CategoriasModule } from './categorias/categorias.module';
import { MarcasModule } from './marcas/marcas.module';
import { EtiquetasModule } from './etiquetas/etiquetas.module';
import { ProductosModule } from './productos/productos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { RemitosModule } from './remitos/remitos.module';
import { DetallesPedidosModule } from './detalles_pedidos/detalles_pedidos.module';
import { ProductosImagenesModule } from './productos_imagenes/productos_imagenes.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiSchemaValidation,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('postgresHost'),
        port: configService.get<number>('postgresPort'),
        username: configService.get<string>('postgresUser'),
        password: configService.get<string>('postgresPassword'),
        database: configService.get<string>('postgresDb'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'prod',
      }),
    }),

    CommonModule,

    CategoriasModule,

    MarcasModule,

    EtiquetasModule,

    ProductosModule,

    UsuariosModule,

    PedidosModule,

    RemitosModule,

    DetallesPedidosModule,

    ProductosImagenesModule,

    CloudinaryModule,

    AutenticacionModule,
  ],
})
export class AppModule {}
