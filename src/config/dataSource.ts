import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const options: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '1234',
    database: 'soluciona',
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
};

const dataSource = new DataSource(options);

export default dataSource; 