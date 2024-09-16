import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EnvConfiguration } from './config/app.config';
import { JoiSchemaValidation } from './config/schema-validation';
import { CommonModule } from './common/common.module';

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
  ],
})
export class AppModule {}
