import { IsString, IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { TipoUsuario } from '../entities/usuario.entity';

export class UpdateUsuarioDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  nome?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  senha?: string;

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

  @IsString()
  @IsOptional()
  fotoPerfil?: string;
} 