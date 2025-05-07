import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Between } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { TipoUsuario } from '../usuarios/entities/usuario.entity';
import { CategoriaServico } from './enums/categorias.enum';
import { CreateServiceWithUser } from './interfaces/create-service-with-user.interface';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    private usuariosService: UsuariosService,
  ) {}

  private async checkDuplicateService(data: CreateServiceWithUser): Promise<void> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const similarServices = await this.servicesRepository.find({
      where: [
        {
          // Caso 1: Mesmo título exato, categoria e subcategoria
          usuarioId: data.usuarioId,
          titulo: data.titulo,
          categoria: data.categoria,
          subcategoria: data.subcategoria,
          dataCriacao: MoreThanOrEqual(sevenDaysAgo)
        },
        {
          // Caso 2: Título similar (contém as mesmas palavras-chave)
          usuarioId: data.usuarioId,
          categoria: data.categoria,
          subcategoria: data.subcategoria,
          dataCriacao: MoreThanOrEqual(sevenDaysAgo)
        }
      ]
    });

    // Verifica se algum serviço tem título similar
    const tituloTokens = data.titulo.toLowerCase().split(' ').filter(token => token.length > 3);
    const hasSimilarTitle = similarServices.some(service => {
      const serviceTokens = service.titulo.toLowerCase().split(' ').filter(token => token.length > 3);
      const commonWords = tituloTokens.filter(token => serviceTokens.includes(token));
      return commonWords.length >= Math.min(tituloTokens.length, serviceTokens.length) * 0.8; // 80% de palavras em comum
    });

    if (hasSimilarTitle) {
      throw new BadRequestException({
        message: 'Serviço similar já cadastrado',
        details: 'Você já possui um serviço similar cadastrado nos últimos 7 dias.',
        suggestions: [
          'Aguarde o período de 7 dias para cadastrar um serviço similar',
          'Atualize o serviço existente em vez de criar um novo',
          'Crie um serviço com título ou categoria diferentes'
        ]
      });
    }
  }

  async create(data: CreateServiceWithUser): Promise<Service> {
    const usuario = await this.usuariosService.encontrarPorId(data.usuarioId);

    if (usuario.tipo !== TipoUsuario.PRESTADOR) {
      throw new ForbiddenException('Apenas prestadores podem cadastrar serviços');
    }

    // Verifica serviços duplicados
    await this.checkDuplicateService(data);

    const service = this.servicesRepository.create(data);
    return this.servicesRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.servicesRepository.find({
      relations: ['usuario'],
      select: {
        usuario: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
        },
      },
    });
  }

  async findByUserId(usuarioId: number): Promise<Service[]> {
    return this.servicesRepository.find({
      where: { usuarioId },
      relations: ['usuario'],
      select: {
        usuario: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
        },
      },
    });
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { id },
      relations: ['usuario'],
      select: {
        usuario: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
        },
      },
    });

    if (!service) {
      throw new NotFoundException(`Serviço com ID ${id} não encontrado`);
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, usuarioId: number): Promise<Service> {
    const service = await this.findOne(id);

    if (service.usuarioId !== usuarioId) {
      throw new ForbiddenException('Você não tem permissão para editar este serviço');
    }

    Object.assign(service, updateServiceDto);
    return this.servicesRepository.save(service);
  }

  async remove(id: string, usuarioId: number): Promise<void> {
    const service = await this.findOne(id);

    if (service.usuarioId !== usuarioId) {
      throw new ForbiddenException('Você não tem permissão para remover este serviço');
    }

    await this.servicesRepository.remove(service);
  }

  async search(
    query: string,
    categoria?: CategoriaServico,
    minPreco?: number,
    maxPreco?: number,
  ): Promise<Service[]> {
    const queryBuilder = this.servicesRepository
      .createQueryBuilder('service')
      .where(
        `to_tsvector('portuguese', unaccent(service.titulo) || ' ' || unaccent(service.descricao)) @@ plainto_tsquery('portuguese', unaccent(:query))`,
        { query }
      )
      .orWhere(
        'LOWER(unaccent(service.titulo)) LIKE LOWER(unaccent(:searchTerm))',
        { searchTerm: `%${query}%` }
      )
      .orWhere(
        'LOWER(unaccent(service.descricao)) LIKE LOWER(unaccent(:searchTerm))',
        { searchTerm: `%${query}%` }
      );

    if (categoria) {
      queryBuilder.andWhere('service.categoria = :categoria', { categoria });
    }

    if (minPreco !== undefined) {
      queryBuilder.andWhere('service.preco >= :minPreco', { minPreco });
    }

    if (maxPreco !== undefined) {
      queryBuilder.andWhere('service.preco <= :maxPreco', { maxPreco });
    }

    queryBuilder
      .orderBy('service.dataCriacao', 'DESC')
      .addOrderBy(
        `ts_rank(to_tsvector('portuguese', service.titulo || ' ' || service.descricao), plainto_tsquery('portuguese', :query))`,
        'DESC'
      );

    return queryBuilder.getMany();
  }
} 