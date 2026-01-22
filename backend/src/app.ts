import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import routes from './routes';

const app = express();

// Global Middlewares
app.use(helmet({
    crossOriginResourcePolicy: false, // Allow images/resources from other origins
}));
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // If no origins specified in env, allow all (default for safety)
        if (env.cors.allowedOrigins.length === 0) return callback(null, true);

        if (env.cors.allowedOrigins.indexOf(origin) !== -1) {
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

// Health Check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Root Route (for easy verification)
app.get('/', (_req, res) => {
    res.status(200).json({
        message: 'Welcome to TaskFlow API',
        endpoints: {
            health: '/health',
            documentation: '/api/docs (if enabled)',
        }
    });
});

// Routes Registration
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

export default app;
