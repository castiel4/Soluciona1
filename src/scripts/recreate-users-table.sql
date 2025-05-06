-- Primeiro, vamos dropar a tabela existente
DROP TABLE IF EXISTS usuarios;

-- Agora, vamos criar a tabela novamente com a estrutura correta
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
); 