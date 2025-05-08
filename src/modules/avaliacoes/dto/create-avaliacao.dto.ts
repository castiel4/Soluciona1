import { IsString, IsNumber, IsUUID, IsOptional, Min, Max, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAvaliacaoDto {
  @ApiProperty({
    description: 'Nota da avaliação (1 a 5)',
    example: 5,
    minimum: 1,
    maximum: 5
  })
  @IsNumber({}, { message: 'A nota deve ser um número' })
  @Min(1, { message: 'A nota mínima é 1' })
  @Max(5, { message: 'A nota máxima é 5' })
  nota: number;

  @ApiPropertyOptional({
    description: 'Comentário sobre o serviço prestado',
    example: 'Excelente trabalho, muito profissional e pontual.'
  })
  @IsOptional()
  @IsString({ message: 'O comentário deve ser uma string' })
  @Length(0, 500, { message: 'O comentário deve ter no máximo 500 caracteres' })
  @Matches(/^[^<>]*$/, { message: 'O comentário não pode conter tags HTML' })
  comentario?: string;

  @ApiProperty({
    description: 'ID do serviço avaliado',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID('4', { message: 'O ID do serviço deve ser um UUID válido' })
  servicoId: string;
} 