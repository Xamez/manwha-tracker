import jwt from 'jsonwebtoken';

export function createToken(userId: string) {
    const config = useRuntimeConfig();
    const secret = config.jwtSecret;
    const token = jwt.sign({ userId }, secret, { expiresIn: '7d' });
    return token;
}