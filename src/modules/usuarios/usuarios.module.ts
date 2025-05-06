import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { ViaCepService } from './services/viacep.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), HttpModule],
  controllers: [UsuariosController],
  providers: [UsuariosService, ViaCepService],
  exports: [UsuariosService, ViaCepService],
})
export class UsuariosModule {} 