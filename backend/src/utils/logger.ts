import winston from 'winston';
import { env } from '../config/env';

const levels: Record<string, number> = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = (): string => {
    return env.nodeEnv === 'development' ? 'debug' : 'warn';
};

const colors: Record<string, string> = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info: winston.Logform.TransformableInfo) =>
        `${info.timestamp as string} ${info.level}: ${info.message as string}`
    ),
);

const transports = [new winston.transports.Console()];

export const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});
