import { IsString, IsEmail, IsEnum, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { TipoUsuario } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[A-zÀ-ú\s]*$/, {
    message: 'O nome deve conter apenas letras e espaços'
  })
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'
    }
  )
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
  @MinLength(10)
  @MaxLength(500)
  @Matches(/^[^<>]*$/, {
    message: 'A biografia não pode conter tags HTML'
  })
  biografia?: string;

  @IsString()
  @IsOptional()
  fotoPerfil?: string;
} 