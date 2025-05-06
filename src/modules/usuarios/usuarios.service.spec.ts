import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuariosService } from './usuarios.service';
import { Usuario, TipoUsuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let repository: Repository<Usuario>;

  const mockUsuario = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    senha: 'senha_criptografada',
    tipo: TipoUsuario.PRESTADOR,
    telefone: '11999999999',
    endereco: 'Rua Teste, 123',
    biografia: 'Prestador de serviços gerais',
    fotoPerfil: null,
    avaliacaoMedia: 0,
    totalAvaliacoes: 0,
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    repository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('criarUsuario', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      const createUsuarioDto: CreateUsuarioDto = {
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: '123456',
        tipo: TipoUsuario.PRESTADOR,
        telefone: '11999999999',
        endereco: 'Rua Teste, 123',
        biografia: 'Prestador de serviços gerais',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('senha_criptografada' as never);
      mockRepository.create.mockReturnValue(mockUsuario);
      mockRepository.save.mockResolvedValue(mockUsuario);

      const resultado = await service.criarUsuario(createUsuarioDto);

      expect(resultado).toEqual(mockUsuario);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUsuarioDto.senha, 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUsuarioDto,
        senha: 'senha_criptografada',
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('encontrarPorEmail', () => {
    it('deve encontrar um usuário por email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUsuario);

      const resultado = await service.encontrarPorEmail('joao@email.com');

      expect(resultado).toEqual(mockUsuario);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'joao@email.com' },
      });
    });

    it('deve lançar NotFoundException quando usuário não for encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.encontrarPorEmail('email@inexistente.com')).rejects.toThrow();
    });
  });

  describe('encontrarPorId', () => {
    it('deve encontrar um usuário por ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockUsuario);

      const resultado = await service.encontrarPorId(1);

      expect(resultado).toEqual(mockUsuario);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('deve lançar NotFoundException quando usuário não for encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.encontrarPorId(999)).rejects.toThrow();
    });
  });

  describe('atualizarUsuario', () => {
    it('deve atualizar um usuário com sucesso', async () => {
      const updateUsuarioDto: UpdateUsuarioDto = {
        telefone: '11988888888',
        biografia: 'Nova biografia',
      };

      mockRepository.findOne.mockResolvedValue(mockUsuario);
      mockRepository.save.mockResolvedValue({
        ...mockUsuario,
        ...updateUsuarioDto,
      });

      const resultado = await service.atualizarUsuario(1, updateUsuarioDto);

      expect(resultado).toEqual({
        ...mockUsuario,
        ...updateUsuarioDto,
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('deve criptografar a senha quando fornecida na atualização', async () => {
      const updateUsuarioDto: UpdateUsuarioDto = {
        senha: 'nova_senha',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('nova_senha_criptografada' as never);
      mockRepository.findOne.mockResolvedValue(mockUsuario);
      mockRepository.save.mockResolvedValue({
        ...mockUsuario,
        senha: 'nova_senha_criptografada',
      });

      await service.atualizarUsuario(1, updateUsuarioDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('nova_senha', 10);
    });
  });

  describe('listarPorTipo', () => {
    it('deve listar usuários por tipo', async () => {
      const usuarios = [mockUsuario];
      mockRepository.find.mockResolvedValue(usuarios);

      const resultado = await service.listarPorTipo(TipoUsuario.PRESTADOR);

      expect(resultado).toEqual(usuarios);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { tipo: TipoUsuario.PRESTADOR },
        select: ['id', 'nome', 'email', 'tipo', 'fotoPerfil', 'telefone', 'endereco', 'biografia', 'avaliacaoMedia', 'totalAvaliacoes'],
      });
    });
  });

  describe('atualizarAvaliacao', () => {
    it('deve atualizar a avaliação média do usuário', async () => {
      const usuarioComAvaliacao = {
        ...mockUsuario,
        avaliacaoMedia: 4.5,
        totalAvaliacoes: 2,
      };

      mockRepository.findOne.mockResolvedValue(usuarioComAvaliacao);
      mockRepository.save.mockResolvedValue({
        ...usuarioComAvaliacao,
        avaliacaoMedia: 4.33,
        totalAvaliacoes: 3,
      });

      const resultado = await service.atualizarAvaliacao(1, 4);

      expect(resultado.avaliacaoMedia).toBeCloseTo(4.33, 2);
      expect(resultado.totalAvaliacoes).toBe(3);
    });
  });
}); 