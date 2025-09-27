import jwt from "jsonwebtoken";
import { SERVER_ENV } from "./env.js";
import type { AuthenticatedUser } from "./types.js";

export interface JwtPayload extends AuthenticatedUser {}

const JWT_SECRET = SERVER_ENV.JWT_SECRET;
const JWT_EXPIRES_IN = SERVER_ENV.JWT_EXPIRES_IN;

export function generateToken(payload: JwtPayload): string {
  // deno-lint-ignore ban-ts-comment
  // @ts-ignore
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export function extractTokenFromCookie(cookieHeader?: string): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce(
    (acc: Record<string, string>, cookie) => {
      const [name, value] = cookie.trim().split("=");
      acc[name] = value;
      return acc;
    },
    {},
  );

  return cookies.token || null;
}
