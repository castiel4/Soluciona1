import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TipoUsuario } from '../usuarios/entities/usuario.entity';
import { AvaliacoesService } from './avaliacoes.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { Avaliacao } from './entities/avaliacao.entity';

@ApiTags('avaliacoes')
@Controller('avaliacoes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AvaliacoesController {
  constructor(private readonly avaliacoesService: AvaliacoesService) {}

  @Post()
  @Roles(TipoUsuario.SOLICITANTE)
  @ApiOperation({ summary: 'Criar uma nova avaliação' })
  @ApiResponse({ status: 201, description: 'Avaliação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou avaliação já existe' })
  @ApiResponse({ status: 403, description: 'Apenas solicitantes podem avaliar' })
  async create(@Body() createAvaliacaoDto: CreateAvaliacaoDto, @Request() req) {
    return this.avaliacoesService.create(createAvaliacaoDto, req.user.id);
  }

  @Get('prestador/:id')
  @ApiOperation({ summary: 'Listar avaliações de um prestador' })
  @ApiResponse({ status: 200, description: 'Lista de avaliações', type: [Avaliacao] })
  async findAllByPrestador(@Param('id') id: string) {
    return this.avaliacoesService.findAllByPrestador(id);
  }

  @Get('servico/:id')
  @ApiOperation({ summary: 'Buscar avaliação de um serviço' })
  @ApiResponse({ status: 200, description: 'Avaliação encontrada', type: Avaliacao })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  async findByServico(@Param('id') id: string) {
    return this.avaliacoesService.findByServico(id);
  }
} 