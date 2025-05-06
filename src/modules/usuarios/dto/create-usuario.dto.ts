import { IsString, IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { TipoUsuario } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsString()
  @MinLength(3)
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsEnum(TipoUsuario)
  @IsOptional()
  tipo?: TipoUsuario;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  endereco?: string;

  @IsString()
  @IsOptional()
  biografia?: string;
} 