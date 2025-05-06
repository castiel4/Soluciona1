import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { TipoUsuario } from './entities/usuario.entity';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: UsuariosService;

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

  const mockUsuariosService = {
    criarUsuario: jest.fn(),
    encontrarPorId: jest.fn(),
    encontrarPorEmail: jest.fn(),
    atualizarUsuario: jest.fn(),
    listarPorTipo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: UsuariosService,
          useValue: mockUsuariosService,
        },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
    service = module.get<UsuariosService>(UsuariosService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('criar', () => {
    it('deve criar um novo usuário', async () => {
      const createUsuarioDto: CreateUsuarioDto = {
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: '123456',
        tipo: TipoUsuario.PRESTADOR,
        telefone: '11999999999',
        endereco: 'Rua Teste, 123',
        biografia: 'Prestador de serviços gerais',
      };

      mockUsuariosService.criarUsuario.mockResolvedValue(mockUsuario);

      const resultado = await controller.criar(createUsuarioDto);

      expect(resultado).toEqual(mockUsuario);
      expect(service.criarUsuario).toHaveBeenCalledWith(createUsuarioDto);
    });
  });

  describe('encontrarUm', () => {
    it('deve encontrar um usuário por ID', async () => {
      mockUsuariosService.encontrarPorId.mockResolvedValue(mockUsuario);

      const resultado = await controller.encontrarUm('1');

      expect(resultado).toEqual(mockUsuario);
      expect(service.encontrarPorId).toHaveBeenCalledWith(1);
    });
  });

  describe('encontrarPorEmail', () => {
    it('deve encontrar um usuário por email', async () => {
      mockUsuariosService.encontrarPorEmail.mockResolvedValue(mockUsuario);

      const resultado = await controller.encontrarPorEmail('joao@email.com');

      expect(resultado).toEqual(mockUsuario);
      expect(service.encontrarPorEmail).toHaveBeenCalledWith('joao@email.com');
    });
  });

  describe('atualizar', () => {
    it('deve atualizar um usuário', async () => {
      const updateUsuarioDto: UpdateUsuarioDto = {
        telefone: '11988888888',
        biografia: 'Nova biografia',
      };

      mockUsuariosService.atualizarUsuario.mockResolvedValue({
        ...mockUsuario,
        ...updateUsuarioDto,
      });

      const resultado = await controller.atualizar('1', updateUsuarioDto);

      expect(resultado).toEqual({
        ...mockUsuario,
        ...updateUsuarioDto,
      });
      expect(service.atualizarUsuario).toHaveBeenCalledWith(1, updateUsuarioDto);
    });
  });

  describe('listarPorTipo', () => {
    it('deve listar usuários por tipo', async () => {
      const usuarios = [mockUsuario];
      mockUsuariosService.listarPorTipo.mockResolvedValue(usuarios);

      const resultado = await controller.listarPorTipo(TipoUsuario.PRESTADOR);

      expect(resultado).toEqual(usuarios);
      expect(service.listarPorTipo).toHaveBeenCalledWith(TipoUsuario.PRESTADOR);
    });
  });
}); 