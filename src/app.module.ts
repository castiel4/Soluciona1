import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { getTypeOrmConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    UsuariosModule,
    AuthModule,
    ClientesModule,
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    const jwtSecret = this.configService.get('JWT_SECRET');
    console.log('JWT_SECRET:', jwtSecret ? 'Presente' : 'Ausente');
    console.log('Comprimento da chave:', jwtSecret?.length);
  }
} 