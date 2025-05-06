import { DataSource } from 'typeorm';

async function testConnection() {
    try {
        const dataSource = new DataSource({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '1234',
            database: 'soluciona',
        });
        
        await dataSource.initialize();
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        
        // Testando uma consulta simples
        const result = await dataSource.query('SELECT NOW()');
        console.log('Data e hora atual do banco de dados:', result[0].now);
        
        await dataSource.destroy();
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
}

testConnection(); 