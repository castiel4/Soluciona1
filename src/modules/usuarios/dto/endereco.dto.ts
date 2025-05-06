import { IsString, IsNotEmpty, Matches, Length, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EstadosBrasil {
  AC = 'AC', AL = 'AL', AP = 'AP', AM = 'AM', BA = 'BA', CE = 'CE', DF = 'DF', ES = 'ES',
  GO = 'GO', MA = 'MA', MT = 'MT', MS = 'MS', MG = 'MG', PA = 'PA', PB = 'PB', PR = 'PR',
  PE = 'PE', PI = 'PI', RJ = 'RJ', RN = 'RN', RS = 'RS', RO = 'RO', RR = 'RR', SC = 'SC',
  SP = 'SP', SE = 'SE', TO = 'TO'
}

export class EnderecoDto {
  @ApiProperty({
    description: 'CEP no formato 00000-000 ou 00000000',
    example: '12345-678'
  })
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @Matches(/^\d{5}-?\d{3}$/, { message: 'O CEP deve estar no formato 00000-000 ou 00000000.' })
  cep: string;

  @ApiProperty({
    description: 'Logradouro (rua, avenida, etc)',
    example: 'Rua das Flores'
  })
  @IsString({ message: 'O logradouro deve ser uma string.' })
  @IsNotEmpty({ message: 'O logradouro é obrigatório.' })
  @Length(3, 100, { message: 'O logradouro deve ter entre 3 e 100 caracteres.' })
  logradouro: string;

  @ApiProperty({
    description: 'Número do endereço',
    example: '12B'
  })
  @IsString({ message: 'O número deve ser uma string.' })
  @IsNotEmpty({ message: 'O número é obrigatório.' })
  @Length(1, 10, { message: 'O número deve ter entre 1 e 10 caracteres.' })
  numero: string;

  @ApiPropertyOptional({
    description: 'Complemento do endereço',
    example: 'Apto 101'
  })
  @IsOptional()
  @IsString({ message: 'O complemento deve ser uma string.' })
  @Length(0, 100, { message: 'O complemento deve ter no máximo 100 caracteres.' })
  complemento?: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Centro'
  })
  @IsString({ message: 'O bairro deve ser uma string.' })
  @IsNotEmpty({ message: 'O bairro é obrigatório.' })
  @Length(3, 100, { message: 'O bairro deve ter entre 3 e 100 caracteres.' })
  bairro: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo'
  })
  @IsString({ message: 'A cidade deve ser uma string.' })
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @Length(3, 100, { message: 'A cidade deve ter no mínimo 3 caracteres.' })
  @Matches(/^[A-Za-zÀ-ú\s]+$/, { message: 'A cidade deve conter apenas letras.' })
  cidade: string;

  @ApiProperty({
    description: 'Estado (UF)',
    example: 'SP',
    enum: EstadosBrasil
  })
  @IsEnum(EstadosBrasil, { message: 'O estado deve ser uma das 27 siglas de UF do Brasil.' })
  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  estado: EstadosBrasil;
} 