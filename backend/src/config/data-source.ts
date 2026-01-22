import { DataSource } from 'typeorm';
import { env } from './env';
import path from 'path';

export const AppDataSource = new DataSource({
    type: 'postgres',
    ...(env.db.url ? { url: env.db.url } : {
        host: env.db.host,
        port: env.db.port,
        username: env.db.username,
        password: env.db.password,
        database: env.db.database,
    }),
    ssl: env.db.ssl ? { rejectUnauthorized: false } : false,
    synchronize: false, // Always use migrations in production
    logging: env.nodeEnv === 'development',
    entities: [path.join(__dirname, '../entities/*.entity.{ts,js}')],
    migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
    subscribers: [],
});
