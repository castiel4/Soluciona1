import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProposalStatusDto {
  @ApiProperty({
    description: 'Motivo da recusa (opcional)',
    example: 'Valor muito abaixo do esperado',
    required: false
  })
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'O motivo deve ter no máximo 200 caracteres' })
  motivo?: string;
} 