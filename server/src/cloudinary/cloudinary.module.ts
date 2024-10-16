import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './providers/cloudinary.provider';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CloudinaryController],
  providers: [CloudinaryProvider, CloudinaryService],
  imports: [AuthModule],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
