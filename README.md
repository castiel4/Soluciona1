# Soluciona Backend

Backend da aplicação Soluciona desenvolvido com NestJS e Clean Architecture.

## Estrutura do Projeto

O projeto segue a Clean Architecture e está organizado nos seguintes diretórios:

- `src/core`: Contém as entidades, interfaces e casos de uso do domínio
- `src/modules`: Contém os módulos da aplicação (auth, users, etc.)
- `src/shared`: Contém serviços, helpers e middlewares reutilizáveis
- `src/config`: Contém as configurações da aplicação

## Módulo de Autenticação

O módulo de autenticação (`auth`) implementa as seguintes funcionalidades:

### Cadastro de Usuário
- Endpoint: `POST /auth/register`
- Campos obrigatórios:
  - `name`: Nome do usuário
  - `email`: E-mail do usuário (único)
  - `password`: Senha do usuário (mínimo 6 caracteres)
  - `document`: CPF/CNPJ do usuário (único)
  - `type`: Tipo do usuário (PROVIDER ou REQUESTER)

### Login
- Endpoint: `POST /auth/login`
- Campos obrigatórios:
  - `email`: E-mail do usuário
  - `password`: Senha do usuário
- Retorna um token JWT válido por 7 dias

### Segurança
- Senhas são criptografadas com bcrypt
- Tokens JWT são assinados com uma chave secreta configurada em `.env`
- Middleware de autenticação protege rotas que requerem autenticação

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente
4. Execute o projeto:
   ```bash
   npm run start:dev
   ```

## Documentação da API

A documentação da API está disponível em `/api` quando o servidor estiver rodando.

## Tratamento de Erros

O projeto implementa um middleware global de tratamento de erros que:
- Captura todas as exceções não tratadas
- Formata as respostas de erro de forma consistente
- Inclui timestamp e código de status HTTP nas respostas de erro 