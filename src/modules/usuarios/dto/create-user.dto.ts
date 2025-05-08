import { IsString, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EnderecoDto } from './endereco.dto';

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
    description: 'Tipo do usuário (aceita variações como "prestador", "PRESTADOR", "prestadores", etc)',
    example: 'prestador'
  })
  @IsString()
  @IsNotEmpty({ message: 'O tipo de usuário é obrigatório' })
  tipo: string;

  @ApiProperty({
    description: 'Endereço do usuário',
    type: EnderecoDto
  })
  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco: EnderecoDto;
} 