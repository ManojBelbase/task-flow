import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import routes from './routes';

const app = express();

app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (env.cors.allowedOrigins.length === 0) return callback(null, true);

        if (env.cors.allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});
app.get('/', (_req, res) => {
    res.status(200).json({
        message: 'Welcome to TaskFlow API',
        endpoints: {
            health: '/health',
            documentation: '/api/docs (if enabled)',
        }
    });
});

app.use('/api', routes);

app.use(errorHandler);

export default app;
