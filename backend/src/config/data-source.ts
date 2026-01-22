import { DataSource } from 'typeorm';
import { env } from './env';
import path from 'path';
import { User } from '../entities/User.entity';
import { Task } from '../entities/Task.entity';

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
    synchronize: false,
    logging: env.nodeEnv === 'development',
    entities: [User, Task],
    migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
    subscribers: [],
});
