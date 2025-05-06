import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { TipoUsuario } from '../modules/usuarios/entities/usuario.entity';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../modules/usuarios/entities/usuario.entity';

describe('Testes de Usuários', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '1234',
          database: 'soluciona_test',
          entities: [Usuario],
          synchronize: true,
          dropSchema: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get(DataSource);
    await app.init();
  });

  beforeEach(async () => {
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE`);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve criar um usuário com sucesso', async () => {
    const response = await request(app.getHttpServer())
      .post('/usuarios')
      .send({
        nome: 'Teste Usuario',
        email: 'teste@teste.com',
        senha: 'senha123',
        tipo: TipoUsuario.PRESTADOR,
        telefone: '(11) 99999-9999',
        endereco: 'Rua Teste, 123',
        biografia: 'Usuário de teste',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('teste@teste.com');
  });

  it('deve impedir criação de usuário com email duplicado', async () => {
    // Primeiro usuário
    await request(app.getHttpServer())
      .post('/usuarios')
      .send({
        nome: 'Primeiro Usuário',
        email: 'duplicado@teste.com',
        senha: 'senha123',
        tipo: TipoUsuario.PRESTADOR,
      });

    // Tentativa de criar segundo usuário com mesmo email
    const response = await request(app.getHttpServer())
      .post('/usuarios')
      .send({
        nome: 'Segundo Usuário',
        email: 'duplicado@teste.com',
        senha: 'senha123',
        tipo: TipoUsuario.PRESTADOR,
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Já existe um usuário cadastrado com este email');
  });

  it('deve fazer login com sucesso', async () => {
    // Primeiro cria o usuário
    await request(app.getHttpServer())
      .post('/usuarios')
      .send({
        nome: 'Usuario Login',
        email: 'login@teste.com',
        senha: 'senha123',
        tipo: TipoUsuario.PRESTADOR,
      });

    // Tenta fazer login
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'login@teste.com',
        senha: 'senha123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
  });

  it('deve encontrar usuário por email', async () => {
    // Primeiro cria o usuário
    await request(app.getHttpServer())
      .post('/usuarios')
      .send({
        nome: 'Usuario Busca',
        email: 'busca@teste.com',
        senha: 'senha123',
        tipo: TipoUsuario.PRESTADOR,
      });

    // Busca o usuário
    const response = await request(app.getHttpServer())
      .get('/usuarios/email/busca@teste.com');

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('busca@teste.com');
  });
}); 