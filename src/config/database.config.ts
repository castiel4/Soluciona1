import { TypeOrmModuleOptions } from '@nestjs/typeorm';

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

const databaseConfig: DatabaseConfig = {
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'soluciona',
};

export const getTypeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  ...databaseConfig,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Apenas para desenvolvimento
});

// Log para debug
console.log('Database Config:', {
  ...databaseConfig,
  password: '******'
}); 