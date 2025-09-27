import * as jwt from 'jsonwebtoken';
import process from 'node:process';

export interface JwtPayload {
	userId: string;
	username: string;
	email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function generateToken(payload: JwtPayload): string {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		return decoded;
	} catch (error) {
		console.error('JWT verification failed:', error);
		return null;
	}
}

export function extractTokenFromCookie(cookieHeader?: string): string | null {
	if (!cookieHeader) return null;
	
	const cookies = cookieHeader.split(';').reduce((acc: Record<string, string>, cookie) => {
		const [name, value] = cookie.trim().split('=');
		acc[name] = value;
		return acc;
	}, {});
	
	return cookies.token || null;
}