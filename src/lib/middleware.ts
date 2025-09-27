import { extractTokenFromCookie, verifyToken } from "./jwt.ts";
import type { AuthenticatedUser } from "./types.ts";

export function authenticateUser(
  cookieHeader?: string,
): AuthenticatedUser | null {
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
    email: payload.email,
  };
}

export function authenticateRequest(request: Request): AuthenticatedUser | null {
  const cookieHeader = request.headers.get("cookie");
  return authenticateUser(cookieHeader || undefined);
}
