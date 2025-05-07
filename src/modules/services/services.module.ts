import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from './entities/service.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { UploadService } from './services/upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    UsuariosModule,
    ConfigModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService, UploadService],
  exports: [ServicesService, UploadService],
})
export class ServicesModule {} 