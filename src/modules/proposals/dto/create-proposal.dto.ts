import { IsString, IsNumber, IsUUID, Min, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProposalDto {
  @ApiProperty({
    description: 'Descrição detalhada da proposta',
    example: 'Gostaria de contratar seus serviços para reforma do banheiro'
  })
  @IsString()
  @MinLength(10, { message: 'A descrição deve ter no mínimo 10 caracteres' })
  @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres' })
  descricao: string;

  @ApiProperty({
    description: 'Valor proposto para o serviço',
    example: 1500.00
  })
  @IsNumber()
  @Min(0.01, { message: 'O valor proposto deve ser maior que zero' })
  valorProposto: number;

  @ApiProperty({
    description: 'ID do serviço para o qual a proposta está sendo enviada',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  servicoId: string;
} 