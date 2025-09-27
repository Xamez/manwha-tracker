import { verifyToken, extractTokenFromCookie } from '../lib/jwt.ts';

export interface AuthenticatedUser {
	userId: string;
	username: string;
	email: string;
}

export function authenticateUser(cookieHeader?: string): AuthenticatedUser | null {
	const token = extractTokenFromCookie(cookieHeader);
	
	if (!token) {
		return null;
	}

	const payload = verifyToken(token);
	
	if (!payload) {
		return null;
	}

	return {
		userId: payload.userId,
		username: payload.username,
		email: payload.email
	};
}