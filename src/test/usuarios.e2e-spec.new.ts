import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { TipoUsuario } from '../modules/usuarios/entities/usuario.entity';

describe('UsuariosController (e2e)', () => {
  let app: INestApplication;
  let usuarioId: number;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Teste de autenticação
  it('/auth/login (POST) - Login com credenciais inválidas', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'teste@teste.com',
        senha: 'senha_errada'
      })
      .expect(401);
  });

  // Teste de criação de usuário
  it('/usuarios (POST) - Criar novo usuário', async () => {
    const response = await request(app.getHttpServer())
      .post('/usuarios')
      .send({
        nome: 'Usuário Teste',
        email: 'teste@teste.com',
        senha: 'senha123',
        tipo: TipoUsuario.PRESTADOR,
        telefone: '(11) 99999-9999',
        endereco: 'Rua Teste, 123',
        biografia: 'Biografia de teste'
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('teste@teste.com');
    expect(response.body.tipo).toBe(TipoUsuario.PRESTADOR);
    usuarioId = response.body.id;
  });

  // Teste de login com o usuário criado
  it('/auth/login (POST) - Login com credenciais válidas', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'teste@teste.com',
        senha: 'senha123'
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    token = response.body.access_token;
  });

  // Teste de busca por ID
  it('/usuarios/:id (GET) - Buscar usuário por ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/usuarios/${usuarioId}`)
      .expect(200);

    expect(response.body.id).toBe(usuarioId);
    expect(response.body.email).toBe('teste@teste.com');
  });

  // Teste de busca por email
  it('/usuarios/email/:email (GET) - Buscar usuário por email', async () => {
    const response = await request(app.getHttpServer())
      .get('/usuarios/email/teste@teste.com')
      .expect(200);

    expect(response.body.email).toBe('teste@teste.com');
  });

  // Teste de atualização de usuário
  it('/usuarios/:id (PUT) - Atualizar usuário', async () => {
    const response = await request(app.getHttpServer())
      .put(`/usuarios/${usuarioId}`)
      .send({
        nome: 'Usuário Teste Atualizado',
        telefone: '(11) 98888-8888',
        endereco: 'Rua Nova, 456',
        biografia: 'Nova biografia de teste'
      })
      .expect(200);

    expect(response.body.nome).toBe('Usuário Teste Atualizado');
    expect(response.body.telefone).toBe('(11) 98888-8888');
  });

  // Teste de listagem por tipo
  it('/usuarios/tipo/:tipo (GET) - Listar usuários por tipo', async () => {
    const response = await request(app.getHttpServer())
      .get(`/usuarios/tipo/${TipoUsuario.PRESTADOR}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].tipo).toBe(TipoUsuario.PRESTADOR);
  });

  // Teste de criação de usuário com email duplicado
  it('/usuarios (POST) - Deve retornar erro ao tentar criar usuário com email duplicado', async () => {
    const response = await request(app.getHttpServer())
      .post('/usuarios')
      .send({
        nome: 'Outro Usuário',
        email: 'teste@teste.com', // mesmo email do usuário anterior
        senha: 'senha123',
        tipo: TipoUsuario.PRESTADOR,
      })
      .expect(409); // Código de conflito

    expect(response.body.message).toBe('Já existe um usuário cadastrado com este email');
  });
}); 