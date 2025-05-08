import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Proposal, ProposalStatus } from './entities/proposal.entity';
import { ProposalHistory } from './entities/proposal-history.entity';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalStatusDto } from './dto/update-proposal-status.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { ServicesService } from '../services/services.service';
import { TipoUsuario } from '../usuarios/entities/usuario.entity';
import { addDays } from 'date-fns';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private proposalsRepository: Repository<Proposal>,
    @InjectRepository(ProposalHistory)
    private proposalHistoryRepository: Repository<ProposalHistory>,
    private usuariosService: UsuariosService,
    private servicesService: ServicesService,
  ) {}

  private async registrarHistorico(
    proposta: Proposal,
    statusAnterior: ProposalStatus,
    statusNovo: ProposalStatus,
    usuarioId: string,
    motivo?: string
  ): Promise<void> {
    const historico = this.proposalHistoryRepository.create({
      proposalId: proposta.id,
      statusAnterior,
      statusNovo,
      usuarioId,
      motivo
    });
    await this.proposalHistoryRepository.save(historico);
  }

  async create(createProposalDto: CreateProposalDto, userId: string): Promise<Proposal> {
    // Verifica se o usuário existe
    const usuario = await this.usuariosService.encontrarPorId(parseInt(userId));
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Busca o serviço e verifica se existe
    const servico = await this.servicesService.findOne(createProposalDto.servicoId);
    if (!servico) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // Verifica se já existe proposta pendente do mesmo usuário
    const propostaExistente = await this.proposalsRepository.findOne({
      where: {
        servicoId: createProposalDto.servicoId,
        clienteId: userId,
        status: ProposalStatus.PENDING
      }
    });

    if (propostaExistente) {
      throw new BadRequestException('Já existe uma proposta pendente sua para este serviço');
    }

    // Define cliente e prestador baseado no tipo do usuário
    let clienteId: string;
    let prestadorId: string;

    if (usuario.tipo === TipoUsuario.SOLICITANTE) {
      clienteId = userId;
      prestadorId = servico.usuario.id.toString();
    } else if (usuario.tipo === TipoUsuario.PRESTADOR) {
      // Verifica se o prestador não é o dono do serviço
      if (servico.usuario.id.toString() === userId) {
        throw new BadRequestException('Você não pode fazer proposta para seu próprio serviço');
      }
      clienteId = servico.usuario.id.toString();
      prestadorId = userId;
    } else {
      throw new ForbiddenException('Tipo de usuário não permitido para criar propostas');
    }

    // Cria a proposta
    const proposta = this.proposalsRepository.create({
      descricao: createProposalDto.descricao,
      valorProposto: createProposalDto.valorProposto,
      servicoId: createProposalDto.servicoId,
      clienteId,
      prestadorId,
      dataExpiracao: addDays(new Date(), 7)
    });

    const propostaSalva = await this.proposalsRepository.save(proposta);
    
    // Registra o histórico de criação
    await this.registrarHistorico(
      propostaSalva,
      null,
      ProposalStatus.PENDING,
      userId,
      'Proposta criada'
    );

    return propostaSalva;
  }

  async findAllByUser(userId: string): Promise<Proposal[]> {
    return this.proposalsRepository.find({
      where: [
        { clienteId: userId },
        { prestadorId: userId }
      ],
      relations: ['cliente', 'prestador', 'servico'],
      order: {
        dataCriacao: 'DESC'
      }
    });
  }

  async findAllByService(serviceId: string): Promise<Proposal[]> {
    return this.proposalsRepository.find({
      where: { servicoId: serviceId },
      relations: ['cliente', 'prestador', 'servico'],
      order: {
        dataCriacao: 'DESC'
      }
    });
  }

  async accept(id: string, prestadorId: string): Promise<Proposal> {
    const proposta = await this.findProposalAndCheckProvider(id, prestadorId);

    if (proposta.status !== ProposalStatus.PENDING) {
      throw new BadRequestException('Apenas propostas pendentes podem ser aceitas');
    }

    const statusAnterior = proposta.status;
    proposta.status = ProposalStatus.ACCEPTED;
    const propostaAtualizada = await this.proposalsRepository.save(proposta);

    // Registra o histórico de aceitação
    await this.registrarHistorico(
      propostaAtualizada,
      statusAnterior,
      ProposalStatus.ACCEPTED,
      prestadorId,
      'Proposta aceita'
    );

    return propostaAtualizada;
  }

  async reject(id: string, prestadorId: string, updateDto: UpdateProposalStatusDto): Promise<Proposal> {
    const proposta = await this.findProposalAndCheckProvider(id, prestadorId);

    if (proposta.status !== ProposalStatus.PENDING) {
      throw new BadRequestException('Apenas propostas pendentes podem ser recusadas');
    }

    const statusAnterior = proposta.status;
    proposta.status = ProposalStatus.REJECTED;
    const propostaAtualizada = await this.proposalsRepository.save(proposta);

    // Registra o histórico de recusa
    await this.registrarHistorico(
      propostaAtualizada,
      statusAnterior,
      ProposalStatus.REJECTED,
      prestadorId,
      updateDto.motivo
    );

    return propostaAtualizada;
  }

  private async findProposalAndCheckProvider(id: string, prestadorId: string): Promise<Proposal> {
    const proposta = await this.proposalsRepository.findOne({
      where: { id },
      relations: ['prestador']
    });

    if (!proposta) {
      throw new NotFoundException('Proposta não encontrada');
    }

    if (proposta.prestadorId !== prestadorId) {
      throw new ForbiddenException('Apenas o prestador do serviço pode aceitar ou recusar propostas');
    }

    return proposta;
  }

  // Método para expirar propostas antigas (pode ser chamado por um cron job)
  async expireOldProposals(): Promise<void> {
    const dataAtual = new Date();
    const propostasExpiradas = await this.proposalsRepository.find({
      where: {
        status: ProposalStatus.PENDING,
        dataExpiracao: LessThan(dataAtual)
      }
    });

    for (const proposta of propostasExpiradas) {
      const statusAnterior = proposta.status;
      proposta.status = ProposalStatus.EXPIRED;
      await this.proposalsRepository.save(proposta);

      // Registra o histórico de expiração
      await this.registrarHistorico(
        proposta,
        statusAnterior,
        ProposalStatus.EXPIRED,
        proposta.prestadorId,
        'Proposta expirada automaticamente'
      );
    }
  }

  // Método para buscar histórico de uma proposta
  async findHistory(proposalId: string): Promise<ProposalHistory[]> {
    return this.proposalHistoryRepository.find({
      where: { proposalId },
      relations: ['usuario'],
      order: {
        dataAlteracao: 'DESC'
      }
    });
  }
} 