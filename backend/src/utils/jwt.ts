import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
    userId: string;
    role: string;
}

export const signToken = (payload: TokenPayload): string => {
    const options: SignOptions = {
        expiresIn: env.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    };
    return jwt.sign(payload, env.jwt.secret as Secret, options);
};

export const signRefreshToken = (payload: TokenPayload): string => {
    const options: SignOptions = {
        expiresIn: env.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
    };
    return jwt.sign(payload, env.jwt.refreshSecret as Secret, options);
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, env.jwt.secret as Secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, env.jwt.refreshSecret as Secret) as TokenPayload;
};
