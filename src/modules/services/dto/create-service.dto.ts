import { IsString, IsNumber, IsArray, IsNotEmpty, Length, Min, Max, Matches, ArrayMaxSize, IsUrl, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CategoriaServico, SubcategoriaServico } from '../enums/categorias.enum';
import { normalizeCategoria, normalizeSubcategoria } from '../helpers/normalize-categoria.helper';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Título do serviço',
    example: 'Instalação de Ar Condicionado'
  })
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @Length(10, 100, { message: 'O título deve ter entre 10 e 100 caracteres' })
  titulo: string;

  @ApiProperty({
    description: 'Descrição detalhada do serviço',
    example: 'Serviço completo de instalação de ar condicionado split, incluindo suporte e materiais necessários.'
  })
  @IsString({ message: 'A descrição deve ser uma string' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @Length(20, 500, { message: 'A descrição deve ter entre 20 e 500 caracteres' })
  @Matches(/^[^<>]*$/, { message: 'A descrição não pode conter tags HTML' })
  descricao: string;

  @ApiProperty({
    description: 'Preço do serviço',
    example: 299.99
  })
  @IsNumber({}, { message: 'O preço deve ser um número' })
  @IsNotEmpty({ message: 'O preço é obrigatório' })
  @Min(0, { message: 'O preço deve ser maior que 0' })
  preco: number;

  @ApiProperty({
    description: 'Categoria do serviço',
    enum: CategoriaServico,
    example: CategoriaServico.MANUTENCAO
  })
  @IsString({ message: 'A categoria deve ser uma string' })
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  @Transform(({ value }) => normalizeCategoria(value))
  categoria: CategoriaServico;

  @ApiProperty({
    description: 'Subcategoria do serviço',
    enum: SubcategoriaServico,
    example: SubcategoriaServico.AR_CONDICIONADO,
    required: false
  })
  @IsString({ message: 'A subcategoria deve ser uma string' })
  @IsOptional()
  @Transform(({ value }) => value ? normalizeSubcategoria(value) : undefined)
  subcategoria: SubcategoriaServico;

  @ApiProperty({
    description: 'URLs das fotos do serviço',
    example: ['http://exemplo.com/foto1.jpg'],
    required: false
  })
  @IsOptional()
  @IsArray({ message: 'As fotos devem ser um array de URLs' })
  @IsUrl({}, { each: true, message: 'Cada foto deve ser uma URL válida' })
  @ArrayMaxSize(5, { message: 'Máximo de 5 fotos permitidas' })
  fotos?: string[];
} 