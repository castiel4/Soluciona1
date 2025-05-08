import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avaliacao } from './entities/avaliacao.entity';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { ServicesService } from '../services/services.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { TipoUsuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AvaliacoesService {
  constructor(
    @InjectRepository(Avaliacao)
    private avaliacoesRepository: Repository<Avaliacao>,
    private servicesService: ServicesService,
    private usuariosService: UsuariosService,
  ) {}

  async create(createAvaliacaoDto: CreateAvaliacaoDto, userId: string): Promise<Avaliacao> {
    // Busca o serviço
    const servico = await this.servicesService.findOne(createAvaliacaoDto.servicoId);
    if (!servico) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // Verifica se o usuário é o solicitante do serviço
    const usuario = await this.usuariosService.encontrarPorId(parseInt(userId));
    if (!usuario || usuario.tipo !== TipoUsuario.SOLICITANTE) {
      throw new ForbiddenException('Apenas solicitantes podem avaliar serviços');
    }

    // Verifica se já existe uma avaliação para este serviço
    const avaliacaoExistente = await this.avaliacoesRepository.findOne({
      where: {
        servicoId: createAvaliacaoDto.servicoId,
        clienteId: userId
      }
    });

    if (avaliacaoExistente) {
      throw new BadRequestException('Você já avaliou este serviço');
    }

    // Cria a avaliação
    const avaliacao = this.avaliacoesRepository.create({
      ...createAvaliacaoDto,
      clienteId: userId,
      prestadorId: servico.usuarioId.toString()
    });

    // Salva a avaliação
    const avaliacaoSalva = await this.avaliacoesRepository.save(avaliacao);

    // Atualiza a média de avaliações do prestador
    await this.atualizarMediaAvaliacoes(servico.usuarioId);

    return avaliacaoSalva;
  }

  async findAllByPrestador(prestadorId: string): Promise<Avaliacao[]> {
    return this.avaliacoesRepository.find({
      where: { prestadorId },
      relations: ['cliente', 'servico'],
      order: {
        dataCriacao: 'DESC'
      }
    });
  }

  async findByServico(servicoId: string): Promise<Avaliacao> {
    return this.avaliacoesRepository.findOne({
      where: { servicoId },
      relations: ['cliente', 'prestador']
    });
  }

  private async atualizarMediaAvaliacoes(prestadorId: number): Promise<void> {
    // Calcula a nova média
    const result = await this.avaliacoesRepository
      .createQueryBuilder('avaliacao')
      .select('AVG(avaliacao.nota)', 'media')
      .addSelect('COUNT(*)', 'total')
      .where('avaliacao.prestador_id = :prestadorId', { prestadorId })
      .getRawOne();

    // Atualiza o usuário
    await this.usuariosService.atualizarMediaAvaliacoes(
      prestadorId,
      parseFloat(result.media) || 0,
      parseInt(result.total) || 0
    );
  }
} 