import { IsString, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @Length(3, 100)
  nome: string;

  @IsEmail()
  @Length(5, 100)
  email: string;

  @IsOptional()
  @IsString()
  @Length(10, 20)
  telefone?: string;

  @IsOptional()
  @IsString()
  @Length(11, 14)
  cpf?: string;

  @IsOptional()
  @IsString()
  @Length(5, 200)
  endereco?: string;
} 