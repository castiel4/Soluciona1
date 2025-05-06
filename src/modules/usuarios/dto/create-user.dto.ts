import { IsString, IsEmail, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EnderecoDto } from './endereco.dto';

export enum TipoUsuario {
  SOLICITANTE = 'solicitante',
  PRESTADOR = 'prestador',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva'
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@email.com'
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'Senha@123'
  })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  senha: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '(11) 99999-9999'
  })
  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  telefone: string;

  @ApiProperty({
    description: 'Biografia do usuário',
    example: 'Prestador de serviços há 5 anos'
  })
  @IsString()
  @IsNotEmpty({ message: 'A biografia é obrigatória' })
  biografia: string;

  @ApiProperty({
    description: 'Tipo do usuário',
    enum: TipoUsuario,
    example: TipoUsuario.PRESTADOR
  })
  @IsEnum(TipoUsuario, { message: 'Tipo de usuário inválido. Use "prestador" ou "solicitante".' })
  @IsNotEmpty({ message: 'O tipo de usuário é obrigatório' })
  tipo: TipoUsuario;

  @ApiProperty({
    description: 'Endereço do usuário',
    type: EnderecoDto
  })
  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco: EnderecoDto;
} 