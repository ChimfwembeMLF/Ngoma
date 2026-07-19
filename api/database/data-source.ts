import * as path from 'path';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from '../src/snake-naming.strategy';

config({ path: path.join(__dirname, '../.env') });
config({ path: path.join(__dirname, '../.env.development') });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'ngoma',
  password: process.env.DB_PASSWORD || 'ngoma',
  database: process.env.DB_DATABASE || 'ngoma',
  entities: [path.join(__dirname, '../src/**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, './migrations/*.{ts,js}')],
  namingStrategy: new SnakeNamingStrategy(),
});
