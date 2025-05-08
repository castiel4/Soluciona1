import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalStatusDto } from './dto/update-proposal-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TipoUsuario } from '../usuarios/entities/usuario.entity';

@ApiTags('proposals')
@Controller('proposals')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova proposta' })
  @ApiResponse({ status: 201, description: 'Proposta criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Não autorizado' })
  create(@Body() createProposalDto: CreateProposalDto, @Request() req) {
    return this.proposalsService.create(createProposalDto, req.user.id);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Listar propostas por usuário' })
  @ApiResponse({ status: 200, description: 'Lista de propostas retornada com sucesso' })
  async findAllByUser(@Param('id') id: string) {
    return this.proposalsService.findAllByUser(id);
  }

  @Get('service/:id')
  @ApiOperation({ summary: 'Listar propostas por serviço' })
  @ApiResponse({ status: 200, description: 'Lista de propostas retornada com sucesso' })
  async findAllByService(@Param('id') id: string) {
    return this.proposalsService.findAllByService(id);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Consultar histórico de uma proposta' })
  @ApiResponse({ status: 200, description: 'Histórico da proposta retornado com sucesso' })
  async findHistory(@Param('id') id: string) {
    return this.proposalsService.findHistory(id);
  }

  @Put(':id/accept')
  @Roles(TipoUsuario.PRESTADOR)
  @ApiOperation({ summary: 'Aceitar uma proposta' })
  @ApiResponse({ status: 200, description: 'Proposta aceita com sucesso' })
  @ApiResponse({ status: 403, description: 'Apenas o prestador do serviço pode aceitar propostas' })
  async accept(@Param('id') id: string, @Request() req) {
    return this.proposalsService.accept(id, req.user.id);
  }

  @Put(':id/reject')
  @Roles(TipoUsuario.PRESTADOR)
  @ApiOperation({ summary: 'Recusar uma proposta' })
  @ApiResponse({ status: 200, description: 'Proposta recusada com sucesso' })
  @ApiResponse({ status: 403, description: 'Apenas o prestador do serviço pode recusar propostas' })
  async reject(
    @Param('id') id: string,
    @Body() updateDto: UpdateProposalStatusDto,
    @Request() req
  ) {
    return this.proposalsService.reject(id, req.user.id, updateDto);
  }
} 