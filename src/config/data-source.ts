import { DataSource } from 'typeorm';
import { join } from 'path';

const databaseConfig = {
  type: 'postgres' as const,
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'soluciona',
};

export default new DataSource({
  ...databaseConfig,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
  synchronize: false,
  logging: true,
}); 