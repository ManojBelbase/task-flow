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

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, env.jwt.secret as Secret) as TokenPayload;
};
